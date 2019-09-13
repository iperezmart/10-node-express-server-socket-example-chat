const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');               // Servidor adicional para los sockets

const app = express();
const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

/////////////
// Middleware

app.use(express.static(publicPath));

/////////////
// Routing

///////////////
// Server start

let server = http.createServer(app);
module.exports.io = socketio(server);

require('./sockets/socket');

server.listen(port, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(`Listen on port ${port}`);
});
