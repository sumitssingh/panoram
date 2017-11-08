
'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

var usernames = {};
var rooms = [];
var sockets = {};


io.on('connection', (socket) => {
  console.log('Client connected');

 socket.on('adduser', function (name) {
        console.log(name + " join the conversasion");
        sockets[name] = socket;
    });

  socket.on('disconnect', () => console.log('Client disconnected'));
    socket.on('add-message', (msg, to, from) => {
    var message = {
        'text': msg,
        'to': to,
        'from': from,
    }
        // io.emit('message', {type:'new-message', text: message});    
    sockets[to].emit('message',message);
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

