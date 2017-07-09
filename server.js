const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '/app/public/index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

var bodyParser = require("body-parser");
var app = express();

app.use(express.static('app/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());

// require("./app/routing/apiRoutes")(app);
// require("./app/routing/htmlRoutes")(app);



var users = [];
var connections = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/public/index.html');
});

io.sockets.on('connection', function(socket) {

  connections.push(socket);

  console.log('Connected: %s sockets connected', connections.length);

  socket.on('disconnect', function(data) {

    users.splice(users.indexOf(socket.username), 1);

    updateUsernames();

    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets conected', connections.length);
  });

  //send message
  socket.on('send message', function(data){
    console.log(data);
    io.sockets.emit('new message',{
      msg: data,
      user: socket.username});
  });
  //new User
  socket.on('new user', function(data,callback){
    callback(true); socket.username = data;
    users.push(socket.username); updateUsernames();
  });

  function updateUsernames(){
    io.sockets.emit('get users', users) }
  });
