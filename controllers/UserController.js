const User = require("../models/UserModel");
const Colaborador = require("../models/ColaboradorModel");
const bcrypt = require('bcrypt');
const validator = require("email-validator");
const passwordValidator = require('password-validator');

const userExist = async (email, id_colaborador, res) => {
    let result = await User.findOne({ email: email })
    if (result) {
        res.status(406).json({ message: 'Este e-mail já foi usado!' })
        return true
    }
    else {
        result = await User.findOne({ id_colaborador: id_colaborador })
        if (result) {
            res.status(406).json({ message: 'Já foi cadastrado um usuário com este ID!' })
            return true
        }
    }
    return false
}

const verifyPassword = (password) => {
    // Create a schema
    const schema = new passwordValidator();

    // Add properties to it
    schema
        .is().min(12)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits(1)                                // Must have at least 2 digits
        .has().not().spaces()                           // Should not have spaces

    // Validate against a password string
    return schema.validate(password)
}

const verifyIdColaborador = async (id_colaborador) => {
    const result = await Colaborador.findById(id_colaborador)

    if (result) return true
    return false
}

const verifyDatas = async (email, password, id_colaborador, req, res) => {
    if (!validator.validate(email)) {
        res.status(406).json({ message: 'E-mail inválido' })
        return false
    }

    if (!verifyPassword(password)) {
        res.status(406).json({
            message: 'A Palavra passe deve ter entre 12 à 100 caracteres, deve ter letras maiúsculas e minúsculas, deve conter pelomenos um dígito e não deve ter spaços em branco!'
        })
        return false
    }
    if (!(await verifyIdColaborador(id_colaborador))) {
        res.status(406).json({ message: 'Não existe nenhum usuário com o ID especificado!' })
        return false
    }
    return true
}

const generateAccess = async (id_colaborador) => {
    const result = await Colaborador.findById(id_colaborador)
    return (result.cargo === 'PCA' || result.cargo === 'Gerente') ? 'total' : 'restrito'
}

exports.create = async (req, res) => {
    const { email, password, confirmPassword, id_colaborador } = req.body

    if (!email) {
        res.status(422).json({ message: 'O email é obrigatório!' })
        return
    }
    if (!password) {
        res.status(422).json({ message: 'A palavra-passe é obrigatório!' })
        return
    }
    if (!confirmPassword) {
        res.status(422).json({ message: 'As palavras-passe precisam ser iguais' })
        return
    }
    if (!id_colaborador) {
        res.status(422).json({ message: 'O ID do calabotrador é obrigatório!' })
        return
    }


    const alreadyExist = await userExist(email, id_colaborador, res)
    if (alreadyExist) return

    const isOk = await verifyDatas(email, password, id_colaborador, res)
    if (!isOk) return

    try {
        const access = await generateAccess(id_colaborador)

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = { email, password: passwordHash, access, id_colaborador }

        const userCreated = await User.create(user)

        res.status(201).json({
            userIds: {
                userId: userCreated._id,
                userIdColaborador: userCreated.id_colaborador
            },
            message: 'Usuário inserido no sistema com sucesso!'
        })
        return
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Houve um erro no servidor, tenta novamente!' })
        return
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
        let user = await User.findOne({ id_colaborador: id })

        if (!user) {
            user = await User.findOne({ id: id })
            if (!user) {
                res.status(422).json({ message: 'Usuário não encontrado!' })
                return
            }
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { email, password, id_colaborador } = req.body

    const officialAccess = Number(access)

    try {
        const user = await User.findOne({ _id: id })

        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }

        const newUser = { email, password, id_colaborador, criado_em: user.criado_em }

        User.updateOne({ _id: id }, newUser)

        res.status(200).json(newUser)
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
