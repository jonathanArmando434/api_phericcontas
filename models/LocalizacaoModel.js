const mongoose = require('mongoose');

const LocalizacaoSchema = new mongoose.Schema({
    endereco: { type: String, required: true },
    isPrincipal: { type: Boolean, required: true },
    id_cliente: {type: String, required: true}
});

const Localizacao = mongoose.model('Localizacao', LocalizacaoSchema);

module.exports = Localizacao;

