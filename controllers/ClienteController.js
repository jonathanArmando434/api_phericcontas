const Cliente = require("../models/ClienteModel");

exports.create = async (req, res) => {
    const { nif, nome, data_de_criacao, area_de_negocio } = req.body

    const file = req.file;

    const cliente = { nif, nome, data_de_criacao, area_de_negocio, picture: file.path }

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

    const { nif, nome, data_de_criacao, area_de_negocio } = req.body

    try {
        const cliente = await Cliente.findOne({ _id: id })

        if (!cliente) {
            res.status(422).json({ message: 'Cliente não encontrado!' })
            return
        }

        const newCliente = { nif, nome, data_de_criacao, area_de_negocio, picture: cliente.picture }

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