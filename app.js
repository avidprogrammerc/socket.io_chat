var app = require('express')(); //getting the express object.
var http = require('http').Server(app);  //getting an https erver onject that with express
var io = require('socket.io')(http); // creating a io object. I asked about the http server part. 

app.get('/', function(req, res){ // get request at the root the call back's
  res.sendfile(__dirname + '/index.html');    // response object (res) servers the index.html file
});

app.get('/app.js', function(req, res) {
    res.sendfile('app.js');
});

var users = [];

io.on('connection', function(socket){

    socket.on('join', function(name) {
        socket.nickname = name;
        io.emit('chat message', name + " has joined!");
        console.log('NEW USER: ' + name);
        users.push(name);
        io.emit('chat message', "Number of users online " + users.length);
        io.emit('chat message', "USERS!!!!!123451440 " + users);
    });

    socket.on('chat_message', function(msg) {
        socket.broadcast.emit('chat message', socket.nickname + ": " + msg);
        console.log(socket.nickname + ": " + msg);
    });

    socket.on('disconnect', function () {
        if (socket.nickname != null) {
            socket.broadcast.emit('chat message', socket.nickname + " has left!");
            console.log("DISCONNECTED: " + socket.nickname);
            var index = users.indexOf(socket.nickname);
            if (index > -1) {
                users.splice(index, 1);
            }
            io.emit('chat message', "Number of users online " + users.length);
            io.emit('chat message', "USERS!!!!!123451440 " + users);
        }
    });
});

http.listen(3000, function(){
    console.log('Chat Server: v3.0');
    console.log('Author: Chris Conley');
    console.log('Servlet running on csconley.com:3000\n');
});

