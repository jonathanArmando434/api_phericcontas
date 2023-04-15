const validator = require("email-validator");
const ContatoCliente = require("../models/ContatoClienteModel");
const Cliente = require('../models/ClienteModel')

const contatoExist = async (id_cliente) => {
    const result = await ContatoCliente.findOne({ id_cliente: id_cliente })
    if (result) return true
    return false
}

const verifyIdClient = async (id_cliente) => {
    const result = await Cliente.findById(id_cliente)
    if (result) return true
    return false
}

const removeEmptyValue = (array) => {
    array = removeSamevalue(array)
    const aux = array.filter(value => value !== '')
    return aux
}


const removeSamevalue = (array) => {
    array.forEach((value, index) => {
        for (let i = index + 1; i < array.length; i++)
            if (array[i] === value) array[i] = ''
    })

    return array
}

exports.create = async (req, res) => {
    const { telefone, email, id_cliente } = req.body

    const auxTelefone = removeEmptyValue(telefone)

    if (!auxTelefone || auxTelefone.length === 0) {
        res.status(422).json({ message: 'O telefone / whatsApp é obrigatório!' })
        return
    }

    if (!email) {
        res.status(422).json({ message: 'O e-mail é obrigatório!' })
        return
    }

    if (!validator.validate(email)) {
        res.status(406).json({ message: 'E-mail inválido' })
        return false
    }

    if (!id_cliente) {
        res.status(422).json({ message: 'O ID do Cliente é obrigatório!' })
        return
    }

    const verified = await verifyIdClient(id_cliente)
    if (!verified) {
        res.status(406).json({ message: 'O ID do cliente especificado não existe!' })
        return
    }

    const exist = await contatoExist(id_cliente)
    if (exist) {
        res.status(406).json({ message: 'Já foi cadastrado um contato com este ID!' })
        return
    }

    const contatoCliente = { telefone: auxTelefone, email, id_cliente }

    try {
        const result = await ContatoCliente.create(contatoCliente)

        res.status(201).json({ message: 'Contato do cliente inserido no sistema com sucesso!', result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, temte novamente!' })
    }
}

exports.findAll = async (req, res) => {
    try {
        const contatoCliente = await ContatoCliente.find()

        res.status(200).json(contatoCliente)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        let contatoCliente = await ContatoCliente.findOne({ _id: id })

        if (!contatoCliente) {
            contatoCliente = await ContatoCliente.findOne({ id_cliente: id })
            if (!contatoCliente) {
                res.status(422).json({ message: 'Contato do cliente não encontrado!' })
                return
            }
        }

        res.status(200).json(contatoCliente)
    } catch (error) {
        consolelog(error)
        res.status(500).json({ message: 'Houve um erro no servidor!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { telefone, email } = req.body

    let isPrimary = true

    try {
        let contato = await ContatoCliente.findOne({ _id: id })

        if (!contato) {
            contato = await ContatoCliente.findOne({ id_cliente: id })
            if (!contato) {
                res.status(422).json({ message: 'Contato não encontrado!' })
                return
            }
            else isPrimary = false
        }


        const auxTelefone = removeEmptyValue(telefone)

        const atualizado_em = new Date()

        const contatoCliente = { telefone: auxTelefone, email, atualizado_em }

        let updateContatoCliente
        if (isPrimary) updateContatoCliente = await ContatoCliente.updateOne({ _id: id }, contatoCliente)
        else updateContatoCliente = await ContatoCliente.updateOne({ id_cliente: id }, contatoCliente)

        res.status(200).json({
            message: 'Contato do cliente atualizado com sucesso!',
            result: {
                ...updateContatoCliente,
                _id: contato._id
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const contatoCliente = await ContatoCliente.findOne({ _id: id })

    if (!contatoCliente) {
        res.status(422).json({ message: 'Contato do cliente não encontrado!' })
        return
    }

    try {
        await ContatoCliente.deleteOne({ _id: id })

        res.status(200).json({ message: 'Contato do cliente removido com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}