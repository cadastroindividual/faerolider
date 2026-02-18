import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Função para verificar quantos MASTERs existem
async function contarMasters() {
  const q = query(collection(db, "usuarios"), where("role", "==", "MASTER"));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Função para verificar se o usuário está aprovado
export async function verificarAprovacao(uid) {
  const userDoc = await getDoc(doc(db, "usuarios", uid));
  if (userDoc.exists()) {
    return userDoc.data().aprovado === true;
  }
  return false;
}

// Proteção de rota
export function requireAuth(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
    } else {
      const aprovado = await verificarAprovacao(user.uid);
      if (!aprovado) {
        alert("Sua conta ainda não foi aprovada pelo administrador.");
        await signOut(auth);
        window.location.href = "login.html";
      } else if (callback) {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        callback(userDoc.data());
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const tipoUsuario = document.getElementById("tipoUsuario");

  const btnRegister = document.getElementById("btnRegister");
  const btnLogin = document.getElementById("btnLogin");

  if (btnRegister) {
    btnRegister.addEventListener("click", async () => {
      try {
        const nome = nomeInput ? nomeInput.value.trim() : "";
        const email = emailInput.value.trim();
        const senha = passwordInput.value;
        const tipo = tipoUsuario.value;

        if (!email || !senha || !tipo || (nomeInput && !nome)) {
          alert("Preencha todos os campos, incluindo nome e tipo de usuário.");
          return;
        }

        const numMasters = await contarMasters();
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        let roleFinal = "USER";
        let aprovadoFinal = false;

        // Se houver menos de 2 MASTERs, o novo usuário pode ser MASTER e já começa aprovado
        if (numMasters < 2) {
          roleFinal = "MASTER";
          aprovadoFinal = true;
          alert(`Usuário criado como MASTER (${numMasters + 1}/2). Acesso liberado!`);
        } else {
          alert("Conta criada! Aguarde a aprovação de um administrador para acessar o sistema.");
        }

        await setDoc(doc(db, "usuarios", user.uid), {
          uid: user.uid,
          nome: nome || user.email.split('@')[0],
          email: user.email,
          role: roleFinal,
          tipo: tipo,
          aprovado: aprovadoFinal,
          xp: 0,
          status: 'offline',
          createdAt: new Date()
        });

        if (aprovadoFinal) {
          window.location.href = "index.html";
        } else {
          await signOut(auth);
        }

      } catch (error) {
        alert("Erro ao criar conta: " + error.message);
        console.error(error);
      }
    });
  }

  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          emailInput.value,
          passwordInput.value
        );
        
        const user = userCredential.user;
        const aprovado = await verificarAprovacao(user.uid);

        if (!aprovado) {
          alert("Sua conta ainda não foi aprovada. Entre em contato com um administrador.");
          await signOut(auth);
          return;
        }

        window.location.href = "index.html";

      } catch (error) {
        alert("Erro no login: " + error.message);
        console.error(error);
      }
    });
  }
});
