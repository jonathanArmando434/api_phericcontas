const User = require("../models/UserModel");

exports.create = async (req, res) => {
    const { email, password, access, id_colaborador } = req.body

    const officialAccess = Number(access)

    const user = { email, password, access: officialAccess, id_colaborador }

    try {
       await User.create(user)

        res.status(201).json({ message: 'Usuário inserido no sistema com sucesso!' })
    } catch (error) {
       res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const user = await User.find()

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findOne({ _id: id })

        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { email, password, access, id_colaborador } = req.body

    const officialAccess = Number(access)

    const user = { email, password, access: officialAccess, id_colaborador }

    try {
        const updateUser = await User.updateOne({ _id: id }, user)

        if (updateUser.matchedCount === 0) {       
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const user = await User.findOne({ _id: id })

    if (!user) {
        res.status(422).json({ message: 'Usuário não encontrado!' })
        return
    }

    try {
        await User.deleteOne({ _id: id })

        res.status(200).json({ message: 'Usuário removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}