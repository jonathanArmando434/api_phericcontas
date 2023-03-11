const mongoose = require('mongoose');

const ContatoClienteSchema = new mongoose.Schema({
    telefone: { type: Array, required: true },
    email: {type: String, required: true},
    id_cliente: { type: String, required: true }
});

const ContatoCliente = mongoose.model('ContatoCliente', ContatoClienteSchema);

module.exports = ContatoCliente;

