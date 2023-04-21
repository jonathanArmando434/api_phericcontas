const Localizacao = require("../models/LocalizacaoModel");
const Cliente = require('../models/ClienteModel')

const verifyIdCliente = async (id_cliente) => {
    const result = await Cliente.findById(id_cliente)
    if (result) return true
    return false
}

exports.create = async (req, res) => {
    const { endereco, isPrincipal, id_cliente } = req.body

    if (!endereco) {
        res.status(422).json({ message: 'O endereço é obrigatório!' })
        return
    }

    if (typeof isPrincipal !== 'boolean') {
        res.status(422).json({
            message: 'É preciso um boleano dizendo se o endereço é o principal ou não!'
        })
        return
    }

    if (!id_cliente) {
        res.status(422).json({ message: 'O ID do cliente é obrigatório!' })
        return
    }

    const verified = await verifyIdCliente(id_cliente)
    if (!verified) {
        res.status(406).json({ message: 'O ID do cliente especificado não existe!' })
        return
    }

    const localizacao = { endereco, isPrincipal, id_cliente }

    try {
        const result = await Localizacao.create(localizacao)

        res.status(201).json({ message: 'Localização inserida no sistema com sucesso!', result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}

exports.findAll = async (req, res) => {
    try {
        const localizacao = await Localizacao.find()

        res.status(200).json(localizacao)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}

exports.findMany = async (req, res) => {
    const id = req.params.id

    try {
        let localizacao = await Localizacao.findOne({ _id: id })

        if (!localizacao) {
            localizacao = await Localizacao.findOne({ id_cliente: id })
            if (!localizacao) {
                res.status(422).json({ message: 'Localização não encontrado!' })
                return
            }
        }

        res.status(200).json(localizacao)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { endereco, isPrincipal, id_cliente } = req.body

    try {
        let localizacao = await Localizacao.findOne({ _id: id })

        let isPrincipal = true

        if (!localizacao) {
            localizacao = await Localizacao.findOne({ id_cliente: id })
            if (!localizacao) {
                res.status(422).json({ message: 'Localização não encontrado!' })
                return
            }
            isPrincipal = false
        }

        const newLocalizacao = { endereco, isPrincipal, atualizado_em: new Date() }

        let updated
        if (isPrincipal) updated = await Localizacao.updateOne({ _id: id }, newLocalizacao)
        else updated = await Localizacao.updateOne({ id_cliente: id }, newLocalizacao)

        res.status(200).json({ message: 'Localização atualizada com sucesso!', result: { ...updated, _id: localizacao._id } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
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
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}