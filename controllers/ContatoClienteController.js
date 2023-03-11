const ContatoCliente = require("../models/ContatoClienteModel");

exports.create = async (req, res) => {
    const { telefone, email, id_cliente } = req.body
    
    const contatoCliente = { telefone, email, id_cliente }

    try {
        await ContatoCliente.create(contatoCliente)

        res.status(201).json({ message: 'Contato do cliente inserido no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const contatoCliente = await ContatoCliente.find()

        res.status(200).json(contatoCliente)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const contatoCliente = await ContatoCliente.findOne({ _id: id })

        if (!contatoCliente) {
            res.status(422).json({ message: 'Contato do cliente não encontrado!' })
            return
        }

        res.status(200).json(contatoCliente)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { telefone, email, id_cliente } = req.body
    
    const contatoCliente = { telefone, email, id_cliente }

    try {
        const updateContatoCliente = await ContatoCliente.updateOne({ _id: id }, contatoCliente)

        if (updateContatoCliente.matchedCount === 0) {       
            res.status(422).json({ message: 'Conta bancária não encontrado!' })
            return
        }

        res.status(200).json(contatoCliente)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const contatoCliente = await ContatoCliente.findOne({ _id: id })

    if (!contatoCliente) {
        res.status(422).json({ message: 'Conta bancária não encontrado!' })
        return
    }

    try {
        await ContatoCliente.deleteOne({ _id: id })

        res.status(200).json({ message: 'Conta bancária removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}