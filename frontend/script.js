console.log('script carregado');

const API_URL = 'http://localhost:3000/usuarios';

const btn = document.getElementById('btnSalvar');

btn.onclick = async function () {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  console.log('clicou', nome, email);

  if (!nome || !email) {
    alert('Preencha os campos');
    return;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email })
});

if (response.ok) {
    alert('Salvo com sucesso');
} else {
    const erro = await response.json();
    alert('Erro ao salvar: ' + (erro.error || 'Erro desconhecido'));
} 
};
