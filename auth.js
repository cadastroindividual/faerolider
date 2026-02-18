const btnEntrar = document.getElementById('btn-entrar');
const loginScreen = document.getElementById('login-screen');
const appContent = document.getElementById('app-content');

btnEntrar.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            verificarUsuario(userCredential.user.uid);
        })
        .catch((error) => {
            document.getElementById('login-error').innerText = "Erro ao acessar: " + error.message;
        });
});

function verificarUsuario(uid) {
    db.collection("usuarios").doc(uid).get().then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            loginScreen.style.display = 'none';
            appContent.style.display = 'block';
            document.getElementById('user-welcome').innerText = `Olá, ${userData.nome}!`;

            // SE FOR ADMIN (Você ou Gerente), MOSTRA O ÍCONE
            if(userData.role === 'admin') {
                document.getElementById('admin-tool').style.display = 'block';
            }
            
            carregarRanking();
        }
    });
}