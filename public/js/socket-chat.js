let socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('Name and room required');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

// Detect server connection
socket.on('connect', function () {
    console.log('Connected to server!');

    socket.emit('enterTheChat', user, function(resp) {
        // if (!user.name)
        // console.log('Connected users', resp);
        renderUsers(resp);
    });
});

// Detect server disconnection
socket.on('disconnect', function () {
    console.log('Server connection lost!');
});

// Receive Message
socket.on('createMessage', function (message) {
    renderMessages(message, false);
    scrollBottom();
});

// Receive Message when users enter or left the chat
socket.on('listUsers', function (users) {
    //console.log(users);
    renderUsers(users);
});

// Receive a private message
socket.on('privateMessage', function(message) {
    console.log('Private message:', message);
});
