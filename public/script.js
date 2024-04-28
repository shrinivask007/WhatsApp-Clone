// This function initializes the chat functionality once the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {

    // Establishing a socket connection to the server
    const socket = io('http://localhost:5000/');

    // Retrieving input field and message container elements
    const messageInput = document.getElementById('messageInput');
    const messageContainer = document.querySelector('#chat-messages');

    // Creating an audio element for notification sound
    var audio = new Audio('ringtone.mp3');

    // Prompting the user to enter their name and emitting it to the server
    const name = prompt("Enter Your name"); 
    socket.emit('new-user-joined', name); 

    // Function to append messages to the chat container
    const append = (message, position) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = message;
        messageElement.classList.add('message');
        messageElement.classList.add(position);
        messageContainer.append(messageElement);
        audio.play(); // Playing notification sound when a message is appended
    };

    // Handling form submission to send messages
    const form = document.getElementById('messageForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        append(`<strong>You</strong> : ${message}`, 'message-right'); // Appending user's own message to the right side
        socket.emit('send', message); // Emitting the message to the server
        messageInput.value = ''; // Clearing the message input field
    });

    // Handling event when a new user joins the chat
    socket.on('user-joined', name => { 
        append(`<strong>${name}:</strong> Joined the chat`, 'message-right'); // Displaying a notification for the joined user
    });

    // Handling received messages from other users
    socket.on('receive', data => {
        append(`<strong>${data.name}</strong>: ${data.message}`, 'message-left'); // Displaying received message on the left side
    });

    // Handling event when a user leaves the chat
    socket.on('left', name => {
        append(`<strong>${name}:</strong> Left the chat`, 'message-left'); // Displaying a notification for the user who left
    });

    // Logging a message to confirm that the script is working
    console.log('Script is working');
});
