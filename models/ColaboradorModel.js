const mongoose = require('mongoose');

const ColaboradorSchema = new mongoose.Schema({
    nome: { type: String, require: true },
    num_bi: { type: String, require: true },
    num_iban: {type: String, require: true},
    data_nasc: { type: Date, require: true },
    genero: { type: String, require: true },
    foto_url: String,
    cargo: {type: String, require: true},
    idioma: Array,
    criado_em: {type: Date, require: true, default: new Date()},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const Colaborador = mongoose.model('Colaborador', ColaboradorSchema);

module.exports = Colaborador;

