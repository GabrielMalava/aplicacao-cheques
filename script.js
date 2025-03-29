let cheques = [];

// Função para carregar cheques do servidor
async function carregarCheques() {
    try {
        const response = await fetch('http://localhost:5500/api/cheques');
        
        if (!response.ok) {
            throw new Error('Erro ao carregar cheques: ' + response.statusText);
        }

        cheques = await response.json(); // Armazena os cheques no array
        displayCheques(cheques); // Exibe os cheques na tabela
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para adicionar cheques ao servidor e ao array
async function addCheque(chequeData) {
    try {
        const response = await fetch('http://localhost:5500/api/cheques', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chequeData),
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar cheque: ' + response.statusText);
        }

        const newCheque = await response.json();
        cheques.push(newCheque);
        displayCheques(cheques);
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Listener para o formulário de cheques
document.getElementById('cheque-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const chequeData = {
        nomeCliente: document.getElementById('nome-cliente').value,
        numeroCheque: document.getElementById('numero-cheque').value,
        valor: parseFloat(document.getElementById('valor').value), // Converter para número
        dataVencimento: document.getElementById('data-vencimento').value,
        codigoBanco: document.getElementById('codigo-banco').value,
    };

    addCheque(chequeData);
    document.getElementById('cheque-form').reset();
});

// Função para exibir os cheques na tabela, ordenados pela data de vencimento
function displayCheques(cheques) {
    const tableBody = document.querySelector('#cheque-table tbody');
    tableBody.innerHTML = '';  // Limpa a tabela

    // Ordena os cheques por data de vencimento (do mais próximo ao mais distante)
    cheques.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));

    // Adiciona os cheques na tabela
    cheques.forEach(cheque => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cheque.nomeCliente}</td>
            <td>${cheque.numeroCheque}</td>
            <td>${cheque.valor.toFixed(2)}</td>
            <td>${new Date(cheque.dataVencimento).toLocaleDateString()}</td>
            <td>${cheque.codigoBanco}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Carrega os cheques ao carregar a página
window.addEventListener('DOMContentLoaded', carregarCheques);
// Listener para o botão de carregar cheques
document.getElementById('load-cheques').addEventListener('click', carregarCheques);

