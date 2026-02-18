// ============================================
// FRUTIGER AERO LÍDER — Auth & Global UI
// ============================================

let currentUser = null;
let currentUserData = null;

// ── Toast notifications ───────────────────────
function showToast(msg, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='scale(.9)'; t.style.transition='all .3s'; setTimeout(()=>t.remove(), 300); }, duration);
}

// ── Confirm dialog ────────────────────────────
function showConfirm(msg) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="glass modal-box" style="max-width:360px;text-align:center;">
        <p style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:20px;">${msg}</p>
        <div class="flex justify-center gap-12">
          <button class="btn btn-red" id="confirm-yes">Confirmar</button>
          <button class="btn btn-blue" id="confirm-no">Cancelar</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirm-yes').onclick = () => { overlay.remove(); resolve(true); };
    overlay.querySelector('#confirm-no').onclick  = () => { overlay.remove(); resolve(false); };
  });
}

// ── Taskbar clock ─────────────────────────────
function initClock() {
  const el = document.getElementById('taskbar');
  if (!el) return;
  function tick() {
    const now = new Date();
    el.querySelector('.taskbar-time').textContent = now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    el.querySelector('.taskbar-date').textContent  = now.toLocaleDateString('pt-BR');
  }
  tick(); setInterval(tick, 1000);
}

// ── Render global header ───────────────────────
function renderHeader(activePage) {
  const header = document.getElementById('global-header');
  if (!header) return;

  const u = currentUserData;
  const initials = u?.nome ? u.nome.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '?';
  const orbClass = u?.tipo === 'interno' ? 'orb-blue' : 'orb-teal';

  header.innerHTML = `
    <a href="index.html" class="header-brand">
      <div class="orb orb-md orb-blue" style="font-size:14px;font-weight:900;">FA</div>
      <div class="header-brand-text">
        <span class="brand-main">FRUTIGER AERO</span>
        <span class="brand-sub">LÍDER HUB</span>
      </div>
    </a>
    <nav class="header-nav">
      <a href="index.html"   class="nav-pill ${activePage==='hub'?'active':''}">🏠 Hub</a>
      <a href="feed.html"    class="nav-pill ${activePage==='feed'?'active':''}">📰 Feed</a>
      <a href="perfil.html"  class="nav-pill ${activePage==='perfil'?'active':''}">👤 Meu Perfil</a>
      ${u?.role==='admin' ? `<a href="admin.html" class="nav-pill ${activePage==='admin'?'active':''}">⚙️ ADM</a>` : ''}
    </nav>
    <div class="header-right">
      <a href="perfil.html" class="welcome-chip flex items-center gap-8">
        <div class="orb orb-sm ${orbClass}">${initials}</div>
        <span>Olá, ${u?.nome?.split(' ')[0] || 'Usuário'}!</span>
      </a>
      <button class="icon-pill" id="btn-notif" title="Notificações">
        🔔
        <span class="notif-badge hidden" id="notif-count">0</span>
      </button>
      <button class="icon-pill danger" id="btn-logout" title="Sair">🚪</button>
    </div>`;

  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    const ok = await showConfirm('Deseja sair do sistema?');
    if (ok) {
      await db.collection('usuarios').doc(currentUser.uid).update({ status:'offline' });
      await auth.signOut();
      window.location.href = 'login.html';
    }
  });
}

// ── Route guard: require login ────────────────
function requireAuth(callback) {
  auth.onAuthStateChanged(async user => {
    if (!user) { window.location.href = 'login.html'; return; }
    currentUser = user;
    const doc = await db.collection('usuarios').doc(user.uid).get();
    if (!doc.exists) { await auth.signOut(); window.location.href = 'login.html'; return; }
    currentUserData = { uid: user.uid, ...doc.data() };

    // Status online
    db.collection('usuarios').doc(user.uid).update({ status:'online', ultimaVez: firebase.firestore.FieldValue.serverTimestamp() });
    window.addEventListener('beforeunload', () =>
      db.collection('usuarios').doc(user.uid).update({ status:'offline' }));
    document.addEventListener('visibilitychange', () =>
      db.collection('usuarios').doc(user.uid).update({ status: document.visibilityState==='hidden'?'intervalo':'online' }));

    callback(currentUserData);
  });
}

// ── XP helpers ───────────────────────────────
async function addXP(uid, amount, motivo) {
  const ref = db.collection('usuarios').doc(uid);
  await ref.update({ xp: firebase.firestore.FieldValue.increment(amount) });
  await db.collection('xp_log').add({ uid, amount, motivo, criadoEm: firebase.firestore.FieldValue.serverTimestamp() });
}

// ── Avatar helper ─────────────────────────────
function renderAvatar(user, size='md') {
  const initials = user.nome ? user.nome.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '?';
  const orbClass = user.tipo === 'interno' ? 'orb-blue' : 'orb-teal';
  const sizeClass = `orb-${size}`;
  if (user.fotoPerfil) {
    return `<img src="${user.fotoPerfil}" style="width:${size==='sm'?32:size==='md'?44:size==='lg'?64:90}px;height:${size==='sm'?32:size==='md'?44:size==='lg'?64:90}px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.8);box-shadow:0 2px 8px rgba(0,80,200,.18);" alt="${user.nome}">`;
  }
  return `<div class="orb ${orbClass} ${sizeClass}">${initials}</div>`;
}

// ── Level from XP ─────────────────────────────
function xpToLevel(xp=0) {
  const levels = [0,100,250,500,1000,2000,3500,5500,8000,12000,18000];
  let level = 1;
  for (let i=0;i<levels.length;i++) { if (xp >= levels[i]) level = i+1; else break; }
  const nextXP = levels[Math.min(level, levels.length-1)] || levels[levels.length-1];
  const prevXP = levels[level-1] || 0;
  const pct = Math.min(100, Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100)) || 0;
  return { level, nextXP, pct };
}

document.addEventListener('DOMContentLoaded', initClock);
