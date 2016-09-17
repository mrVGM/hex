var http = require('http');

var fs = require('fs');

var fst;
var snd;


var httpServer = http.createServer(function (req, res) {
	console.log('./public' + req.url);
	
	fs.readFile('./public' + req.url, function(err, html) {
		if (err) {
			res.write("NOT FOUND");
		}
		else {
			res.write(html);
		}
		res.end();
	});
});

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: 8081 });

wss.on('connection', function connection(ws) {
	
	console.log('new ws connection');
	
	ws.on('message', function incoming(message) {
		if (!fst) {
			fst = {sdi: JSON.parse(message), ws: ws};
		}
		else {
			fst.ws.send(message);
			ws.close();
			fst.ws.close();
		}
	});
	
	if (fst) {
		ws.send(JSON.stringify(fst.sdi));
	}
	
});


httpServer.listen(8080);