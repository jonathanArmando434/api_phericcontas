const Contrato = require("../models/ContratoModel");
const Colaborador = require("../models/ColaboradorModel");
const Cliente = require("../models/ClienteModel");

const verifyIdAssociado = async (id_associado) => {
    let result = await Colaborador.findById(id_associado)

    if (result) return true

    else result = await Cliente.findById(id_associado)

    if (result) return true

    return false
}

const verifyIContrato = async (id_associado) => {
    const result = await Contrato.findOne({ id_associado: id_associado })
    if (result) return true
    return false
}

exports.create = async (req, res) => {
    const { data_inicio, data_fim, id_associado } = req.body

    if (!data_inicio) {
        res.status(422).json({ message: 'A data de início do contrato é obrigatório!' })
        return
    }
    if (!data_fim) {
        res.status(422).json({ message: 'A data de fim do contrato é obrigatório!' })
        return
    }
    if (!id_associado) {
        res.status(422).json({ message: 'O ID do associado é obrigatório!' })
        return
    }
    if (!(await verifyIdAssociado(id_associado))) {
        res.status(406).json({ message: 'O ID do associado especificado não existe!' })
        return
    }

    const alreadyExist = await verifyIContrato(id_associado)
    if (alreadyExist) {
        res.status(406).json({ message: 'Este ID já está associado a um contrato!' })
        return
    }
    try {
        const startDate = new Date(data_inicio)
        const endDate = new Date(data_fim)

        const contrato = { data_inicio: startDate, data_fim: endDate, id_associado }

        await Contrato.create(contrato)

        res.status(201).json({ message: 'Contrato inserido no sistema com sucesso!' })
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
        return
    }
}

exports.findAll = async (req, res) => {
    try {
        const contrato = await Contrato.find()

        res.status(200).json(contrato)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        let contrato = await Contrato.findOne({ _id: id })

        if (!contrato) {
            contrato = await Contrato.findOne({ id_associado: id })

            if (!contrato) {
                res.status(422).json({ message: 'Contrato não encontrado!' })
                return
            }
        }

        res.status(200).json(contrato)
    } catch (error) {
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { data_inicio, data_fim, id_associado } = req.body

    try {
        const contrato = await Contrato.findOne({ _id: id })

        if (!contrato) {
            res.status(422).json({ message: 'Contrato não encontrado!' })
            return
        }

        const startDate = new Date(data_inicio)
        const endDate = new Date(data_fim)

        const newContrato = { data_inicio: startDate, data_fim: endDate, id_associado, criado_em: contrato.criado_em }

        res.status(200).json(nwContrato)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const contrato = await Contrato.findOne({ _id: id })

    if (!contrato) {
        res.status(422).json({ message: 'Contrato não encontrado!' })
        return
    }

    try {
        await Contrato.deleteOne({ _id: id })

        res.status(200).json({ message: 'Contrato removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}