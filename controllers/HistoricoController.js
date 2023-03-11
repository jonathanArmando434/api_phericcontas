const Historico = require("../models/HistoricoModel");

exports.create = async (req, res) => {
    const { desc, momento } = req.body

    const historico = { desc, momento }

    try {
        await Historico.create(historico)

        res.status(201).json({ message: 'Histórico inserido no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const historico = await Historico.find()

        res.status(200).json(historico)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findMany = async (req, res) => {
    const data = req.params.data

    try {
        const historico = await Historico.find({ momento: data })

        if (!historico) {
            res.status(422).json({ message: 'Históricos não encontrado!' })
            return
        }

        res.status(200).json(historico)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const historico = await Historico.findOne({ _id: id })

    if (!historico) {
        res.status(422).json({ message: 'Histórico não encontrado!' })
        return
    }

    try {
        await Historico.deleteOne({ _id: id })

        res.status(200).json({ message: 'Histórico removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}