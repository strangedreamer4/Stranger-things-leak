const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.logIP = functions.https.onRequest((request, response) => {
    const ip = request.headers['fastly-client-ip'] || 
               request.headers['x-forwarded-for'] || 
               request.connection.remoteAddress;
    const timestamp = Date.now();

    return admin.database().ref('/ip_logs').push({ ip, timestamp })
        .then(() => {
            response.send("IP logged successfully");
        })
        .catch((error) => {
            console.error("Error logging IP: ", error);
            response.status(500).send("Error logging IP");
        });
});
