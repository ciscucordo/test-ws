var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

var clients = new Array();

wss.on('connection', function (ws) {

    ws.on('message', function (message) {
        console.log('received: %s', message);
        dispatch(ws, message);
    });

    ws.on('close', function () {
        // chat.removeClient(ws);
        // chat.updateUserListOnClients();
    });
});

function dispatch(ws, message) {
    var type = message.type;
    switch (type) {
        case 'register':
            registerClient(ws, message);
            break;
        case 'chat':
            var roomAndNick = split(":", message.roomAndNick);
            var room = roomAndNick[0];
            var nick = roomAndNick[1];
            var chat_msg = message.chat_msg;
            // response_from = "<span style='color:#999'><h5>" + nick + "</h5><p>" + chat_msg + "</p><span>data i dia</span></span>";
            var response_to = "<span><h5>" + nick + "</h5><p>" + chat_msg + "</p><span>data i dia</span></span>";
            // Output
            //from->send(json_encode(array("type" => $type, "roomAndNick" => $data->roomAndNick, "msg" => $response_from)));
            for (var i = 0; i < clients.length; i++) {
                // if (chat.clients[i].socket === ws) {
                ws.send({
                    'type': type,
                    'roomAndNick': roomAndNick,
                    'msg': response_to
                });
                // }
            }
            break;
    }
}

// temporal!!!
function registerClient(ws, client) {
    var client = {socket: ws, name: client};
    clients.push(client);
}

/*
 var chat = {
 clients: new Array(),
 
 run: function () {
 wss.on('connection', function (ws) {
 
 ws.on('message', function (message) {
 console.log('received: %s', message);
 chat.dispatch(ws, message);
 });
 
 ws.on('close', function () {
 chat.removeClient(ws);
 chat.updateUserListOnClients();
 });
 });
 
 },
 
 removeClient: function (ws) {
 for (i = 0; i < chat.clients.length; i++) {
 if (chat.clients[i].socket === ws) {
 chat.clients.splice(i, 1);
 console.log('remove client');
 }
 }
 },
 
 registerClient: function (ws, client) {
 var client = {socket: ws, name: client};
 chat.clients.push(client);
 chat.updateUserListOnClients();
 },
 
 broadcast: function (message, fromSocket) {
 var user = chat.getClientName(fromSocket);
 chat.broadcastCommand(user + ': ' + message);
 },
 
 updateUserListOnClients: function () {
 var userList = new Array();
 for (i = 0; i < chat.clients.length; i++) {
 userList.push(chat.clients[i].name);
 }
 console.log(userList.concat());
 chat.broadcastCommand('/updateUserList ' + userList.concat());
 },
 
 broadcastCommand: function (cmd) {
 for (i = 0; i < chat.clients.length; i++) {
 try {
 chat.clients[i].socket.send(cmd);
 } catch (error) {
 chat.clients.splice(i, 1);
 console.log(error);
 }
 
 }
 },
 
 getClientName: function (ws) {
 for (i = 0; i < chat.clients.length; i++) {
 if (chat.clients[i].socket === ws) {
 return chat.clients[i].name;
 }
 }
 },
 
 dispatch: function (ws, message) {
 var cmd = '';
 var param = '';
 
 if (message.indexOf('/') === 0) {
 cmd = message.split(' ')[0];
 param = message.replace(cmd, '');
 
 }
 
 switch (cmd) {
 case '/broadcast':
 chat.broadcast(param, ws);
 break;
 case '/connect':
 var msg = param.replace(' ', '').replace(/(<([^>]+)>)/ig, "");
 if (msg != '') {
 chat.registerClient(ws, msg);
 }
 break;
 }
 
 }
 
 };
 
 chat.run();
 */