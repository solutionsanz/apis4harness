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

var ociConfig = require('./oci_config.json');


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
function listADWs(compartmentId, callback) {

    var body = JSON.stringify({});

    var options = {
        host: ociConfig.databaseServicesDomain,
        path: '/20160918/autonomousDataWarehouses?compartmentId=' + compartmentId + '&limit=10',
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

// Let's stop ADW instances:
function stopADW(adwInstanceId, callback) {

    var body = JSON.stringify({});

    var options = {
        host: ociConfig.databaseServicesDomain,
        path: '/20160918/autonomousDataWarehouses/' + adwInstanceId + '/actions/stop',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json',
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

// Let's start ADW instances:
function startADW(adwInstanceId, callback) {

    var body = JSON.stringify({});

    var options = {
        host: ociConfig.databaseServicesDomain,
        path: '/20160918/autonomousDataWarehouses/' + adwInstanceId + '/actions/start',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json',
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

// creates a Oracle Cloud Infrastructure VCN in the specified compartment
function createVCN(compartmentId, displayName, cidrBlock, callback) {

    var body = JSON.stringify({
        compartmentId: compartmentId,
        displayName: displayName,
        cidrBlock: cidrBlock
    });

    var options = {
        host: ociConfig.coreServicesDomain,
        path: '/20160918/vcns',
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
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

// test the above functions
console.log("GET USER:");

getUser(ociConfig.apiUserId, function (data) {
    console.log(data);

    // console.log("\nCREATING VCN:");
    // // createVCN(ociConfig.compartmentId, "CRI-Test-VCN-New", "10.0.0.0/16", function (data) {
    //     console.log(data);
    // });

    console.log("\nLISTING ADW INSTANCES:");
    listADWs(ociConfig.compartmentId, function (data) {
        console.log(data);
    });

    // console.log("\STOP ADW INSTANCE:");
    // stopADW(ociConfig.adwInstanceId, function (data) {
    //     console.log(data);
    // });    

    console.log("\START ADW INSTANCE:");
    startADW(ociConfig.adwInstanceId, function (data) {
        console.log(data);
    });        
});