const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
    nif: { type: String, required: true },
    nome: { type: String, required: true },
    area_negocio: {type: String, required: true},
    foto_url: String,
    criado_em: {type: Date, require: true, default: new Date()},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;

