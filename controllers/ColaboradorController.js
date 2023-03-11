const fs = require('fs')
const Colaborador = require("../models/ColaboradorModel");

exports.create = async (req, res) => {
    const { bi, nome, data_nascimento, genero, idioma } = req.body

    const file = req.file;

    const idiomaArray = []
    idioma.push(idioma)

    const birthDate = new Date(data_nascimento)

    const colaborador = { bi, nome, data_nascimento: birthDate, genero, idioma: idiomaArray, picture: file.path }

    try {
        await Colaborador.create(colaborador)
        res.status(201).json({ message: 'Colaborador inserida no sistema com sucesso!' })
    } catch (error) {
        res.status.json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const colaborador = await Colaborador.find()

        res.status(200).json(colaborador)
    } catch (error) {
        res.satus(500).json({ erro: error })
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
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { bi, nome, data_nascimento, genero, idioma } = req.body

    try {
        const colaborador = await Colaborador.findOne({ _id: id })

        if (!colaborador) {
            res.json({ message: 'Colaborador não encontrado!' })
            return
        }

        colaborador.idioma.push(idioma)
        const idiomaArray = [...colaborador.idioma]

        const birthDate = new Date(data_nascimento)

        const newColaborador = { bi, nome, data_nascimento: birthDate, genero, idioma: idiomaArray, picture: colaborador.picture }

        const updateColaborador = await Colaborador.updateOne({ _id: id }, newColaborador)

        res.status(200).json(updateColaborador)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const colaborador = await Colaborador.findOne({ _id: id })

    if (!colaborador) {
        res.json({ message: 'Colaborador não encontrado!' })
        return
    }

    if (colaborador.picture) fs.unlinkSync(colaborador.picture);

    try {
        await Colaborador.deleteOne({ _id: id })

        res.status(200).json({ message: 'Colaborador removido com sucesso!' })
    } catch (error) {
        res.satus(500).json({ erro: error })
    }
}