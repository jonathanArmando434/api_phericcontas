const mongoose = require('mongoose');

const FinancaSchema = new mongoose.Schema({
    desc: { type: String, require: true },
    data: {type: Date, require: true},
    valor: {type: Number, require: true},
    tipo: {type: String, require: true},
    criado_em: {type: Date, require: true, default: new Date()},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const Financa = mongoose.model('Financa', FinancaSchema);

module.exports = Financa;

