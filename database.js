// ============================================
// FRUTIGER AERO LÍDER — Firebase Config
// ============================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJT35OkIJE7nvdndaBcUzuPYIf3S0SbNo",
  authDomain: "frutigeraero-lider.firebaseapp.com",
  projectId: "frutigeraero-lider",
  storageBucket: "frutigeraero-lider.firebasestorage.app",
  messagingSenderId: "948910846797",
  appId: "1:948910846797:web:87c04ffad0cec300dcbd04",
  measurementId: "G-999WRRZKF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



// ── Presença em tempo real ──────────────────
auth.onAuthStateChanged(user => {
  if (!user) return;

  const userRef = db.collection('usuarios').doc(user.uid);

  // Marca online
  userRef.update({ status: 'online', ultimaVez: firebase.firestore.FieldValue.serverTimestamp() });

  // Marca offline ao fechar aba
  window.addEventListener('beforeunload', () => {
    navigator.sendBeacon
      ? userRef.update({ status: 'offline', ultimaVez: firebase.firestore.FieldValue.serverTimestamp() })
      : null;
  });

  // Visibilidade (minimizar aba = intervalo)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      userRef.update({ status: 'intervalo' });
    } else {
      userRef.update({ status: 'online' });
    }
  });
});
