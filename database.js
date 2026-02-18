// CONFIGURAÇÃO DO FIREBASE
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

// FORMA CORRETA DE INICIALIZAR (Padrão Compat)
firebase.initializeApp(firebaseConfig);

// Criando os atalhos para usar nos outros arquivos
const auth = firebase.auth();
const db = firebase.firestore();
