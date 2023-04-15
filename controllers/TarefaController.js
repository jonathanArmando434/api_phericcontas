const Tarefa = require("../models/TarefaModel");

exports.create = async (req, res) => {
    const { servico, data_limite, valor, id_cliente, id_responsavel } = req.body

    const tarefa = { servico, data_limite: new Date(data_limite), valor, id_cliente, id_responsavel }

    try {
        await Tarefa.create(tarefa)

        res.status(201).json({ message: 'Tarefa inserida no sistema com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}

exports.findAll = async (req, res) => {
    try {
        const tarefa = await Tarefa.find()

        res.status(200).json(tarefa)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const tarefa = await Tarefa.findOne({ _id: id })

        if (!tarefa) {
            res.status(422).json({ message: 'Tarefa não encontrada!' })
            return
        }

        res.status(200).json(tarefa)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}

exports.findMany = async (req, res) => {
    const id = req.params.id

    try {
        let tarefa = await Tarefa.findMany({ id_cliente: id })

        if (!tarefa) {
            tarefa = await Tarefa.findMany({ id_responsavel: id })
            if (!tarefa) {
                res.status(422).json({ message: 'Tarefas não encontrada!' })
                return
            }
        }

        res.status(200).json(tarefa)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { servico, data_limite, data_fim, valor } = req.body

    try {
        const tarefa = await Tarefa.findOne({ _id: id })

        if (!tarefa) {
            res.status(422).json({ message: 'Tarefa não encontrada!' })
            return
        }

        const newTarefa = { servico, data_limite, data_fim, valor, atualizado_em: new Date() }

        Tarefa.updateOne({ _id: id }, newTarefa)

        res.status(200).json({ message: 'Tarefa atualizada com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const tarefa = await Tarefa.findOne({ _id: id })

    if (!tarefa) {
        res.status(422).json({ message: 'Tarefa não encontrada!' })
        return
    }

    try {
        await Tarefa.deleteOne({ _id: id })

        res.status(200).json({ message: 'Tarefa removida com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}