const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.logIP = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Only authenticated users can log IP addresses.');
    }

    const ip = data.ip;
    const timestamp = Date.now();
    const uid = context.auth.uid;

    return admin.database().ref(`/ip_logs/${uid}`).push({ ip, timestamp })
        .then(() => {
            return { message: `IP ${ip} logged successfully for user ${uid}` };
        })
        .catch(error => {
            throw new functions.https.HttpsError('internal', 'Error logging IP', error);
        });
});
