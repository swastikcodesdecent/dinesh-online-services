/**
 * DINESH ONLINE SOLUTION - FIREBASE CONFIGURATION
 * Place your official Firebase Project credentials here.
 * When real credentials are supplied, the app automatically connects to live Firestore,
 * Firebase Authentication, Firebase Storage and Cloud Functions.
 */

const firebaseConfig = {
  apiKey: "AIzaSyYOUR_API_KEY_HERE_REPLACE_WITH_FIREBASE_KEY",
  authDomain: "dinesh-online-solution.firebaseapp.com",
  projectId: "dinesh-online-solution",
  storageBucket: "dinesh-online-solution.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Check if Firebase keys are placeholders
const isPlaceholderConfig = (config) => {
  return !config.apiKey || config.apiKey.includes("YOUR_API_KEY");
};

// Initialize Firebase App
let app = null;
let auth = null;
let db = null;
let storage = null;
let functions = null;

try {
  if (typeof firebase !== 'undefined' && !isPlaceholderConfig(firebaseConfig)) {
    app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    functions = firebase.functions();
    console.info("[Firebase] Successfully connected to live Firebase services.");
  } else {
    console.warn("[Firebase] Running with Local Fallback / Demo Store. Replace credentials in firebase-config.js for live production deployment.");
  }
} catch (e) {
  console.error("[Firebase Initialization Error]:", e);
}

// Global helpers
window.DOS_CONFIG = {
  firebaseConfig,
  isLive: !isPlaceholderConfig(firebaseConfig) && app !== null,
  getApp: () => app,
  getAuth: () => auth,
  getDb: () => db,
  getStorage: () => storage,
  getFunctions: () => functions,
  business: {
    name: "Dinesh Online Solution",
    tagline: "Your True Digital Companion",
    phone: "+91 91311 71406",
    phoneRaw: "9131171406",
    whatsapp: "+91 91311 71406",
    email: "email.d2841735@gmail.com",
    address: "Jabalpur, Madhya Pradesh",
    hours: "9:00 AM to 7:30 PM",
    googleMapsUrl: "https://maps.google.com/?q=Jabalpur,+Madhya+Pradesh"
  },
  razorpayKeyId: "rzp_test_YOUR_KEY_ID" // Replace with Razorpay Key ID
};

