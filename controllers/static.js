function handle(response, data) {
	if (data.path == '/favicon.ico') {
		response.end();
		return;
	}
	
	var fs = require('fs');
	
	fs.readFile('./public' + data.path, function(err, html) {
		if (err) {
			fs.readFile('./public/notFound.html', function(err, html) {
				if (err) {
					response.write("Server Error!");
				}
				else {
					response.write(html);
				}
				response.end();
			});
		}
		else {
			response.write(html);
			response.end();
		}
	});
}

exports.handle = handle;