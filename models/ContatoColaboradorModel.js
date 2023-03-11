const mongoose = require('mongoose');

const ContatoColaboradorSchema = new mongoose.Schema({
    telefone: { type: Array, required: true },
    endereco: String,
    id_colaborador: { type: String, required: true },
});

const ContatoColaborador = mongoose.model('ContatoColaborador', ContatoColaboradorSchema);

module.exports = ContatoColaborador;

