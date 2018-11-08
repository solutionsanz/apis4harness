var path = require('path');
var http = require('http');
var express = require('express');
var yaml = require('js-yaml');
var fs = require('fs');
var config = require('./config');

// Create an Express web app
var app = express();


// Converting YAML into JSON for Swagger UI loading purposes:
var inputfile = 'apis4cloudplatformharness_swaggerdef.yml',
    outputfile = 'apis4cloudplatformharness_swaggerdef.json';

swaggerFileDef = yaml.load(fs.readFileSync(inputfile, {
    encoding: 'utf-8'
}));

// Storing YAML -> JSON Format for visibility purposes:
//fs.writeFileSync(outputfile, JSON.stringify(swaggerFileDef, null, 2));


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-App-Key, regodate, id');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Include the html assets
app.get('/anki-saasdemo-ext-apis/v1', function (req, res) {

    // Issuing dynamic updates:
    var isAPIGWSecured = false;

    /**
     * 1. Updating the Host location
     */
    if (config.API_GW_ENABLED != null &&
        config.API_GW_ENABLED != undefined &&
        config.API_GW_ENABLED == "true") {

        console.log("API_GW_ENABLED");

        swaggerFileDef.host = config.API_GW_SERVER;
        swaggerFileDef.host += config.API_GW_BASEURL == "NA" ? "" : config.API_GW_BASEURL;

        // API GAteway is enabled, thus we default to HTTPS as first option:
        isAPIGWSecured = true;

    } else {

        // Updating the Host file dynamically
        swaggerFileDef.host = "" + req.headers.host;
    }

    /**
     * 2. Updating the default Scheme to use (i.e. HTTP or HTTPS)
     */
    if (isAPIGWSecured) {

        console.log("Default HTTPS over HTTP");

        // Swap and default HTTPS as first option:
        swaggerFileDef.schemes = ['HTTPS', 'HTTP'];
    }

    // Returning swagger definition:
    res.send(swaggerFileDef);
});

app.use('/', express.static(path.join(__dirname, 'swagger-dist')));
app.use('/ws', express.static(path.join(__dirname, 'public')));


// Configure routes and middleware for the application
require('./router')(app);

// Create an HTTP server to run our application
var server = http.createServer(app);

// export the HTTP server as the public module interface
module.exports = server;