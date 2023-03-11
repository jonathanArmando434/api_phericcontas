const Notificacao = require("../models/NotificacaoModel");

exports.create = async (req, res) => {
    const { titulo, desc, momento, id_user } = req.body

    const notificacao = { titulo, desc, momento, id_user }

    try {
        await Notificacao.create(notificacao)

        res.status(201).json({ message: 'Notificação inserida no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const notificacao = await Notificacao.find()

        res.status(200).json(notificacao)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findMany = async (req, res) => {
    const data = req.params.data

    try {
        const notificacao = await Notificacao.find({ momento: data })

        if (!notificacao) {
            res.status(422).json({ message: 'Notificação não encontrado!' })
            return
        }

        res.status(200).json(notificacao)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const notificacao = await Notificacao.findOne({ _id: id })

    if (!notificacao) {
        res.status(422).json({ message: 'Notificação não encontrado!' })
        return
    }

    try {
        await Notificacao.deleteOne({ _id: id })

        res.status(200).json({ message: 'Notificação removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}