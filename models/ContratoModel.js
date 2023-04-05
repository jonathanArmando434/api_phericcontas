const mongoose = require('mongoose');

const ContratoSchema = new mongoose.Schema({
    data_inicio: { type: Date, required: true },
    data_fim: { type: Date, required: true },
    status: {type: Boolean, require: true, default: true},
    id_associado: {type: String, required: true},
    criado_em: {type: Date, require: true, default: new Date()},
    atualizado_em: {type: Date, require: true, default: new Date()}
});

const Contrato = mongoose.model('Contrato', ContratoSchema);

module.exports = Contrato;

