const mongoose = require('mongoose');

const LocalizacaoSchema = new mongoose.Schema({
    endereco: { type: String, require: true },
    isPrincipal: { type: Boolean, require: true },
});

module.exports = LocalizacaoSchema;

