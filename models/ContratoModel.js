const mongoose = require('mongoose');

const ContratoSchema = new mongoose.Schema({
    data_inicio: { type: Date, required: true },
    data_fim: { type: Date, required: true },
    status: { type: Boolean, required: true },
    id_associado: {type: String, required: true}
});

const Contrato = mongoose.model('Contrato', ContratoSchema);

module.exports = Contrato;

