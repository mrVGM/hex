var httpServer = require('./httpServer');
var router = require('./router');
var webSocketServer = require('./webSocketServer.js');

var controllers = {
	root: require('./controllers/root.js'),
	'static': require('./controllers/static.js')
};


httpServer.start(router, controllers);
webSocketServer.start();