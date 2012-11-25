package Chat;

use Mojo::Base 'Mojolicious';
use Mojo::IOLoop;
use FindBin;
use Chat::Schema;

# This method will run once at server start
sub startup {
    my ($self) = @_;

    my $bin = "$FindBin::Bin/..";

    # config / setup
    $self->plugin(Config => {
        file => 'etc/chat.conf'
    });

    my $sql_db = "$bin/chat.sqlite";
    $self->helper(schema => sub {
        state $db = Chat::Schema->connect("dbi:SQLite:dbname=$sql_db", '', '', {
            sqlite_unicode => 1,
        });
        return $db;
    });
    $self->helper(rs     => sub { shift->schema->rs(@_) });
    $self->helper(rsfind => sub { shift->schema->rsfind(@_) });

    $self->secret("it's good to chat");

    my $r = $self->routes;
    $r->post("/say")
        ->to(controller => 'msg', action => 'say');
    $r->get("/poll")
        ->to(controller => 'msg', action => 'poll');
}

1;
