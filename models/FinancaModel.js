const mongoose = require('mongoose');

const FinancaSchema = new mongoose.Schema({
    desc: { type: String, require: true },
    data: {type: Date, required: true},
    valor: {type: Number, required: true},
    tipo: {type: Number, required: true}
});

const Financa = mongoose.model('Financa', FinancaSchema);

module.exports = Financa;

