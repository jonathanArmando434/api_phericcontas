const ContatoColaborador = require("../models/ContatoColaboradorModel");

exports.create = async (req, res) => {
    const { telefone, endereco, id_colaborador } = req.body

    const phone = [telefone]
    
    const contatoColaborador = { telefone: phone, endereco, id_colaborador }

    try {
        await ContatoColaborador.create(contatoColaborador)

        res.status(201).json({ message: 'Contato do Colaborador inserido no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const contatoColaborador = await ContatoColaborador.find()

        res.status(200).json(contatoColaborador)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const contatoColaborador = await ContatoColaborador.findOne({ _id: id })

        if (!contatoColaborador) {
            res.status(422).json({ message: 'Contato do colaborador não encontrado!' })
            return
        }

        res.status(200).json(contatoColaborador)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { telefone, endereco, id_colaborador } = req.body

    try {
        const contato = await ContatoColaborador.findOne({ _id: id })

        if (!contato) {
            res.status(422).json({ message: 'Contato não encontrado!' })
            return
        }

        const phone = [...contato.telefone, telefone]

        const contatoColaborador = { telefone: phone, endereco, id_colaborador }

        const updateContatoColaborador = await ContatoColaborador.updateOne({ _id: id }, contatoColaborador)

        res.status(200).json(contatoColaborador)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const contatoColaborador = await ContatoColaborador.findOne({ _id: id })

    if (!contatoColaborador) {
        res.status(422).json({ message: 'Contato do colaborador não encontrado!' })
        return
    }

    try {
        await ContatoColaborador.deleteOne({ _id: id })

        res.status(200).json({ message: 'Contato do colaborador removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}