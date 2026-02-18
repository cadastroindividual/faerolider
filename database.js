// ============================================
// FRUTIGER AERO LÍDER — Firebase Config & Logic
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

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ── SISTEMA DE XP E RESET MENSAL ────────────────

// Regras de ganho de XP
const XP_RULES = {
  POST: 20,
  LIKE: 5,
  COMMENT: 10,
  CHALLENGE: 50
};

async function addXP(uid, amount, reason) {
  if (!uid) return;
  const userRef = db.collection('usuarios').doc(uid);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(userRef);
    if (!doc.exists) return;

    const data = doc.data();
    let newXP = (data.xp || 0) + amount;
    let lastReset = data.lastResetMonth || "";

    // Reset mensal automático
    if (lastReset !== currentMonth) {
      newXP = amount;
      transaction.update(userRef, { 
        xp: newXP, 
        lastResetMonth: currentMonth,
        xpHistorico: firebase.firestore.FieldValue.arrayUnion({ month: lastReset, xp: data.xp || 0 })
      });
    } else {
      transaction.update(userRef, { xp: newXP });
    }

    // Notificação silenciosa (24h)
    const lastNotify = data.lastXPNotification?.toDate() || new Date(0);
    const diffHours = (now - lastNotify) / (1000 * 60 * 60);

    if (diffHours >= 24) {
      // O front-end pode ouvir essa mudança e mostrar um toast
      transaction.update(userRef, { lastXPNotification: now, pendingNotification: `Você acumulou XP por suas interações recentes! 🎉` });
    }
  });
}

// ── SISTEMA DE PRESENÇA ─────────────────────────

auth.onAuthStateChanged(user => {
  if (!user) return;
  const userRef = db.collection('usuarios').doc(user.uid);

  userRef.update({
    status: 'online',
    ultimaVez: firebase.firestore.FieldValue.serverTimestamp()
  });

  window.addEventListener('beforeunload', () => {
    userRef.update({ status: 'offline', ultimaVez: firebase.firestore.FieldValue.serverTimestamp() });
  });

  document.addEventListener('visibilitychange', () => {
    userRef.update({ status: document.visibilityState === 'hidden' ? 'intervalo' : 'online' });
  });
});

// ── UTILITÁRIOS DE GAMIFICAÇÃO ──────────────────

function xpToLevel(xp) {
  return Math.floor(Math.sqrt(xp / 10)) + 1;
}

function renderAvatar(u, size = 'md') {
  const s = size === 'sm' ? '32px' : size === 'lg' ? '80px' : '48px';
  const fontSize = size === 'sm' ? '14px' : size === 'lg' ? '32px' : '20px';
  
  if (u.fotoUrl) {
    return `<img src="${u.fotoUrl}" style="width:${s};height:${s};border-radius:50%;object-fit:cover;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.1);">`;
  }
  
  const colors = {
    'MASTER': 'var(--orb-gold)',
    'admin': 'var(--orb-pink)',
    'INTERNO': 'var(--orb-blue)',
    'CORRETOR': 'var(--orb-green)'
  };
  const bg = colors[u.role] || colors[u.tipo] || 'var(--orb-blue)';
  
  return `
    <div class="orb" style="width:${s};height:${s};background:${bg};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:${fontSize};border:2px solid rgba(255,255,255,0.8);box-shadow:0 4px 12px rgba(0,0,0,0.15);position:relative;overflow:hidden;">
      ${(u.nome || u.email || '?')[0].toUpperCase()}
      <div style="position:absolute;top:10%;left:15%;width:40%;height:20%;background:rgba(255,255,255,0.4);border-radius:50%;filter:blur(2px);transform:rotate(-15deg);"></div>
    </div>`;
}
