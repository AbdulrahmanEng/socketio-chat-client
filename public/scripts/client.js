'use strict';

const socket = io();

function setUsername() {
    let nameInput = document.getElementById('name').value;
    socket.emit('setUsername', nameInput);
}

// Get's message and emits it to the server in the form of an object literal with the username
function sendMessage() {
    let msg = document.getElementById('message').value;
    if (msg) {
        socket.emit('message', {
            message: msg,
            user: user
        });
    }
}

let user = null;

socket.on('userExists', (data) => {
    document.getElementById('error-container').innerHTML = data;
});

socket.on('userSet', (data) => {
    user = data.username;
    document.body.innerHTML = `
    <h1>Socket.IO Chat App Test</h1>
    <input type="text" id ="message">
    <button type="button" name="button" onclick="sendMessage()">Send</button>
    <div id="message-feed"></div>
    `;
    
    sendMessage();

    // Handles 'new message' event
    socket.on('new message', (data) => {
        // Verifies user's existence
        if (user) {
            // Adds user's message to feed
            document.getElementById('message-feed').innerHTML += `<div><b>${data.user}</b>: ${data.message}</div>`;
        }
    });
});