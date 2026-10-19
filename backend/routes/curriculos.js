const router = require('express').Router();
const mongoose = require('mongoose');
const Curriculo = require('../models/Curriculo');
const auth = require('../middleware/auth');

const CAMPOS = [
  'nome',
  'cargo',
  'email',
  'telefone',
  'cidade',
  'resumo',
  'habilidades',
  'experiencias',
  'formacao',
  'foto',
];

const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Aceita só os campos permitidos e normaliza os tipos
function limpar(body) {
  const dados = {};
  for (const c of CAMPOS) if (body[c] !== undefined) dados[c] = body[c];

  if (typeof dados.habilidades === 'string') {
    dados.habilidades = dados.habilidades.split(',');
  }
  if (Array.isArray(dados.habilidades)) {
    dados.habilidades = dados.habilidades.map((h) => String(h).trim()).filter(Boolean);
  }
  if (Array.isArray(dados.experiencias)) {
    dados.experiencias = dados.experiencias.filter((e) => e && (e.empresa || e.cargo));
  }
  if (Array.isArray(dados.formacao)) {
    dados.formacao = dados.formacao.filter((f) => f && (f.instituicao || f.curso));
  }
  return dados;
}

const idValido = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/curriculos?busca=termo   (público)
router.get('/', async (req, res) => {
  try {
    const filtro = {};
    const termo = (req.query.busca || '').trim();

    if (termo) {
      const rx = new RegExp(escapar(termo), 'i');
      filtro.$or = [
        { nome: rx },
        { cargo: rx },
        { cidade: rx },
        { resumo: rx },
        { habilidades: rx },
        { 'experiencias.empresa': rx },
        { 'experiencias.cargo': rx },
        { 'formacao.curso': rx },
        { 'formacao.instituicao': rx },
      ];
    }

    const lista = await Curriculo.find(filtro)
      .sort({ createdAt: -1 })
      .populate('usuario', 'nome');
    res.json(lista);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao listar currículos.' });
  }
});

// GET /api/curriculos/meus   (autenticado) — precisa vir antes de /:id
router.get('/meus', auth, async (req, res) => {
  try {
    const lista = await Curriculo.find({ usuario: req.userId })
      .sort({ createdAt: -1 })
      .populate('usuario', 'nome');
    res.json(lista);
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao listar seus currículos.' });
  }
});

// GET /api/curriculos/:id   (público)
router.get('/:id', async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido.' });
    const c = await Curriculo.findById(req.params.id).populate('usuario', 'nome');
    if (!c) return res.status(404).json({ erro: 'Currículo não encontrado.' });
    res.json(c);
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar currículo.' });
  }
});

// POST /api/curriculos   (autenticado)
router.post('/', auth, async (req, res) => {
  try {
    const dados = limpar(req.body);
    if (!dados.nome || !dados.cargo) {
      return res.status(400).json({ erro: 'Nome e cargo/título profissional são obrigatórios.' });
    }
    const c = await Curriculo.create({ ...dados, usuario: req.userId });
    res.status(201).json(c);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao criar currículo.' });
  }
});

// PUT /api/curriculos/:id   (autenticado, só o dono)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido.' });
    const c = await Curriculo.findById(req.params.id);
    if (!c) return res.status(404).json({ erro: 'Currículo não encontrado.' });
    if (String(c.usuario) !== req.userId) {
      return res.status(403).json({ erro: 'Você só pode editar seus próprios currículos.' });
    }

    const dados = limpar(req.body);
    if (dados.nome === '' || dados.cargo === '') {
      return res.status(400).json({ erro: 'Nome e cargo/título profissional são obrigatórios.' });
    }
    Object.assign(c, dados);
    await c.save();
    res.json(c);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao atualizar currículo.' });
  }
});

// DELETE /api/curriculos/:id   (autenticado, só o dono)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido.' });
    const c = await Curriculo.findById(req.params.id);
    if (!c) return res.status(404).json({ erro: 'Currículo não encontrado.' });
    if (String(c.usuario) !== req.userId) {
      return res.status(403).json({ erro: 'Você só pode excluir seus próprios currículos.' });
    }
    await c.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao excluir currículo.' });
  }
});

module.exports = router;
