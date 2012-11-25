use strict;
use warnings;

use ExtUtils::MakeMaker;

WriteMakefile(
    PREREQ_PM => {
        'Mojolicious'           => 0,
        'DBIx::Class'           => 0,
        'DBIx::Class::Schema'   => 0,
        'common::sense'         => 0,
    },
);
