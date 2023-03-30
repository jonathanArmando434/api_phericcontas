const mongoose = require('mongoose');

const FinancaSchema = new mongoose.Schema({
    desc: { type: String, require: true },
    data: {type: Date, required: true},
    valor: {type: Number, required: true},
    tipo: {type: String, required: true},
    criado_em: {type: Date, require: true},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const Financa = mongoose.model('Financa', FinancaSchema);

module.exports = Financa;

