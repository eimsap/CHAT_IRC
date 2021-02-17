# CHAT_IRC

Create an IRC server in NodeJS and ExpressJS, and a client in ReactJS.

Features

Connection system
Profile management
The member who created their channel can delete and modify it.
Each action (creation, deletion, or new connection) on the channels and change of nickname send a global message visible on all channels
Members connected to a channel can send a message to all users of that channel
The server updates the list of connected users (sockets) as well as channels (with the list of connected people)
Basic IRC commands

Installation & Launch

Download the file
Start two terminal
In the "customer" folder, run the command:
npm start

In the "server" folder, run the command:
node index.js

Technologies
React.js, Node.js, Socket.io 
