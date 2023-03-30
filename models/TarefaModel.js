const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
    servico: { type: String, required: true },
    data_inicio: { type: Date, required: true },
    data_limite: { type: Date, required: true },
    data_fim: { type: Date, required: true },
    valor: {type: Number, requiredd: true},
    id_cliente: { type: String, required: true },
    id_responsavel: { type: String, required: true },
    criado_em: {type: Date, require: true},
    atualizado_em: {type: Date, require: true, default: new Date()}
})

const Tarefa = mongoose.model('Terefa', TarefaSchema)

module.exports = Tarefa;

