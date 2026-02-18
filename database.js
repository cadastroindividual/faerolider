// ============================================
// FRUTIGER AERO LÍDER — Firebase Config
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyDVAf8N6g6zD8VR_TPzQKMsA-eIGQuT0AQ",
  authDomain: "frutiger-aero-lider.firebaseapp.com",
  databaseURL: "https://frutiger-aero-lider-default-rtdb.firebaseio.com",
  projectId: "frutiger-aero-lider",
  storageBucket: "frutiger-aero-lider.firebasestorage.app",
  messagingSenderId: "1060513298637",
  appId: "1:1060513298637:web:6e64a5c736b251605c9184",
  measurementId: "G-G6XZTKFXM8"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db   = firebase.firestore();

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
