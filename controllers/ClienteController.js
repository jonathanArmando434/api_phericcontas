const Cliente = require("../models/ClienteModel");

const ExistClient = async (nif) => {
    let result = await Cliente.findOne({ nif: nif })
    if (result) {
        return true
    }
    return false
}

exports.create = async (req, res) => {
    const { nif, nome, area_negocio } = req.body

    const file = req.file || '';

    if (!nif) {
        res.status(422).json({ message: 'O NIF é obrigatório!' })
        return
    }

    if (!nome) {
        res.status(422).json({ message: 'O nome é obrigatório!' })
        return
    }

    if (!area_negocio) {
        res.status(422).json({ message: 'A área de negócio é obrigatório1' })
        return
    }

    const exist = await ExistClient(nif)
    if (exist) {
        res.status(406).json({ message: 'Este NIF já foi usado!' })
        return
    }

    const cliente = { nif, nome, area_negocio, foto_url: file.path }

    try {
        const result = await Cliente.create(cliente)

        res.status(201).json({ message: 'Cliente inserido no sistema com sucesso!', result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.findAll = async (req, res) => {
    try {
        const cliente = await Cliente.find()

        res.status(200).json(cliente)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
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
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { nome, area_negocio } = req.body

    try {
        const cliente = await Cliente.findOne({ _id: id })

        if (!cliente) {
            res.status(422).json({ message: 'Cliente não encontrado!' })
            return
        }

        const newCliente = { nome, area_negocio, atualizado_em: new Date() }

        const updateCliente = await Cliente.updateOne({ _id: id }, newCliente)

        res.status(200).json({message: 'Cliente atualizado com sucesso!', result: {...updateCliente, _id: cliente._id}})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const cliente = await Cliente.findOne({ _id: id })

    if (!cliente) {
        res.status(422).json({ message: 'Cliente não encontrado!' })
        return
    }

    if (cliente.foto_url) fs.unlinkSync(cliente.foto_url);

    try {
        await Cliente.deleteOne({ _id: id })

        res.status(200).json({ message: 'Cliente removido com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}