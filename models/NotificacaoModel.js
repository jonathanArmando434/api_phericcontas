const mongoose = require('mongoose');

const NotificacaoSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    desc: { type: String, require: true },
    momento: { type: Date, require: true },
    id_user: {type: String, required: true}
});

const Notificacao = mongoose.model('Notificacao', NotificacaoSchema);

module.exports = Notificacao;

