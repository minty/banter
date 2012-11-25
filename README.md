# Banter

A very simple web based chat.

## Why?

* If you have no internet, but do have shared wifi and want to chat, or send text/code to nearby friends.
* Because it was a fun way to kill a couple of hours on a train journey (with no wifi).


## How?

    # git clone https://github.com/minty/banter/
    cd banter
    cpanm --installdeps .
    sqlite3 chat.sqlite < ./schema.sql
    morbo ./script/chat
    # or
    # morbo -l "http://192.168.0.123:8888" ./script/chat

Then point your browser to the ip/port your morbo server, eg:

* (default) http://127.0.0.1:3000/index.html
* (or alt above) http://192.168.0.123:8888/index.html

You'll need a reasonably modern browser.  Seems to work just fine on Firefox 17, Chrome 23 or iOS 5 Mobile Safari.

## No internet?

* [Use a Mac as a wifi router](http://www.macinstruct.com/node/118).
* Use an iPhone & create a Personal Hotspot
* Use a mifi dongle, Android phone, etc
* Use any regular wifi router

You don't need an internet connection for this to work, but you **do** need any
devices you want to chat to be able to "see" / reach each other.

This is primarily what it was created for.  Being able to chat while without an internet connection.

## ircd / ejabberd

Sure :) But I wanted something that would be easy for non technical people to use.

Aka, you don't need an irc client etc.