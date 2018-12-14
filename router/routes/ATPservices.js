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

    /* GET /services/{service} - Where {services} is of type atp */
    app.get('/services/atp', function (req, res) {





        var LIST_ATP_PATH = '/20160918/autonomousDatabases?compartmentId=' + ociConfig.compartmentId + '&limit=20'; // Limiting by 20. Remove/Update if necessary.

        ociUtils.getAPI(LIST_ATP_PATH, function (data) {

            log("GET", "/services/atp", "Listing ATP Instances:");

            console.log(data);

            var arrATPInstances = [];
            var ATPInstance = {};

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

                    ATPInstance = {
                        ocid: data[i].id,
                        name: data[i].dbName,
                        type: "atp",
                        status: data[i].lifecycleState,
                        cpus: data[i].cpuCoreCount,
                        storageTB: data[i].dataStorageSizeInTBs,
                        details: "timeCreated:" + data[i].timeCreated,
                        version: data[i].dbVersion
                    };

                    arrATPInstances.push(ATPInstance);
                }

            }

            // Returning result
            res.send({
                "Services": arrATPInstances
            });
        });

    });


    /* PUT /services/{service}/{ocid} - To start / stop services... e.g. adw, atp... */
    app.put('/services/atp/:ocid', function (req, res) {


        // Retrieving parameters:
        var ocid = req.params.ocid;
        var action = req.query.action;

        if (ocid == null || ocid == undefined || action == null || action == undefined) {
            log("PUT", "/services/atp/{ocid}", "ocid templates or action parameter empty or invalid. Verify parameters and try again.");
            res.status(400).end("ocid templates or action parameter empty or invalid. Verify parameters and try again."); //Bad request...
            return;
        }

        if (action.toUpperCase() != "START" && action.toUpperCase() != "STOP") {
            log("PUT", "/services/atp/{ocid}", "Invalid action. Only 'start' or 'stop' are allowed. Verify parameters and try again.");
            res.status(400).end("Invalid action. Only 'start' or 'stop' are allowed. Verify parameters and try again."); //Bad request...
            return;
        }

        log("PUT", "/services/atp/{ocid}", "ocid received [" + ocid + "]");


        // No body is required to start/stop ADW/ATP instances...        

        var ATP_COMMAND_PATH = '/20160918/autonomousDatabases/' + ocid + '/actions/' + action
        var body = JSON.stringify({});

        ociUtils.postAPI(ATP_COMMAND_PATH, body, function (data) {

            log("PUT", "/services/atp", action.toUpperCase + " ATP Instance:");

            console.log(data);

            // Returning result
            res.send({
                "id": "202",
                "status": "accepted",
                "message": "Request accepted... Work in progress."
            });
        });

    });


    /* PUT /services/{service}/ - To start / stop ALL services... e.g. adw, atp... */
    app.put('/services/atp', function (req, res) {


        // Retrieving parameters:
        var action = req.query.action;

        if (action == null || action == undefined) {
            log("PUT", "/services/atp", "action parameter empty or invalid. Verify parameters and try again.");
            res.status(400).end("action parameter empty or invalid. Verify parameters and try again."); //Bad request...
            return;
        }

        if (action.toUpperCase() != "START" && action.toUpperCase() != "STOP") {
            log("PUT", "/services/atp", "Invalid action. Only 'start' or 'stop' are allowed. Verify parameters and try again.");
            res.status(400).end("Invalid action. Only 'start' or 'stop' are allowed. Verify parameters and try again."); //Bad request...
            return;
        }

        // No body is required to start/stop ADW/ATP instances...        

        var LIST_ATP_PATH = '/20160918/autonomousDatabases?compartmentId=' + ociConfig.compartmentId + '&limit=20'; // Limiting by 20. Remove/Update if necessary.

        ociUtils.getAPI(LIST_ATP_PATH, function (data) {

            // Building Response:
            if (Array.isArray(data)) {

                for (var i = 0; i < data.length; ++i) {

                    instanceName = data[i].dbName;
                    instanceStatus = data[i].lifecycleState;
                    instanceOCID = data[i].id;

                    // Stopping instance if status is 'available':

                    if ((action.toUpperCase() == "STOP" && instanceStatus.toUpperCase() == "AVAILABLE") ||
                        (action.toUpperCase() == "START" && instanceStatus.toUpperCase() == "STOPPED")) {

                        log("PUT", "/services/atp", "Instance [" + instanceName + "], candidate to [" + action.toUpperCase() + "]");

                        var ATP_COMMAND_PATH = '/20160918/autonomousDatabases/' + instanceOCID + '/actions/' + action
                        var body = JSON.stringify({});

                        ociUtils.postAPI(ATP_COMMAND_PATH, body, function (data) {

                            log("PUT", "/services/atp", action.toUpperCase() + "ING instance...");

                        });

                    } else {

                        log("PUT", "/services/atp", "Skipping instance [" + instanceName + "], current status [" + instanceStatus + "]");
                    }
                }
            }

            // Returning result
            res.send({
                "id": "202",
                "status": "accepted",
                "message": "Request accepted... Work in progress."
            });
        });

    });


    /* GET /services/{service}/{ocid} - Get a provisioned instance by OCID... e.g. an adw instance by OCID. */
    app.get('/services/atp/:ocid', function (req, res) {

        var ocid = req.params.ocid;

        if (ocid == null || ocid == undefined) {
            log("GET", "/services/atp/{ocid}", "service ocid template empty or invalid. Nothing to do.");
            res.status(400).end(); //Bad request...
            return;
        }

        var ATP_PATH = '/20160918/autonomousDatabases/' + ocid;

        ociUtils.getAPI(ATP_PATH, function (data) {

            log("GET", "/services/atp/{ocid}", "Listing ATP Instance:");

            console.log(data);

            var ATPInstance = {};

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

                ATPInstance = {
                    ocid: data.id,
                    name: data.dbName,
                    type: "atp",
                    status: data.lifecycleState,
                    cpus: data.cpuCoreCount,
                    storageTB: data.dataStorageSizeInTBs,
                    details: "timeCreated:" + data.timeCreated,
                    version: data.dbVersion
                };

            }

            // Returning result
            res.send({
                "Service": ATPInstance
            });
        });

    });


};