const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
    nif: { type: String, required: true },
    nome: { type: String, required: true },
    data_de_criacao: { type: Date, required: true },
    area_de_negocio: {type: String, required: true},
    picture: String
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;

