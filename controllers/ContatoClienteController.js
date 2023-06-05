const validator = require("email-validator");
const ContatoCliente = require("../models/ContatoClienteModel");
const Cliente = require('../models/ClienteModel')

const contatoExist = async (id_cliente) => {
    const result = await ContatoCliente.findOne({ id_cliente: id_cliente })
    if (result) return true
    return false
}

const alreadyHasThisEmail = async (email) => {
    const result = await ContatoCliente.findOne({ email: email })
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
    const { telefone, email, id_cliente, localizacao } = req.body

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
    
    const already = await alreadyHasThisEmail(email)
    if (already) {
        res.status(406).json({ message: 'Já foi cadastrado um contato com este E-mail!' })
        return
    }

    const exist = await contatoExist(id_cliente)
    if (exist) {
        res.status(406).json({ message: 'Já foi cadastrado um contato com este ID!' })
        return
    }

    const contatoCliente = { telefone: auxTelefone, email, id_cliente, localizacao }

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
        const contatoCliente = await ContatoCliente.find().sort({criado_em: -1})

        res.status(200).json(contatoCliente)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        let contatoCliente = (await ContatoCliente.findOne({ _id: id })) || {}

        if (Object.keys(contatoCliente).length === 0) {
            contatoCliente = (await ContatoCliente.findOne({ id_cliente: id })) || {}
            if (Object.keys(contatoCliente).length === 0) {
                res.status(422).json({ message: 'Contato do cliente não encontrado!' })
                return
            }
        }

        res.status(200).json(contatoCliente)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { telefone, email, localizacao } = req.body

    let isPrimary = true

    try {
        let contato = await ContatoCliente.findOne({ _id: id }) || {}

        if (Object.keys(contato).length === 0) {
            contato = await ContatoCliente.findOne({ id_cliente: id }) || {}
            if (Object.keys(contato).length === 0) {
                res.status(422).json({ message: 'Contato não encontrado!' })
                return
            }
            else isPrimary = false
        }


        const auxTelefone = removeEmptyValue(telefone)

        const atualizado_em = new Date()

        const contatoCliente = { telefone: auxTelefone, email, atualizado_em }

        const oldLocal = contato.localizacao

        for(let index = 0; index < oldLocal.length; index++){
            const local = oldLocal[index]
            const newLocal = localizacao[index]
            local.endereco = newLocal.endereco
            local.isPrincipal = newLocal.isPrincipal
            await ContatoCliente.updateOne({ 'localizacao._id': local._id }, { $set: { 'localizacao.$': local } });
        }

        for (let i = oldLocal.length; i < localizacao.length; i++) {
            contato.localizacao.push(localizacao[i])
            await contato.save()
        }

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

exports.updateLocation = async (req, res) => {
    const { id, localID } = req.params

    const contatoCliente = await ContatoCliente.findOne({ _id: id })

    if (Object.keys(contatoCliente).length === 0) {
        res.status(422).json({ message: 'Contato do cliente não encontrado!' })
        return
    }

    const local = contatoCliente.localizacao.find(loc => loc._id == localID);

    if (!local) {
        res.status(422).json({ message: 'Localização do cliente não encontrado!' })
        return
    }

    try {
        for (const loc of contatoCliente.localizacao) {
            if (loc._id == localID) loc.isPrincipal = true
            else loc.isPrincipal = false
            await contatoCliente.save()
        }

        res.status(200).json({ message: 'Localização do cliente atualizado com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const contatoCliente = await ContatoCliente.findOne({ _id: id })

    if (Object.keys(contatoCliente).length === 0) {
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

exports.removeLocation = async (req, res) => {
    const { id, localID } = req.params

    const contatoCliente = await ContatoCliente.findOne({ _id: id })

    if (Object.keys(contatoCliente).length === 0) {
        res.status(422).json({ message: 'Contato do cliente não encontrado!' })
        return
    }

    const local = contatoCliente.localizacao.find(loc => loc._id == localID);

    if (!local) {
        res.status(422).json({ message: 'Localização do cliente não encontrado!' })
        return
    }

    try {
        await ContatoCliente.updateOne({ _id: id }, { $pull: { localizacao: { _id: localID } } })

        res.status(200).json({ message: 'Localização do cliente removido com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}