const Contrato = require("../models/ContratoModel");

exports.create = async (req, res) => {
    const { data_inicio, data_fim, status, id_associado } = req.body

    const startDate = new Date(data_inicio)
    const endDate = new Date(data_fim)

    const oficialStatus = (status == 1) ? true : false

    const contrato = { data_inicio: startDate, data_fim: endDate, status: oficialStatus, id_associado }

    try {
        await Contrato.create(contrato)

        res.status(201).json({ message: 'Contrato inserida no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
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
        const contrato = await Contrato.findOne({ _id: id })

        if (!contrato) {
            res.status(422).json({ message: 'Contrato não encontrado!' })
            return
        }

        res.status(200).json(contrato)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { data_inicio, data_fim, status, id_associado } = req.body

    const startDate = new Date(data_inicio)
    const endDate = new Date(data_fim)

    const oficialStatus = (status == 1) ? true : false

    const contrato = { data_inicio: startDate, data_fim: endDate, status: oficialStatus, id_associado }

    try {
        const updateContrato = await Contrato.updateOne({ _id: id }, contrato)

        if (updateContrato.matchedCount === 0) {
            res.status(422).json({ message: 'Contrato não encontrado!' })
            return
        }

        res.status(200).json(contrato)
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