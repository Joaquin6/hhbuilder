var path = require('path'),
	http = require('http'),

	express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),

	routes = require('./routes'),
	app = express(),
	config = {
		environment: "development",
		port: 8080
	};

readEnvironment();
setupEnvironment();
listen();

function readEnvironment() {
	var myArgs = process.argv.slice(2);
	for (var i = 0; i < myArgs.length; i++) {
		if (myArgs[i].indexOf('e') > 0) {
			config.environment = myArgs[++i];
		}
	}
	console.info("Environment: " + config.environment);
	global.config = config;
}

function setupEnvironment() {
	app.set('port', process.env.PORT || config.port);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: false
	}));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, '..', 'client')));

	app.use(routes);

	app.use(function(req, res) {
		var newUrl = 'http://' + req.get('Host') + '/#' + req.url;
		return res.redirect(newUrl);
	});

	process.on('uncaughtException', function(err) {
		console.error('Caught exception: ' + err);
	});
}

function listen() {
	var server = http.createServer(app);
	server.listen(app.get('port'), function() {
		console.log('node started on port: ' + app.get('port'));
	});
}