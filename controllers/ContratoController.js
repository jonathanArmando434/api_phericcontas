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

        const result = await Contrato.create(contrato)

        res.status(201).json({ message: 'Contrato inserido no sistema com sucesso!', result })
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
        return
    }
}

exports.findAll = async (req, res) => {
    try {
        const contrato = await Contrato.find().sort({criado_em: -1})

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
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { data_inicio, data_fim, status } = req.body

    let isPrimary = true

    try {
        let contrato = await Contrato.findOne({ _id: id })

        if (!contrato) {
            contrato = await Contrato.findOne({ id_associado: id })
            if (!contrato) {
                res.status(422).json({ message: 'Contrato não encontrado!' })
                return
            }
            else isPrimary = false
        }

        const startDate = new Date(data_inicio)
        const endDate = new Date(data_fim)
        const atualizado_em = new Date()

        const newContrato = { data_inicio: startDate, data_fim: endDate, status, atualizado_em }
        console.log(newContrato)

        let updateContrato
        if(isPrimary) updateContrato = await Contrato.updateOne({ _id: id }, newContrato)
        else updateContrato = await Contrato.updateOne({ id_associado: id }, newContrato)

        res.status(200).json({message: 'Contrato atualizado com sucesso!', result: {...updateContrato, _id: contrato._id}})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const contrato = await Contrato.findOne({ 
        $or: [
            {_id: id},
            {id_associado: id}
        ]
     })

    if (!contrato) {
        res.status(422).json({ message: 'Contrato não encontrado!' })
        return
    }

    try {
        await Contrato.deleteOne({ 
        $or: [
            {_id: id},
            {id_associado: id}
        ]
     })

        res.status(200).json({ message: 'Contrato removido com sucesso!' })
        console.log('ok')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.removeAll = async (req, res) => {
    try {
        await Contrato.deleteMany({ id_associado: { $ne: "647dc61efffa5aebf951018b" } });
        res.status(500).json({ message: 'Contratos removidos com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}