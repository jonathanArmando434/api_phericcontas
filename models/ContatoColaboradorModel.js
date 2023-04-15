const mongoose = require('mongoose');

const ContatoColaboradorSchema = new mongoose.Schema({
    telefone: { type: Array, require: true },
    endereco: String,
    id_colaborador: { type: String, require: true },
    criado_em: {type: Date, require: true, default: new Date()},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const ContatoColaborador = mongoose.model('ContatoColaborador', ContatoColaboradorSchema);

module.exports = ContatoColaborador;

