'use strict';

// Imports dependancies
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);

// Configures port number
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));

// Configures '/' endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

/**************************
 * Socket.IO Configuration *
 **************************/

let db = [];

// Handles connections to default namespace: '/'
io.on('connection', (socket) => {
    console.log(db);
    // Handles setUsername event
    socket.on('setUsername', (data) => {
        let user = data;
        // Checks if user is in 'db' list
        if (db.indexOf(user) === -1) {
            // Adds user to list
            db.push(user);
            console.log(`${user} has joined`);
            socket.emit('userSet', {
                username: user
            });
        }
        // Emits userExists event which is used for error message
        else {
            socket.emit('userExists', `The username ${user} is taken. Try a different username.`);
        }
    });
    
    // Handles message event
    socket.on('message', (data)=>  {
        io.sockets.emit('new message', data);
    });
    
    // Handles disconnections
    socket.on('disconnect', (socket) => {
        console.log('A user has disconnected');
    });
});

// Starts server
server.listen(port, () => {
    console.log(`Listening on *:${port}`);
});