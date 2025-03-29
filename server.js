// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/meuBancoDeDados', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Definição do esquema e modelo do cheque
const chequeSchema = new mongoose.Schema({
    nomeCliente: String,
    numeroCheque: String,
    valor: Number,
    dataVencimento: Date,
    codigoBanco: String
});

const Cheque = mongoose.model('Cheque', chequeSchema);

// Rota para criar um novo cheque
app.post('/api/cheques', async (req, res) => {
    try {
        const cheque = new Cheque(req.body);
        await cheque.save();
        res.status(201).send(cheque);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Rota para obter todos os cheques
app.get('/api/cheques', async (req, res) => {
    try {
        const cheques = await Cheque.find(); // Carrega todos os cheques
        res.status(200).json(cheques); // Retorna como JSON
    } catch (error) {
        console.error("Erro ao carregar cheques:", error);
        res.status(500).json({ message: 'Erro ao carregar cheques.' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
