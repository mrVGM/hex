var waitingPlayer;

function start() {
	var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: 8081 });
	
	console.log('webSocketServer listening on port 8081');
	
	
	wss.on('connection', function (ws) {
		console.log('new ws connection');
		
		ws.on('message', function (message) {
			
			//console.log(message);
			
			/*if (!ws.initiator_data) {
				waitingPlayer = {sdi: message, ws: ws};
			}
			else {
				ws.initiator_data.ws.send(message);
				ws.close();
				ws.initiator_data.ws.close();
			}*/
			
			if (ws.otherWS) {
				ws.otherWS.send(message);
			}
			else {
				ws.initiatorWS.send(message);
				ws.initiatorWS.close();
				ws.close();
			}
			
		});
		
		ws.onclose = function() {
			if (this === waitingPlayer) {
				waitingPlayer = undefined;
			}
			if (this.otherWS) {
				this.otherWS.close();
			}
		};
		
		if (!waitingPlayer) {
			waitingPlayer = ws;
			//ws.send('offer');
		}
		else {
			waitingPlayer.otherWS = ws;
			ws.initiatorWS = waitingPlayer;

			waitingPlayer = undefined;
			ws.initiatorWS.send('offer');
			
			//ws.initiator_data = waitingPlayer;
			//waitingPlayer = undefined;
			
			//ws.send(ws.initiator_data.sdi);
		}
	});
}

exports.start = start;