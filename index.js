var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  
    ws.on('message', function (data) {
        // Broadcast to everyone else.
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocketServer.OPEN) {
            var roomAndNick = split(':', data.roomAndNick);
            var room = roomAndNick[0];
            var nick = roomAndNick[1];
            var chat_msg = data.chat_msg;
            var response_to = '<span><h5>' + nick + '</h5><p>' + chat_msg + '</p><span>data i dia</span></span>';
            client.send({
                'type': 'chat',
                'roomAndNick': roomAndNick,
                'msg': response_to
            });
            
          }
        });
        
        // ws.send('petehant', function() {  })
    });
    
  
  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
  })
})


function dispatch(ws, message) {
    var type = message.type;
    switch (type) {
        case 'register':
            var client = {socket: ws, name: message.nick};
            // clients.push(client);
            break;
        case 'chat':
            var roomAndNick = split(':', message.roomAndNick);
            var room = roomAndNick[0];
            var nick = roomAndNick[1];
            var chat_msg = message.chat_msg;
            // response_from = "<span style='color:#999'><h5>" + nick + "</h5><p>" + chat_msg + "</p><span>data i dia</span></span>";
            var response_to = '<span><h5>' + nick + '</h5><p>' + chat_msg + '</p><span>data i dia</span></span>';
            // Output
            //from->send(json_encode(array("type" => $type, "roomAndNick" => $data->roomAndNick, "msg" => $response_from)));
            //for (var i = 0; i < clients.length; i++) {
                // if (chat.clients[i].socket === ws) {
                ws.send({
                    'type': type,
                    'roomAndNick': roomAndNick,
                    'msg': response_to
                });
                // }
            //}
            break;
    }
}