package Chat::Schema::Result::Message;

use base 'DBIx::Class::Core';
use utf8;
use common::sense;

__PACKAGE__->load_components(qw<DateTime::Epoch TimeStamp>);
__PACKAGE__->table('message');
__PACKAGE__->add_columns(
  id   => { data_type => 'int', is_nullable => 0, is_auto_increment => 1 },
  at   => { data_type => 'bigint', is_nullable => 0, inflate_datetime => 1, set_on_create => 1 },
  user => { data_type => 'text', is_nullable => 0 },
  text => { data_type => 'text', is_nullable => 0 },
);
__PACKAGE__->set_primary_key("id");

1;
