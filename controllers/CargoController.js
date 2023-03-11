const Cargo = require("../models/CargoModel");

exports.create = async (req, res) => {
    const { tipo, salario, id_colaborador } = req.body

    const oficialSalario = Number(salario).toFixed(2)

    const cargo = { tipo, salario: oficialSalario, id_colaborador }

    try {
        await Cargo.create(cargo)

        res.status(201).json({ message: 'Cargo inserida no sistema com sucesso!' })
    } catch (error) {
       res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const cargo = await Cargo.find()

        res.status(200).json(cargo)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const cargo = await Cargo.findOne({ _id: id })

        if (!cargo) {
            res.status(422).json({ message: 'Cargo não encontrado!' })
            return
        }

        res.status(200).json(cargo)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { tipo, salario, id_colaborador } = req.body

    const oficialSalario = Number(salario).toFixed(2)

    const cargo = { tipo, salario: oficialSalario, id_colaborador }

    try {
        const updateCargo = await Cargo.updateOne({ _id: id }, cargo)

        if (updateCargo.matchedCount === 0) {
            res.status(422).json({ message: 'Cargo não encontrado!' })
            return
        }

        res.status(200).json(cargo)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const cargo = await Cargo.findOne({ _id: id })

    if (!cargo) {
        res.status(422).json({ message: 'Cargo não encontrado!' })
        return
    }

    try {
        await Cargo.deleteOne({ _id: id })

        res.status(200).json({ message: 'Cargo removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}