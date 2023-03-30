const Tarefa = require("../models/TarefaModel");

exports.create = async (req, res) => {
    const { servico, data_de_inicio, data_limite, data_de_finalizacao, valor, id_cliente, id_responsavel } = req.body

    const tarefa = { servico, data_de_inicio, data_limite, data_de_finalizacao, valor, id_cliente, id_responsavel, criado_em: new Date() }

    try {
        await Tarefa.create(tarefa)

        res.status(201).json({ message: 'Tarefa inserida no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const tarefa = await Tarefa.find()

        res.status(200).json(tarefa)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const tarefa = await Tarefa.findOne({ _id: id })

        if (!tarefa) {
            res.status(422).json({ message: 'Tarefa não encontrado!' })
            return
        }

        res.status(200).json(tarefa)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { servico, data_de_inicio, data_limite, data_de_finalizacao, valor, id_cliente, id_rsponsavel } = req.body

    try {
        const tarefa = await Tarefa.findOne({ _id: id })

        if (!tarefa) {
            res.status(422).json({ message: 'Tarefa não encontrado!' })
            return
        }

        const newTarefa = { servico, data_de_inicio, data_limite, data_de_finalizacao, valor, id_cliente, id_rsponsavel, criado_em: tarefa.criado_em }

        Tarefa.updateOne({ _id: id }, newTarefa)

        res.status(200).json(newTarefa)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const tarefa = await Tarefa.findOne({ _id: id })

    if (!tarefa) {
        res.status(422).json({ message: 'Tarefa não encontrado!' })
        return
    }

    try {
        await Tarefa.deleteOne({ _id: id })

        res.status(200).json({ message: 'Tarefa removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}