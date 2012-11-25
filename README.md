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