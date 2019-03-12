var config = require("../../config");
var http = require('http');
var https = require('https');


exports.sendNotification = function (fullText, name, mobile, method, callback) {

	try {
		console.log("Sending notification [" + fullText + "] to [" + mobile + "] by [" + method + "]");

		var host = config.SMS_SERVER;
		var port = config.SMS_PORT;

		switch (method.toUpperCase()) {
			case "SMS":				
				path = config.SMS_PATH;
				break;
			case "VOICE":
				path = config.VOICE_PATH;
				break;
		}

		var method = "POST";
		var body = {
			'to': mobile,
			'msg': fullText
		};

		body = JSON.stringify(body);

		var secured = true; // Default to secured HTTPS endpoint.

		console.log("Calling (host, port, path, method, body) [" +
			host + ", " + port + ", " + path + ", " + method +
			", " + body + "]");

		// Invoke API and execute callback:
		sendRequest(host, port, path, method, body, secured, callback);
	} catch (error) {

		console.log("An unexpected error just occured [" + error + "] - Please verify input and try again");
	}
};


function sendRequest(host, port, path, method, body, secured, callback) {

	try {

		var post_req = null;

		var options = {
			host: host,
			port: port,
			path: path,
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			}
		};

		var transport = secured ? https : http;

		post_req = transport.request(options, function (res) {

			console.log("Sending [" + host + ":" + port + path + "] under method [" + method + "]");
			console.log('STATUS: ' + res.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			var fullResponse = "";

			res.on('data', function (chunk) {
				fullResponse += chunk;
			});

			res.on('end', function () {

				console.log('Response: ', fullResponse);

				try {
					var result = JSON.parse(fullResponse);
				} catch (error) {

					console.log("An unexpected error just occured [" + error + "] - Please verify input and try again");
				}
				// Executing callback function:
				callback(result);
			});
		});

		post_req.on('error', function (e) {
			console.log('There was a problem with request: ' + e.message);
			return undefined;
		});

		post_req.write(body);
		post_req.end();

	} catch (error) {

		console.log("An unexpected error just occured [" + error + "] - Please verify input and try again");
	}

}