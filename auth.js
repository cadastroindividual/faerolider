import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const tipoUsuario = document.getElementById("tipoUsuario");

  async function verificarSeExisteMaster() {
    const q = query(collection(db, "usuarios"), where("role", "==", "MASTER"));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  document.getElementById("btnRegister").addEventListener("click", async () => {
    try {

      const email = emailInput.value;
      const senha = passwordInput.value;
      const tipo = tipoUsuario.value;

      if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
      }

      const masterExiste = await verificarSeExisteMaster();

      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      let roleFinal = "USER";
      let tipoFinal = tipo;

      if (!masterExiste) {
        roleFinal = "MASTER";
        tipoFinal = "MASTER";
        alert("Primeiro usuário criado como MASTER.");
      } else {
        if (!tipo) {
          alert("Selecione o tipo de usuário.");
          return;
        }
      }

      await setDoc(doc(db, "usuarios", user.uid), {
        email: user.email,
        role: roleFinal,
        tipo: tipoFinal,
        aprovado: true,
        createdAt: new Date()
      });

      alert("Conta criada com sucesso!");

    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });

  document.getElementById("btnLogin").addEventListener("click", async () => {
    try {

      await signInWithEmailAndPassword(
        auth,
        emailInput.value,
        passwordInput.value
      );

      window.location.href = "index.html";

    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });

});
