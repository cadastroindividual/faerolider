function carregarRanking() {
    const rankInternos = document.getElementById('rank-internos');
    const rankAutonomos = document.getElementById('rank-autonomos');

    db.collection("usuarios").orderBy("xp", "desc").onSnapshot((snapshot) => {
        rankInternos.innerHTML = "";
        rankAutonomos.innerHTML = "";

        snapshot.forEach((doc) => {
            const user = doc.data();
            const card = document.createElement('div');
            card.className = `user-card ${user.isLiderDoMes ? 'lider-destaque' : ''}`;

            card.innerHTML = `
                <div>
                    <strong>${user.nome}</strong>
                    <div class="status">${user.humor || '😎 Disponível'}</div>
                </div>
                <div class="xp">${user.xp} XP</div>
            `;

            if(user.tipo === 'interno') rankInternos.appendChild(card);
            else rankAutonomos.appendChild(card);
        });
    });
}
