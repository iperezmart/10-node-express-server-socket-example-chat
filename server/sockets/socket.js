
const io = require('../server').io;
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utils');

const users = new Users();

// Detect client connection
io.on('connection', (client) => {

    client.on('enterTheChat', (user, callback) => {
        if (!user.name || !user.room) {
            return callback({
                error: true,
                message: 'Name/Room required'
            });
        }

        // Allows a client to join to a specific room
        client.join(user.room);

        users.addUser(client.id, user.name, user.room);

        client.broadcast.to(user.room).emit('listUsers', users.getUsersByRoom(user.room) );
        client.broadcast.to(user.room).emit('createMessage', createMessage('ADMIN', 
            `${user.name} joined the chat`));

        callback(users.getUsersByRoom(user.room));
    });

    client.on('createMessage', (data, callback) => {
        let user = users.getUser(client.id);
        try {
            let message = createMessage(user.name, data.message);
            client.broadcast.to(data.room).emit('createMessage', message); 
            callback(message);   
        }
        catch(e) {
            console.log(e.message);
        }
    });

    client.on('disconnect', () => {
        let deletedUser = users.deleteUser(client.id);

        try {
            let msg = `User '${deletedUser.name}' left the chat`;
            client.broadcast.to(deletedUser.room).emit('createMessage', createMessage('ADMIN', msg));
            client.broadcast.to(deletedUser.room).emit('listUsers', users.getUsersByRoom(deletedUser.room));
        }
        catch(e) {
            console.log(e.message);
        }
    });

    // Listener: Private messages 
    client.on('privateMessage', (data) => {
        let user = users.getUser(client.id);
        // .to => It indicates which client the message is send to
        client.broadcast.to(data.to).emit('privateMessage',
            createMessage(user.name, data.message));
    });
});