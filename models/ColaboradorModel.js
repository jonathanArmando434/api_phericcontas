const mongoose = require('mongoose');

const ColaboradorSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    num_bi: { type: String, required: true },
    num_iban: {type: String, require: true},
    data_nasc: { type: Date, required: true },
    genero: { type: String, required: true },
    foto_url: String,
    cargo: {type: String, require: true},
    idioma: Array,
    criado_em: {type: Date, require: true, default: new Date()},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const Colaborador = mongoose.model('Colaborador', ColaboradorSchema);

module.exports = Colaborador;

