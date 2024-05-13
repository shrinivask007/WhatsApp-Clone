// Importing required modules
const { name } = require('ejs');
const express = require('express');
const http = require('http');

// Initializing Express app
const app = express();

// Creating an HTTP server using Express app
const server = http.createServer(app);

// Importing socket.io and initializing it with the created server
const { Server } = require('socket.io');
const io = new Server(server);

// Setting up static file serving and view engine
app.use(express.static('./public'));
app.set('view engine', 'ejs');

// Rendering index page
app.get('/', (req, res) => {
    res.render('index');
});

// Object to store users connected to the chat
const users = {};

// Socket.io connection handling
io.on('connection', (socket) => {
    // Event listener for new user joining
    socket.on('new-user-joined', names=> {
        console.log('New user', names);
        users[socket.id] = names; // Storing user's name with their socket ID
        socket.broadcast.emit('user-joined',names); // Broadcasting to all other users about the new user
    });

    // Event listener for sending messages
    socket.on('send', message => {
        // Broadcasting received message to all other users
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // Event listener for user disconnecting
    socket.on('disconnect', message => {
        // Broadcasting to all other users about the user who left
        socket.broadcast.emit('left', users[socket.id] );
        //delete users[socket.id]; // Removing the user from the users object upon disconnection
    });
});

// Starting the server
server.listen(5000, () => {
    console.log("Server Started At Port:5000");
});
