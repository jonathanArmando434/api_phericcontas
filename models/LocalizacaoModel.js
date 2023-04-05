const mongoose = require('mongoose');

const LocalizacaoSchema = new mongoose.Schema({
    endereco: { type: String, required: true },
    isPrincipal: { type: Boolean, required: true },
    id_cliente: {type: String, required: true},
    criado_em: {type: Date, require: true, default: new Date()},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const Localizacao = mongoose.model('Localizacao', LocalizacaoSchema);

module.exports = Localizacao;

