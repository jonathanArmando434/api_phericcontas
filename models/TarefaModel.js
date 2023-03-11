const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
    servico: { type: String, required: true },
    data_de_inicio: { type: Date, required: true },
    data_de_finalizacao: { type: Date, required: true },
    status: { type: Number, required: true },
    valor: {type: Number, requiredd: true},
    id_cliente: { type: String, required: true },
    id_responsavel: { type: String, required: true }
})

const Tarefa = mongoose.model('Terefa', TarefaSchema)

module.exports = Tarefa;

