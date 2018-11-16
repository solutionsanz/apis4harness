var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
var httpSignature = require('http-signature');

var ociConfig = require("../../config");
var ociUtils = require('./ociUtils');

//CRI change:
var bodyParser = require('body-parser');

// Configure application routes
module.exports = function (app) {

    // CRI change to allow JSON parsing from requests:    
    app.use(bodyParser.json()); // Support for json encoded bodies 
    app.use(bodyParser.urlencoded({
        extended: true
    })); // Support for encoded bodies

    function log(apiMethod, apiUri, msg) {
        console.log("[" + apiMethod + "], [" + apiUri + "], [" + msg + "], [UTC:" +
            new Date().toISOString().replace(/\..+/, '') + "]");
    }

    /**
     * Adding APIs:
     * 
     */

    /* GET /services/{service} - Get all provisioned instances... e.g. adw instances. */
    app.get('/services/:service', function (req, res) {

        var service = req.params.service;

        if (service == null || service == undefined) {
            log("GET", "/services/{service}", "service template empty or invalid. Nothing to do.");
            res.status(400).end(); //Bad request...
            return;
        }

        log("GET", "/services/{service}", "service type received [" + service + "]");


        switch (service.toUpperCase()) {

            case "ADW":

                var LIST_ADW_PATH = '/20160918/autonomousDataWarehouses?compartmentId=' + ociConfig.compartmentId + '&limit=20'; // Limiting by 20. Remove/Update if necessary.

                ociUtils.getAPI(LIST_ADW_PATH, function (data) {

                    log("GET", "/services/{service}", "Listing ADW Instances:");

                    console.log(data);

                    var arrADWInstances = [];
                    var ADWInstance = {};

                    // Building Response:
                    if (Array.isArray(data)) {

                        var ocid = "";
                        var name = "";
                        var type = "";
                        var type = "";
                        var cpus = "";
                        var storageTB = "";
                        var details = "";
                        var version = "";

                        for (var i = 0; i < data.length; ++i) {

                            ADWInstance = {
                                ocid: data[i].id,
                                name: data[i].dbName,
                                type: "adw",
                                status: data[i].lifecycleState,
                                cpus: data[i].cpuCoreCount,
                                storageTB: data[i].dataStorageSizeInTBs,
                                details: "timeCreated:" + data[i].timeCreated,
                                version: data[i].dbVersion
                            };

                            arrADWInstances.push(ADWInstance);
                        }

                    }

                    // Returning result
                    res.send({
                        "Services": arrADWInstances
                    });
                });

                break;

            default:

                log("Work in Progress: Only type 'adw' is implemented for now... Please stay tuned for other amazing capabilities coming soon! ");
                res.send({
                    "id": "400",
                    "status": "rejected",
                    "message": "Only type 'adw' is implemented for now... Please stay tuned for other amazing capabilities coming soon! "
                });

        }
    });


    /* POST /services/{service}/{ocid} - To start / stop services... e.g. adw, atp... */
    app.post('/services/:service/:ocid', function (req, res) {


        // Retrieving parameters:
        var service = req.params.service;
        var ocid = req.params.ocid;
        var action = req.query.action;

        if (service == null || service == undefined || ocid == null || ocid == undefined || action == null || action == undefined) {
            log("GET", "/services/{service}/{ocid}", "service/ocid templates or action parameter empty or invalid. Verify parameters and try again.");
            res.status(400).end("service/ocid templates or action parameter empty or invalid. Verify parameters and try again."); //Bad request...
            return;
        }

        if (action.toUpperCase() != "START" && action.toUpperCase() != "STOP") {
            log("GET", "/services/{service}/{ocid}", "Invalid action. Only 'start' or 'stop' are allowed. Verify parameters and try again.");
            res.status(400).end("Invalid action. Only 'start' or 'stop' are allowed. Verify parameters and try again."); //Bad request...
            return;
        }

        log("GET", "/services/{service}/{ocid}", "service type received [" + service + "], " + "ocid received [" + ocid + "]");


        // No body is required to start/stop ADW/ATP instances...        

        switch (service.toUpperCase()) {

            case "ADW":

                var ADW_COMMAND_PATH = '/20160918/autonomousDataWarehouses/' + ocid + '/actions/' + action
                var body = JSON.stringify({});

                ociUtils.postAPI(ADW_COMMAND_PATH, body, function (data) {

                    log("GET", "/services/{service}", action.toUpperCase + " ADW Instance:");

                    console.log(data);

                    // Returning result
                    res.send({
                        "id": "202",
                        "status": "accepted",
                        "message": "Request accepted... Work in progress."
                    });
                });

                break;

            default:

                log("Only type 'adw' is implemented for now... Please stay tuned for other amazing capabilities coming soon! ");
                res.send({
                    "id": "400",
                    "status": "rejected",
                    "message": "Only type 'adw' is implemented for now... Please stay tuned for other amazing capabilities coming soon! "
                });
        }

    });

    /* GET /services/{service}/{ocid} - Get a provisioned instance by OCID... e.g. an adw instance by OCID. */
    app.get('/services/:service/:ocid', function (req, res) {

        var service = req.params.service;
        var ocid = req.params.ocid;

        if (service == null || service == undefined) {
            log("GET", "/services/{service}/{ocid}", "service template empty or invalid. Nothing to do.");
            res.status(400).end(); //Bad request...
            return;
        }
        if (ocid == null || ocid == undefined) {
            log("GET", "/services/{service}/{ocid}", "service ocid template empty or invalid. Nothing to do.");
            res.status(400).end(); //Bad request...
            return;
        }

        log("GET", "/services/{service}/{ocid}", "service type received [" + service + "]");


        switch (service.toUpperCase()) {

            case "ADW":

                var ADW_PATH = '/20160918/autonomousDataWarehouses/' + ocid;

                ociUtils.getAPI(ADW_PATH, function (data) {

                    log("GET", "/services/{service}/{ocid}", "Listing ADW Instance:");

                    console.log(data);

                    var ADWInstance = {};

                    // Building Response:


                    var ocid = "";
                    var name = "";
                    var type = "";
                    var type = "";
                    var cpus = "";
                    var storageTB = "";
                    var details = "";
                    var version = "";

                    if (data.id != null && data.id != undefined) {

                        ADWInstance = {
                            ocid: data.id,
                            name: data.dbName,
                            type: "adw",
                            status: data.lifecycleState,
                            cpus: data.cpuCoreCount,
                            storageTB: data.dataStorageSizeInTBs,
                            details: "timeCreated:" + data.timeCreated,
                            version: data.dbVersion
                        };

                    }

                    // Returning result
                    res.send({
                        "Service": ADWInstance
                    });
                });

                break;

            default:

                log("Work in Progress: Only type 'adw' is implemented for now... Please stay tuned for other amazing capabilities coming soon! ");
                res.send({
                    "id": "400",
                    "status": "rejected",
                    "message": "Only type 'adw' is implemented for now... Please stay tuned for other amazing capabilities coming soon! "
                });

        }
    });


};