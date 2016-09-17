function route(path, method) {
	if (path === '/' && method === 'GET') {
		return 'root';
	}
	else if (method === 'GET') {
		return 'static';
	}
	else {
		return 'notFound';
	}
}

exports.route = route;