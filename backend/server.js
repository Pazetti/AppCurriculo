require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
// Limite maior porque a foto do currículo é enviada em base64
app.use(express.json({ limit: '8mb' }));

app.get('/', (req, res) => res.json({ ok: true, api: 'Currículos API' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/curriculos', require('./routes/curriculos'));

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/curriculos';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, '0.0.0.0', () => console.log(`API rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('Falha ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
