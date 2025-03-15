// firebaseConfig.js

const firebaseConfig = {
  apiKey: "AIzaSyAHvYMoXyWFF6W8izBkO8GoQpkLzwVL7Ws",
  authDomain: "the-groovist.firebaseapp.com",
  projectId: "the-groovist",
  storageBucket: "the-groovist.firebasestorage.app",
  messagingSenderId: "472652045270",
  appId: "1:472652045270:web:9cf549626a9e85e2e62277",
  measurementId: "G-RVEVHHXL2R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Make Firebase services available globally
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
