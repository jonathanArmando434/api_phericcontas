const mongoose = require('mongoose');

const ContratoSchema = new mongoose.Schema({
    data_inicio: { type: Date, require: true },
    data_fim: { type: Date, require: true },
    status: {type: Boolean, require: true, default: true},
    id_associado: {type: String, require: true},
    criado_em: {type: Date, require: true, default: new Date()},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const Contrato = mongoose.model('Contrato', ContratoSchema);

module.exports = Contrato;

