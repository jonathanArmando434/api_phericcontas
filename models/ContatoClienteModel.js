const mongoose = require('mongoose');

const ContatoClienteSchema = new mongoose.Schema({
    telefone: { type: Array, require: true },
    email: {type: String, require: true},
    id_cliente: { type: String, require: true },
    criado_em: {type: Date, require: true, default: new Date()},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const ContatoCliente = mongoose.model('ContatoCliente', ContatoClienteSchema);

module.exports = ContatoCliente;

