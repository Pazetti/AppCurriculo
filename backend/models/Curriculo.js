const mongoose = require('mongoose');

const ExperienciaSchema = new mongoose.Schema(
  {
    empresa: { type: String, trim: true },
    cargo: { type: String, trim: true },
    periodo: { type: String, trim: true },
    descricao: { type: String, trim: true },
  },
  { _id: false }
);

const FormacaoSchema = new mongoose.Schema(
  {
    instituicao: { type: String, trim: true },
    curso: { type: String, trim: true },
    periodo: { type: String, trim: true },
  },
  { _id: false }
);

const CurriculoSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    nome: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true }, // título profissional
    email: { type: String, trim: true },
    telefone: { type: String, trim: true },
    cidade: { type: String, trim: true },
    resumo: { type: String, trim: true },
    habilidades: { type: [String], default: [] },
    experiencias: { type: [ExperienciaSchema], default: [] },
    formacao: { type: [FormacaoSchema], default: [] },
    foto: { type: String, default: '' }, // data URI (base64)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Curriculo', CurriculoSchema);
