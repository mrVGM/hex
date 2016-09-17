function start(router, controllers) {
	
	var http = require('http');
	
	var server = http.createServer(function(request, response) {
		console.log(request.method + " " + request.url);
		
		var data = {
				path: request.url, 
				body: ""
		};
		
		var controller = router.route(request.url, request.method);
		
		setTimeout(function() {
			controllers[router.route(request.url, request.method)].handle(response, data);
		}, 0);

	});
	
	server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
		var addr = server.address();
		console.log("httpServer listening at", addr.address + ":" + addr.port);
	});
}

exports.start = start;