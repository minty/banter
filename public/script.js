function l(m) { console.log(m) }
function log_user() {
    $('#log').prepend( $('<div></div>').text('Your username is ' + localStorage.user) );
}
$(function() {
    var user;
    function set_user() {
        var answer = prompt('What is your name?');
        if (answer) {
            user = answer;
            localStorage.user = answer;
        }
        $('input[name="msg"]').focus();
    }
    if (!localStorage.user) { set_user() }
    else                    { user = localStorage.user }
    if (!user) return;
    log_user();

    var last;
    var seen = {};
    var state = 'Disconnected.  Post a message to connect';
    var timer;
    var focused = true;
    var hr = false;
    show_state();
    poll();
    function poll() {
        if (!last) {
            setTimeout(poll, 1000);
            return;
        }
        var fetch = seen[last] ? last + 1 : last;
        state = 'Connected';
        $.ajax({
            'url': '/poll?since=' + fetch,
            'type': 'GET',
            'success': function(data) {
                show(data);
                poll();
            },
            'error': function() {
                state = 'Disconnected.  Reconnecting...';
                setTimeout(poll, 2000);
            }
        });
    }
    function show(data) {
        if (!focused && !hr) {
            $('#log').prepend('<hr>');
            hr = true;
        }
        $.each(data, function(i, e) {
            if (!last || e.id > last) last = e.id;
            if (seen[ e.id ]) return;
            seen[ e.id ] = 1;
            var dt = new Date(0);
            dt.setUTCSeconds( e.at );
            e.text = e.text.replace('<', '&lt;', "g");
            e.text = e.text.replace('>', '&gt;', "g");
            e.text = e.text.replace(/ (https?[^ ]+)/g, " <a href=\"$1\" target=_blank>$1</a>");
            e.text = e.text.replace(/^(https?[^ ]+)/g, " <a href=\"$1\" target=_blank>$1</a>");

            var msg = $('<div></div>');
            if (e.user != user) msg.addClass('new');
            msg.append(
                $('<div></div>')
                    .append( $('<span class=user></span>').text( e.user ) )
                    .append( $('<span>said</span>') )
                    .append( $('<span class=text></span>').html( e.text ) )
            )
            .append(
                $('<div class=at></div>')
                    .text( dt.toUTCString() )
            )
            $('#log').prepend(msg);
        });
        if (focused) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(clear_new, '5000');
        }
    }
    function clear_new() {
        $('#log .new').removeClass('new');
        $('#log hr').remove();
    }
    function clear_msg() {
        $('input[name="msg"]').val('');
    }
    function show_state() {
        $('#state').text(state);
        setTimeout(show_state, 500);
    }
    $('input[name="msg"]').focus();
    function send_msg(msg) {
        state = 'Sending message';
        $.ajax({
            'url': '/say',
            'type': 'POST',
            'dataType': 'json',
            'data': {
                'user': user,
                'text': msg
            },
            'success': function(data) {
                $('input[name="msg"]').val('');
                if (data.last) last = data.last;
                state = 'Connected';
            },
            'error': function() {
                state = 'Failed to send message.  Try again?';
            }
        });
    }
    $('form').on('submit', function(e) {
        send_msg( $('input[name="msg"]').val() );
        e.preventDefault();
    });
    $('#user').on('click', function() {
        set_user();
        log_user();
    });
    $('body').on('keydown', function(e) {
        if (e.which == 27) {
            $('#log').html('');
            // Firefox will re-enter previously deleted text if you hit esc
            setTimeout(clear_msg, 100);
        }
    });

    send_msg('[connected]');

    window.onbeforeunload = function() {
        return "Sure?  It'll reset your session";
    }
    $(window).on('focus', function() {
        focused = true;
        hr = false;
        if (timer) clearTimeout(timer);
        timer = setTimeout(clear_new, '5000');
    });
    $(window).on('blur', function() { focused = false });
});
