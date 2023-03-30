const Financa = require("../models/FinancaModel");

exports.create = async (req, res) => {
    const { desc, data, valor, tipo } = req.body

    const dado = { desc, data, valor, tipo, criado_em: new Data() }

    try {
        await Financa.create(dado)

        res.status(201).json({ message: 'Dado de Finança inserido no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const dado = await Financa.find()

        res.status(200).json(dado)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const dado = await Financa.findOne({ _id: id })

        if (!dado) {
            res.status(422).json({ message: 'Dados de finança não encontrado!' })
            return
        }

        res.status(200).json(dado)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { desc, data, valor, tipo } = req.body

    try {
        const dado = await Financa.findOne({ _id: id })

        if (!dado) {
            res.status(422).json({ message: 'Dados de finança não encontrado!' })
            return
        }

        const newDado = { desc, data, valor, tipo, criado_em: dado.criado_em }

        Financa.updateOne({ _id: id }, newDado )

        res.status(200).json(newDado)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const dado = await Financa.findOne({ _id: id })

    if (!dado) {
        res.status(422).json({ message: 'Dado de finança não encontrado!' })
        return
    }

    try {
        await Financa.deleteOne({ _id: id })

        res.status(200).json({ message: 'Dado de finança removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}