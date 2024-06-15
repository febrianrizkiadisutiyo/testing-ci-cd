const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const secretManagerClient = new SecretManagerServiceClient();
// require('dotenv').config();
// const serviceAccount = process.env.SERVICE_ACCOUNT;
// const serviceAccount = require("../serviceAccountKey.json");
const SERVICE_ACCOUNT_SECRET_NAME = 'projects/996547761326/secrets/service-account-key'
const FIREBASE_CONFIG_SECRET_NAME = 'projects/996547761326/secrets/firebase_config'


/**
 * Access secret version from Secret Manager.
 *
 * @param {string} name The name of the secret.
 * @return {Promise<string>} The secret payload.
 */
async function accessSecretVersion(name) {
  const [version] = await secretManagerClient.accessSecretVersion({
    name: name,
  });
  return version.payload.data.toString('utf8');
}

(async ()=> {
  
const serviceAccountKeyContent = await accessSecretVersion(SERVICE_ACCOUNT_SECRET_NAME);
const serviceAccount = JSON.parse(serviceAccountKeyContent);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hay-hair-beauty.firebaseio.com",
});

const db = admin.firestore();

// const firebaseConfig = {
//   apiKey: "AIzaSyCXr2cwdIn-l2AKnVcz5eAGGhxQc3OGpeM",
//   authDomain: "hay-hair-beauty.firebaseapp.com",
//   projectId: "hay-hair-beauty",
//   storageBucket: "hay-hair-beauty.appspot.com",
//   messagingSenderId: "126780028253",
//   appId: "1:126780028253:web:d0386b51b13f49443124b4",
//   measurementId: "G-5QJHMN455P",
// };
const firebaseConfigContent = await accessSecretVersion(FIREBASE_CONFIG_SECRET_NAME);
const firebaseConfig = JSON.parse(firebaseConfigContent);
// Initialize Firebase
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const app = initializeApp(firebaseConfig);

// Check if the environment supports Firebase Analytics
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  const analytics = getAnalytics(app);
}

module.exports = {
  admin,
  db,
  app,
};
})

