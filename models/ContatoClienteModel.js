const mongoose = require('mongoose');

const ContatoClienteSchema = new mongoose.Schema({
    telefone: { type: Array, required: true },
    email: {type: String, required: true},
    id_cliente: { type: String, required: true },
    criado_em: {type: Date, require: true},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const ContatoCliente = mongoose.model('ContatoCliente', ContatoClienteSchema);

module.exports = ContatoCliente;

