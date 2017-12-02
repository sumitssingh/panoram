
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
  console.log(sockets);
  if (sockets.indexOf(name)<0) {
        console.log(name + " join the conversasion...");
        sockets[name] = socket;
  }
    });
socket.on('disconnect', function() {
      console.log('Got disconnect!');

      var i = sockets[name].indexOf(socket);
      console.log(i);
      sockets.splice(i, 1);
   });
  // socket.on('disconnect', () => console.log('Client disconnected'));
    socket.on('add-message', (msg, to, from) => {
      console.log(to);
    var message = {
        'text': msg,
        'to': to,
        'from': from,
    }
        // io.emit('message', {type:'new-message', text: message});    
    sockets[to].emit('message',message);
  });
        socket.on('sendEvents', (to) => {
      for (var i = to.length - 1; i >= 0; i--) {
      console.log(to[i]);

            var message = {
                'text': "New OnCall events",
                'to': to[i],
                'from': "303172098",
            }
            var docId = to[i];
            // console.log(sockets);
            console.log("message " + message);
        // io.emit('message', {type:'new-message', text: message});    
      sockets[docId].emit('message',message);
      }

  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

