const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
    nif: { type: String, require: true },
    nome: { type: String, require: true },
    area_negocio: {type: String, require: true},
    foto_url: String,
    criado_em: {type: Date, require: true, default: new Date()},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;

