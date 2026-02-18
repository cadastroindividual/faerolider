// ============================================
// FRUTIGER AERO LÍDER — Firebase Config
// VERSÃO COMPAT (CORRIGIDA)
// ============================================

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJT35OkIJE7nvdndaBcUzuPYIf3S0SbNo",
  authDomain: "frutigeraero-lider.firebaseapp.com",
  projectId: "frutigeraero-lider",
  storageBucket: "frutigeraero-lider.firebasestorage.app",
  messagingSenderId: "948910846797",
  appId: "1:948910846797:web:87c04ffad0cec300dcbd04",
  measurementId: "G-999WRRZKF0"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Serviços globais
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics ? firebase.analytics() : null;


// ============================================
// SISTEMA DE PRESENÇA
// ============================================

auth.onAuthStateChanged(user => {
  if (!user) return;

  const userRef = db.collection('usuarios').doc(user.uid);

  // Marca online
  userRef.update({
    status: 'online',
    ultimaVez: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Ao fechar aba
  window.addEventListener('beforeunload', () => {
    userRef.update({
      status: 'offline',
      ultimaVez: firebase.firestore.FieldValue.serverTimestamp()
    });
  });

  // Quando aba perde foco
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      userRef.update({ status: 'intervalo' });
    } else {
      userRef.update({ status: 'online' });
    }
  });
});
