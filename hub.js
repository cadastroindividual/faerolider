function carregarRanking() {
    const rankInternos = document.getElementById('rank-internos');
    const rankAutonomos = document.getElementById('rank-autonomos');
    const totalMembros = document.getElementById('total-membros');
    const liderNome = document.getElementById('lider-nome');
    const liderXp = document.getElementById('lider-xp');

    rankInternos.innerHTML = "";
    rankAutonomos.innerHTML = "";

    db.collection("usuarios").orderBy("xp", "desc").onSnapshot((snapshot) => {
        rankInternos.innerHTML = "";
        rankAutonomos.innerHTML = "";

        let contInternos = 0;
        let contAutonomos = 0;
        let totalUsers = 0;
        let liderDoMes = null;

        snapshot.forEach((doc) => {
            const user = doc.data();
            totalUsers++;

            if (user.isLiderDoMes && !liderDoMes) {
                liderDoMes = user;
            }

            if (user.tipo === 'interno') {
                contInternos++;
                const card = criarCard(user, contInternos);
                rankInternos.appendChild(card);
            } else {
                contAutonomos++;
                const card = criarCard(user, contAutonomos);
                rankAutonomos.appendChild(card);
            }
        });

        if (totalMembros) totalMembros.textContent = totalUsers;

        if (liderDoMes) {
            if (liderNome) liderNome.textContent = liderDoMes.nome;
            if (liderXp) liderXp.textContent = `⭐ ${liderDoMes.xp} XP`;
        }

        if (rankInternos.innerHTML === "") {
            rankInternos.innerHTML = '<div style="text-align:center;padding:20px;color:#667;font-size:13px;">Nenhum membro interno</div>';
        }
        if (rankAutonomos.innerHTML === "") {
            rankAutonomos.innerHTML = '<div style="text-align:center;padding:20px;color:#667;font-size:13px;">Nenhum corretor autônomo</div>';
        }
    });
}

function criarCard(user, posicao) {
    const card = document.createElement('div');
    card.className = `user-card rank-${posicao} ${user.isLiderDoMes ? 'lider-destaque' : ''}`;

    const rankLabel = posicao <= 3
        ? `<span class="user-card-rank"><span>${posicao}</span></span>`
        : `<span class="user-card-rank"><span>#${posicao}</span></span>`;

    const humor = user.humor || '😎 Disponível';
    const xp = user.xp || 0;

    card.innerHTML = `
        ${rankLabel}
        <div class="user-card-info">
            <strong>${user.nome || 'Usuário'}</strong>
            <small>${humor}</small>
        </div>
        <div class="user-card-xp">⚡ ${xp} XP</div>
    `;

    return card;
}
