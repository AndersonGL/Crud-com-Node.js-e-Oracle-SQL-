

const express = require('express');
const cors = require('cors');
const userController = require('./controllers/userController');
require('dotenv').config(); // Ele busca o .env na raiz de onde o processo foi iniciado

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.get('/usuarios', userController.getAll);
app.post('/usuarios', userController.create);
app.put('/usuarios/:id', userController.update);
app.delete('/usuarios/:id', userController.delete);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const oracledb = require('oracledb');
require('dotenv').config();


