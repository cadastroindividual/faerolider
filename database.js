// ============================================
// FRUTIGER AERO LÍDER — Firebase Config (COMPAT)
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyDJT35OkIJE7nvdndaBcUzuPYIf3S0SbNo",
  authDomain: "frutigeraero-lider.firebaseapp.com",
  projectId: "frutigeraero-lider",
  storageBucket: "frutigeraero-lider.firebasestorage.app",
  messagingSenderId: "948910846797",
  appId: "1:948910846797:web:87c04ffad0cec300dcbd04",
  measurementId: "G-999WRRZKF0"
};

// Init
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Globals
const auth = firebase.auth();
const db   = firebase.firestore();

// ── Presença ────────────────────────────────
auth.onAuthStateChanged(user => {
  if (!user) return;

  const ref = db.collection('usuarios').doc(user.uid);

  ref.update({
    status: 'online',
    ultimaVez: firebase.firestore.FieldValue.serverTimestamp()
  });

  window.addEventListener('beforeunload', () => {
    ref.update({
      status: 'offline',
      ultimaVez: firebase.firestore.FieldValue.serverTimestamp()
    });
  });

  document.addEventListener('visibilitychange', () => {
    ref.update({
      status: document.visibilityState === 'hidden' ? 'intervalo' : 'online'
    });
  });
});
