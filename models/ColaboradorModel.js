const mongoose = require('mongoose');

const ColaboradorSchema = new mongoose.Schema({
    bi: { type: String, required: true },
    nome: { type: String, required: true },
    data_nascimento: { type: Date, required: true },
    genero: { type: String, required: true },
    idioma: Array,
    picture: String
});

const Colaborador = mongoose.model('Colaborador', ColaboradorSchema);

module.exports = Colaborador;

