const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
    servico: { type: String, require: true },
    data_inicio: { type: Date, require: true, default: new Date() },
    data_limite: { type: Date, require: true },
    data_fim: Date,
    valor: {type: Number, require: true},
    status: {type: String, require: true, default: 'Em progresso'},
    id_cliente: { type: String, require: true },
    id_responsavel: { type: String, require: true },
    criado_em: {type: Date, require: true},
    atualizado_em: {type: Date, require: true, default: new Date()}
})

const Tarefa = mongoose.model('Terefa', TarefaSchema)

module.exports = Tarefa;

