const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const gerarToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

const emailValido = (e) => /^\S+@\S+\.\S+$/.test(e);

const publico = (u) => ({ id: u.id, nome: u.nome, email: u.email });

// POST /api/auth/cadastro
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Informe nome, e-mail e senha.' });
    }
    if (!emailValido(email)) {
      return res.status(400).json({ erro: 'E-mail inválido.' });
    }
    if (String(senha).length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const emailNorm = String(email).toLowerCase().trim();
    if (await User.findOne({ email: emailNorm })) {
      return res.status(409).json({ erro: 'Já existe uma conta com esse e-mail.' });
    }

    const hash = await bcrypt.hash(String(senha), 10);
    const user = await User.create({ nome: String(nome).trim(), email: emailNorm, senha: hash });

    res.status(201).json({ token: gerarToken(user.id), usuario: publico(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    const ok = user && (await bcrypt.compare(String(senha), user.senha));
    if (!ok) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

    res.json({ token: gerarToken(user.id), usuario: publico(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
});

// GET /api/auth/me  (valida o token salvo no app)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ erro: 'Usuário não encontrado.' });
    res.json({ usuario: publico(user) });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar usuário.' });
  }
});

module.exports = router;
