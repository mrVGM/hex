function handle(response) {
	var fs = require('fs');
	
	fs.readFile('./public/index.html', function(err, html) {
		if (err) {
			fs.readFile('./public/notFound.html', function(err, html) {
				if (err) {
					response.write("Server Error!");
				}
				else {
					response.write(html);
					response.status(404);
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