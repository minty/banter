package Chat::Msg;

use Mojo::Base 'Mojolicious::Controller';
use common::sense;

sub say {
    my ($self) = @_;

    my $user = $self->param('user')
        || return $self->render(json => { error => 'no user' });
    my $text = $self->param('text')
        || return $self->render(json => { error => 'no text' });

    my $msg = $self->rs('Message')->create({
        user => $user,
        text => $text,
    });

    return $self->render(json => { 'last' => $msg->id });
}

sub poll {
    my ($self) = @_;

    my $since = $self->param('since')
        || return $self->render(json => { error => 'no since id' });

    return $self->render(json => { error => 'bad since id' })
        if $since !~ /\A\d+\z/;

    my $msg;
    my $id;
    my $start  = time;
    my $poll   = 60;
    my $freq   = 1;
    my $clear  = sub { Mojo::IOLoop->remove($id) };
    my $stream = Mojo::IOLoop->stream($self->tx->connection);

    # If the client kills the connect, we want to kill the recurring timer
    my $abort = 0;
    $stream->on(close => sub { $abort = 1 });
    $stream->timeout($poll * 2);

    $id = Mojo::IOLoop->recurring($freq => sub {
        my $delta = time - $start;
        my $msgs = $self->rs('Message')->search(
            { id => { '>=' => $since } },
            { order_by => { -asc => 'id' } }
        );
        $msgs->result_class('DBIx::Class::ResultClass::HashRefInflator');

        my $finish = 0;
        $finish = 1
            if $abort           # stream closed (client disconnect)
            || $msgs->count     # we found new messages
            || $delta > $poll;  # we hit a timeout

        if ($finish) {
            $clear->();
            $self->render(json => [ $msgs->all ]);
        }
    });
}

1;
