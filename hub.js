function carregarRanking(){
const internos=document.getElementById('rank-internos');
const autonomos=document.getElementById('rank-autonomos');

if(!internos)return;

db.collection("usuarios").orderBy("xp","desc").onSnapshot(snap=>{
internos.innerHTML="";
autonomos.innerHTML="";

snap.forEach(doc=>{
const u=doc.data();
const div=document.createElement('div');
div.className=`user-card ${u.isLiderDoMes?'lider-destaque':''}`;
div.innerHTML=`<span>${u.nome}</span><b>${u.xp} XP</b>`;
(u.tipo==='interno'?internos:autonomos).appendChild(div);
});
});
}
