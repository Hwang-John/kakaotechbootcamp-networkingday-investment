// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu9yow7A2AVPB-nNILrY33dW9pvBzqg5U",
  authDomain: "tech-entrepreneur-invest.firebaseapp.com",
  projectId: "tech-entrepreneur-invest",
  storageBucket: "tech-entrepreneur-invest.firebasestorage.app",
  messagingSenderId: "992495497400",
  appId: "1:992495497400:web:24241b69d04bbbd684444d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 전역으로 export하여 다른 곳에서도 사용 가능
window.db = db;

// ES6 모듈 export
export { db };
