var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
var httpSignature = require('http-signature');

var ociConfig = require("../../config");
var ociUtils = require('./ociUtils');
var funct = require('./functions');

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

    /* POST /services/{service}/nitifications - Where {services} is of type adw */
    app.post('/services/:service/notification', function (req, res) {

        // Retrieving parameters:
        var service = req.params.service;
        var recipientName = req.query.name;
        var recipientMobile = req.query.mobile;
        var tenancy = req.query.tenancy;
        var message = req.query.message;

        if (service == null || service == undefined) {
            log("POST", "/services/:service/notification", "service invoked is empty or invalid.");
            res.status(400).end(); //Bad request...
            return;
        }

        if (recipientName == null || recipientName == undefined) {
            log("POST", "/services/:service/notification", "recipientName is empty or invalid.");
            res.status(400).end(); //Bad request...
            return;
        }
        if (recipientMobile == null || recipientMobile == undefined) {
            log("POST", "/services/:service/notification", "recipientMobile is empty or invalid.");
            res.status(400).end(); //Bad request...
            return;
        }
        if (tenancy == null || tenancy == undefined) {
            log("POST", "/services/:service/notification", "tenancy is empty or invalid.");
            res.status(400).end(); //Bad request...
            return;
        }
        if (message == null || message == undefined) {
            log("POST", "/services/:service/notification", "message is empty or invalid.");
            res.status(400).end(); //Bad request...
            return;
        }

        var serviceFull = "";

        switch (service.toLowerCase()) {

            case "adw":

                serviceFull = "autonomousDataWarehouses";
                break;

            case "atp":

                serviceFull = "autonomousDatabases";
                break;

            default:

                log("POST", "/services/:service/notification", "service invoked is invalid.");
                res.status(400).end(); //Bad request...
                return;
        }


        log("POST", "/services/:service/notifications", "Service to notify [" + service + "]");

        var LIST_ADW_PATH = '/20160918/' + serviceFull + '?compartmentId=' + ociConfig.compartmentId + '&limit=20'; // Limiting by 20. Remove/Update if necessary.

        ociUtils.getAPI(LIST_ADW_PATH, function (data) {

            log("POST", "/services/:service/notifications", "Listing ADW Instances:");

            console.log(data);

            var arrADWInstances = [];
            var ADWInstance = {};

            var lstInstancesState = "";

            // Building Response:
            if (Array.isArray(data)) {

                var name = "";
                var status = "";

                for (var i = 0; i < data.length; ++i) {

                    lstInstancesState += "\n" + data[i].dbName + "-" + data[i].lifecycleState;
                }

            }


                fullMessage = "Hi, " + recipientName + ". \n";
                fullMessage += message + "\n";
                fullMessage += lstInstancesState;

                //send SMS message for current recipient:
                funct.sendNotification(fullMessage, null, recipientMobile, "sms", function (msg) {

                    log("POST", "/services/:service/notifications", "Notification sent successfully!");

                });
        });

        // Returning result
        res.send({
            "id": "202",
            "status": "accepted",
            "message": "Request accepted... Work in progress."
        });

    });

};