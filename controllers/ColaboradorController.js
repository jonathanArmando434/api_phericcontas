const fs = require('fs')
const Colaborador = require("../models/ColaboradorModel");

const colaboradorExist = async (num_bi) => {
    let result = await Colaborador.findOne({ num_bi: num_bi })
    if (result) {
        return true
    }
    return false
}

const removeSamevalue = (array) => {
    array.forEach((value, index) => {
        for (let i = index + 1; i < array.length; i++)
            if (array[i] === value) array[i] = ''
    })

    return array
}

const removeValueEmpty = (array) => {
    array = removeSamevalue(array)
    const aux = array.filter(value => value !== '')
    return aux
}

exports.create = async (req, res) => {
    const { nome, num_bi, data_nasc, genero, num_iban, cargo, idioma } = req.body

    if (!nome) {
        res.status(422).json({ message: 'O nome é obrigatório1' })
        return
    }
    if (!num_bi) {
        res.status(422).json({ message: 'O numero de BI é obrigatório!' })
        return
    }
    if (!data_nasc) {
        res.status(422).json({ message: 'A data de nascimento é obrigatória!' })
        return
    }
    if (!genero) {
        res.status(422).json({ message: 'O género é obrigatório1' })
        return
    }
    if (!cargo) {
        res.status(422).json({ message: 'O cargo é obrigatório1' })
        return
    }
    if (!num_iban) {
        res.status(422).json({ message: 'O numero de IBAN é obrigatório!' })
        return
    }

    const exist = await colaboradorExist(num_bi)
    if (exist) {
        res.status(406).json({ message: 'Este número de BI já foi usado!' })
        return
    }

    try {
        const file = req.file || '';

        const birthDate = new Date(data_nasc)

        const colaborador = { nome, num_bi, num_iban, data_nasc: birthDate, genero, foto_url: file.path, cargo, idioma }

        const result = await Colaborador.create(colaborador)
        res.status(201).json({ message: 'Colaborador inserido no sistema com sucesso!', result })
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
        return
    }
}

exports.findAll = async (req, res) => {
    try {
        const colaborador = await Colaborador.find()

        res.status(200).json(colaborador)
    } catch (error) {
        console.log(error)
        res.satus(500).json({ message: 'Não é possível apresentar os colaboadores!' })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const colaborador = await Colaborador.findOne({ _id: id })

        if (!colaborador) {
            res.json({ message: 'Colaborador não encontrado!' })
            return
        }

        res.status(200).json(colaborador)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor!' })
    }
}

exports.findOneByBIorName = async (req, res) => {
    const id = req.params.query

    try {
        let colaborador = await Colaborador.find({ num_bi: query})
        if (!colaborador) {
            colaborador = await Colaborador.find({ nome: query})
            if (!colaborador) {
                res.json({ message: 'Colaborador não encontrado!' })
                return
            }
        }

        res.status(200).json(colaborador)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { nome, num_iban, cargo, idioma } = req.body

    try {
        const colaborador = await Colaborador.findOne({ _id: id })

        if (!colaborador) {
            res.json({ message: 'Colaborador não encontrado!' })
            return
        }

        const atualizado_em = new Date()

        const newColaborador = { nome, num_iban, cargo, idioma, atualizado_em }

        const updateColaborador = await Colaborador.updateOne({ _id: id }, newColaborador)

        res.status(200).json({message: 'Colaborador atualizado com sucesso!', result: {...updateColaborador, _id: colaborador._id}})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const colaborador = await Colaborador.findOne({ _id: id })

    if (!colaborador) {
        res.json({ message: 'Colaborador não encontrado!' })
        return
    }

    if (colaborador.foto_url) fs.unlinkSync(colaborador.foto_url);

    try {
        await Colaborador.deleteOne({ _id: id })

        res.status(200).json({ message: 'Colaborador removido com sucesso!' })
    } catch (error) {
        res.satus(500).json({ erro: error })
    }
}