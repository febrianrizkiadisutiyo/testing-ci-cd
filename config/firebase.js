const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hay-hair-beauty.firebaseio.com",
});

const db = admin.firestore();

const firebaseConfig = {
  apiKey: "AIzaSyCXr2cwdIn-l2AKnVcz5eAGGhxQc3OGpeM",
  authDomain: "hay-hair-beauty.firebaseapp.com",
  projectId: "hay-hair-beauty",
  storageBucket: "hay-hair-beauty.appspot.com",
  messagingSenderId: "126780028253",
  appId: "1:126780028253:web:d0386b51b13f49443124b4",
  measurementId: "G-5QJHMN455P",
};

// Initialize Firebase
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
