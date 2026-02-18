// ============================================
// FRUTIGER AERO LÍDER — Auth & UI
// ============================================

let currentUser = null;
let currentUserData = null;

// ── Login ─────────────────────────────
async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const errEl = document.getElementById('auth-error');
  errEl.textContent = '';

  if (!email || !pass) {
    errEl.textContent = 'Preencha e-mail e senha.';
    return;
  }

  try {
    const cred = await auth.signInWithEmailAndPassword(email, pass);
    const doc  = await db.collection('usuarios').doc(cred.user.uid).get();

    if (!doc.exists || !doc.data().aprovado) {
      await auth.signOut();
      errEl.textContent = '⏳ Conta aguardando aprovação.';
      return;
    }

    window.location.href = 'index.html';
  } catch (e) {
    errEl.textContent =
      e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found'
        ? 'E-mail ou senha incorretos.'
        : e.message;
  }
}

// ── Cadastro ──────────────────────────
async function doSignup() {
  const nome  = document.getElementById('signup-nome').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass  = document.getElementById('signup-pass').value;
  const tipo  = document.getElementById('signup-tipo').value;
  const errEl = document.getElementById('auth-error');
  errEl.textContent = '';

  if (!nome || !email || !pass || !tipo) {
    errEl.textContent = 'Preencha todos os campos.';
    return;
  }

  if (pass.length < 6) {
    errEl.textContent = 'Senha mínima de 6 caracteres.';
    return;
  }

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);

    await db.collection('usuarios').doc(cred.user.uid).set({
      nome,
      email,
      tipo,
      role: 'user',
      aprovado: false,
      xp: 0,
      nivel: 1,
      status: 'offline',
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });

    await auth.signOut();
    document.getElementById('pending-notice')?.classList.remove('hidden');

  } catch (e) {
    errEl.textContent =
      e.code === 'auth/email-already-in-use'
        ? 'Este e-mail já está cadastrado.'
        : e.message;
  }
}
