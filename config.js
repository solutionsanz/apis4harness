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

    "identityDomain": process.env.identityDomain || "identity.us-ashburn-1.oraclecloud.com",
    "coreServicesDomain": process.env.coreServicesDomain || "iaas.us-ashburn-1.oraclecloud.com",
    "databaseServicesDomain": process.env.databaseServicesDomain || "database.us-ashburn-1.oraclecloud.com",
    
    "tenancyId": process.env.tenancyId || "ocid1.tenancy.oc1..aaaaaaaa7gup442a6kvo27atbfnlnjpws7lf7xsc3ig3wu7wc7zdig4wclra",
    "compartmentId": process.env.compartmentId || "ocid1.compartment.oc1..aaaaaaaa4ddg3x2eqqi2jifg7wkpyc6eckg3ddgmipyilk7tynszqgq3a6aq",
    "apiUserId": process.env.apiUserId || "ocid1.user.oc1..aaaaaaaapgr7xhmjhyb7k7zqpvmbn6pseoaw3o77pucuyef6jbrtw7aswgqa",
    "publicKeyFingerprint": process.env.publicKeyFingerprint || "9e:29:39:59:2b:b1:c9:4f:b5:b5:fa:05:5d:81:ae:1c",
    "pathToKey": process.env.pathToKey || "./ssh/id_rsa_pri.pem",

    "adwInstanceId": process.env.adwInstanceId || "ocid1.autonomousdwdatabase.oc1.iad.abuwcljrfhsosqc6ys7h7xfrpsnxnrmixprc4vyc6ckbnweegnnupq7msqfq",   

    "PORT": process.env.PORT || "3000"
};