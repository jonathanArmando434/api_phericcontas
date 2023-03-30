const Localizacao = require("../models/LocalizacaoModel");

exports.create = async (req, res) => {
    const { endereco, isPrincipal, id_cliente } = req.body

    const localizacao = { endereco, isPrincipal, id_cliente, criado_em: new Date() }

    try {
        await Localizacao.create(localizacao)

        res.status(201).json({ message: 'Localização inserida no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const localizacao = await Localizacao.find()

        res.status(200).json(localizacao)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const localizacao = await Localizacao.findOne({ _id: id })

        if (!localizacao) {
            res.status(422).json({ message: 'Localização não encontrado!' })
            return
        }

        res.status(200).json(localizacao)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { endereco, isPrincipal, id_cliente } = req.body

    try {
        const localizacao = await Localizacao.findOne({ _id: id })

        if (!localizacao) {
            res.status(422).json({ message: 'Localização não encontrado!' })
            return
        }

        const newLocalizacao = { endereco, isPrincipal, id_cliente, criado_em: localizacao.criado_em }

        Localizacao.updateOne({ _id: id }, newLocalizacao)

        res.status(200).json(newLocalizacao)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const localizacao = await Localizacao.findOne({ _id: id })

    if (!localizacao) {
        res.status(422).json({ message: 'Localização não encontrado!' })
        return
    }

    try {
        await Localizacao.deleteOne({ _id: id })

        res.status(200).json({ message: 'Localização removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}