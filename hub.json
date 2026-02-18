function carregarRanking() {
    const rankInternos = document.getElementById('rank-internos');
    const rankAutonomos = document.getElementById('rank-autonomos');

    // Limpar listas
    rankInternos.innerHTML = "";
    rankAutonomos.innerHTML = "";

    // Puxa todos os usuários ordenados por XP
    db.collection("usuarios").orderBy("xp", "desc").onSnapshot((snapshot) => {
        rankInternos.innerHTML = "";
        rankAutonomos.innerHTML = "";
        
        snapshot.forEach((doc) => {
            const user = doc.data();
            const card = document.createElement('div');
            card.className = `user-card ${user.isLiderDoMes ? 'lider-destaque' : ''}`;
            
            card.innerHTML = `
                <div>
                    <strong>${user.nome}</strong> <br>
                    <small>${user.humor || '😎 Disponível'}</small>
                </div>
                <div>XP: ${user.xp}</div>
            `;

            // Separa nas colunas certas
            if(user.tipo === 'interno') {
                rankInternos.appendChild(card);
            } else {
                rankAutonomos.appendChild(card);
            }
        });
    });
}