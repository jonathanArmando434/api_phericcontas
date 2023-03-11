const mongoose = require('mongoose');

const HistoricoSchema = new mongoose.Schema({
    desc: { type: String, require: true },
    momento: {type: Date, required: true}
});

const Historico = mongoose.model('Historico', HistoricoSchema);

module.exports = Historico;

