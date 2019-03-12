// By default these properties assume an isolated stand alone deployment.
// Only MONGODB_SERVER, MONGODB_PORT and application PORT are required.
// If this applications requires API GW or remote/secured MongoDB access,
// setup the additional properties as system variables in your OS.
// For security purposes, make sure the system variables are not checked-in
// into version control repository.

module.exports = {
    "API_GW_ENABLED": process.env.API_GW_ENABLED || "false",
    "API_GW_SERVER": process.env.API_GW_SERVER || "NA",
    "API_GW_BASEURL": process.env.API_GW_BASEURL || "NA",
    "API_GW_PORT": process.env.API_GW_PORT || "NA",
    "API_GW_USERNAME": process.env.API_GW_USERNAME || "NA",
    "API_GW_PASSWORD": process.env.API_GW_PASSWORD || "NA",
    
    "SMS_SERVER": process.env.SMS_SERVER || "NA",
    "SMS_PORT": process.env.SMS_PORT || "NA",
    "SMS_PATH": process.env.SMS_PATH || "NA",
    "VOICE_PATH": process.env.VOICE_PATH || "NA",
    

    "K8S_INGRESS_ENABLED": process.env.API_GW_PASSWORD || "NA",
    "K8S_INGRESS_PATH": process.env.API_GW_PASSWORD || "/apis4harness",


    "identityDomain": process.env.identityDomain || "identity.us-ashburn-1.oraclecloud.com",
    "coreServicesDomain": process.env.coreServicesDomain || "iaas.us-ashburn-1.oraclecloud.com",
    "databaseServicesDomain": process.env.databaseServicesDomain || "database.us-ashburn-1.oraclecloud.com",
    
    "tenancyId": process.env.tenancyId || "ocid1.tenancy.oc1..aaaaaaaa7gup442a6kvo27xxxxxxx...",
    "compartmentId": process.env.compartmentId || "ocid1.compartment.oc1..aaaaaaaa4xxxxxxx...",
    "apiUserId": process.env.apiUserId || "ocid1.user.oc1..aaaaaaaapgr7xhmjhyb7k7zqpvmbxxxxxxx...",
    "publicKeyFingerprint": process.env.publicKeyFingerprint || "9e:29:39:59:2b:b1:xxxx...",
    "pathToKey": process.env.pathToKey || "./ssh/id_rsa_pri.pem",

    "adwInstanceId": process.env.adwInstanceId || "ocid1.autonomousdwdatabase.oc1.xxxxxxx...", 
    
    "dbpasswd": process.env.dbpasswd || "welcome1",

    "PORT": process.env.PORT || "3000"
};