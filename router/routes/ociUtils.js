/*
    Version 1.0.1
    Before running this example, install necessary dependencies by running:
    npm install http-signature jssha
*/

var fs = require('fs');
var https = require('https');
var os = require('os');
var httpSignature = require('http-signature');
var jsSHA = require("jssha");

var ociConfig = require("../../config");


// if (privateKeyPath.indexOf("~/") === 0) {
//     privateKeyPath = privateKeyPath.replace("~", os.homedir())
// }
var privateKey = fs.readFileSync(ociConfig.pathToKey, 'ascii');


// signing function as described at https://docs.cloud.oracle.com/Content/API/Concepts/signingrequests.htm
function sign(request, options) {

    var apiKeyId = options.tenancyId + "/" + options.userId + "/" + options.keyFingerprint;

    var headersToSign = [
        "host",
        "date",
        "(request-target)"
    ];

    var methodsThatRequireExtraHeaders = ["POST", "PUT"];

    if (methodsThatRequireExtraHeaders.indexOf(request.method.toUpperCase()) !== -1) {
        options.body = options.body || "";

        var shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.update(options.body);

        request.setHeader("Content-Length", options.body.length);
        request.setHeader("x-content-sha256", shaObj.getHash('B64'));

        headersToSign = headersToSign.concat([
            "content-type",
            "content-length",
            "x-content-sha256"
        ]);
    }

    httpSignature.sign(request, {
        key: options.privateKey,
        keyId: apiKeyId,
        headers: headersToSign
    });

    var newAuthHeaderValue = request.getHeader("Authorization").replace("Signature ", "Signature version=\"1\",");
    request.setHeader("Authorization", newAuthHeaderValue);
}

// generates a function to handle the https.request response object
function handleRequest(callback) {

    return function (response) {
        var responseBody = "";

        response.on('data', function (chunk) {
            responseBody += chunk;
        });

        response.on('end', function () {
            callback(JSON.parse(responseBody));
        });
    }
}
// generates a function to handle empty responses e.g. delete 
function handleRequestNoResponse(callback) {

    return function (response) {
        var responseBody = "";

        response.on('data', function (chunk) {
            responseBody += chunk;
        });

        response.on('end', function () {
            callback("Request to delete instance sent...");
        });
    }
}

// gets the user with the specified id
function getUser(userId, callback) {

    var options = {
        host: ociConfig.identityDomain,
        path: "/20160918/users/" + encodeURIComponent(userId),
    };

    var request = https.request(options, handleRequest(callback));

    sign(request, {
        privateKey: privateKey,
        keyFingerprint: ociConfig.publicKeyFingerprint,
        tenancyId: ociConfig.tenancyId,
        userId: ociConfig.apiUserId
    });

    request.end();
};


// Let's list all ADS instances
exports.getAPI = function (path, callback) {

    var body = JSON.stringify({});

    var options = {
        host: ociConfig.databaseServicesDomain,
        path: path,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };

    var request = https.request(options, handleRequest(callback));

    sign(request, {
        body: "",
        privateKey: privateKey,
        keyFingerprint: ociConfig.publicKeyFingerprint,
        tenancyId: ociConfig.tenancyId,
        userId: ociConfig.apiUserId
    });

    request.end();
};

// Let's POST APIs to OCI:
exports.postAPI = function (path, body, callback) {

    var options = {
        host: ociConfig.databaseServicesDomain,
        path: path,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };

    var request = https.request(options, handleRequest(callback));

    sign(request, {
        body: body,
        privateKey: privateKey,
        keyFingerprint: ociConfig.publicKeyFingerprint,
        tenancyId: ociConfig.tenancyId,
        userId: ociConfig.apiUserId
    });

    request.end(body);
};

// Let's DELETE APIs to OCI:
exports.deleteAPI = function (path, body, callback) {

    var options = {
        host: ociConfig.databaseServicesDomain,
        path: path,
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };

    var request = https.request(options, handleRequestNoResponse(callback));

    sign(request, {
        body: body,
        privateKey: privateKey,
        keyFingerprint: ociConfig.publicKeyFingerprint,
        tenancyId: ociConfig.tenancyId,
        userId: ociConfig.apiUserId
    });

    request.end(body);
};

// test the above functions
// console.log("GET USER:");

// getUser(ociConfig.apiUserId, function (data) {
//     console.log(data);      
// });

/*******************************
 * 
 * List ADW Instances:
 * 
 ***********/

// console.log("\nLISTING ADW INSTANCES:");

// var LIST_ADW_PATH = '/20160918/autonomousDataWarehouses?compartmentId=' + ociConfig.compartmentId + '&limit=10';

// getAPI(LIST_ADW_PATH, function (data) {
//     console.log(data);
// });

/*******************************
 * 
 * Stop ADW Instance:
 * 
 ***********/

// console.log("\STOP ADW INSTANCE:");

// var STOP_ADW_PATH = '/20160918/autonomousDataWarehouses/' + ociConfig.adwInstanceId + '/actions/stop';
// var body = JSON.stringify({});

// postAPI(STOP_ADW_PATH, body, function (data) {
//     console.log(data);
// });

/*******************************
 * 
 * Start ADW Instance:
 * 
 ***********/

// console.log("\START ADW INSTANCE:");

// var START_ADW_PATH = '/20160918/autonomousDataWarehouses/' + ociConfig.adwInstanceId + '/actions/start';
// var body = JSON.stringify({});

// postAPI(START_ADW_PATH, body, function (data) {
//     console.log(data);
// });