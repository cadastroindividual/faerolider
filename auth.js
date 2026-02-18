// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 SUA CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDJT35OkIJE7nvdndaBcUzuPYIf3S0SbNo",
  authDomain: "frutigeraero-lider.firebaseapp.com",
  projectId: "frutigeraero-lider",
  storageBucket: "frutigeraero-lider.firebasestorage.app",
  messagingSenderId: "948910846797",
  appId: "1:948910846797:web:87c04ffad0cec300dcbd04",
  measurementId: "G-999WRRZKF0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔒 Proteção automática de rota
export function requireAuth() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "/faerolider/login.html";
    }
  });
}

// 🔓 Logout global
export function logout() {
  signOut(auth).then(() => {
    window.location.href = "/faerolider/login.html";
  });
}
