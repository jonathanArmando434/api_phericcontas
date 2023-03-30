const Cliente = require("../models/ClienteModel");

exports.create = async (req, res) => {
    const { nif, nome, area_negocio } = req.body

    const file = req.file || '';

    const cliente = { nif, nome, area_de_negocio, foto_url: file.path, criado_em: new Date() }

    try {
        await Cliente.create(cliente)

        res.status(201).json({ message: 'Cliente inserida no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const cliente = await Cliente.find()

        res.status(200).json(cliente)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const cliente = await Cliente.findOne({ _id: id })

        if (!cliente) {
            res.status(422).json({ message: 'Cliente não encontrado!' })
            return
        }

        res.status(200).json(cliente)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { nif, nome, area_negocio } = req.body

    try {
        const cliente = await Cliente.findOne({ _id: id })

        if (!cliente) {
            res.status(422).json({ message: 'Cliente não encontrado!' })
            return
        }

        const newCliente = { nif, nome, area_negocio, foto_url: cliente.foto_url, criado_em: cliente.criado_em }

        const updateCliente = await Cliente.updateOne({ _id: id }, newCliente)

        res.status(200).json(newCliente)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const cliente = await Cliente.findOne({ _id: id })

    if (!cliente) {
        res.status(422).json({ message: 'Cliente não encontrado!' })
        return
    }

    if (cliente.picture) fs.unlinkSync(cliente.picture);

    try {
        await Cliente.deleteOne({ _id: id })

        res.status(200).json({ message: 'Cliente removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}