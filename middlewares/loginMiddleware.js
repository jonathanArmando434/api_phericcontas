const User = require("../models/UserModel")
const ContatoColaborador = require('../models/ContatoColaboradorModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.loginMiddleware = async (req, res, next) => {
    const { email, password } = req.body

    if (!email){
        return res.status(422).json({ message: 'Preencha o campo de E-mail!' })
    }
    if (!password){
        return res.status(422).json({ message: 'Preencha o campo da palavra-passe!' })
    }

    try {
        const contatoColaborador = await ContatoColaborador.findOne({ email: email })

        if (!contatoColaborador){
            return res.status(406).json({ message: 'Verifica o seu E-mail!' })
        }

        const user = await User.findOne({ id_colaborador: contatoColaborador.id_colaborador })

        if (!user){
            return res.status(406).json({ message: 'Verifica o seu E-mail!' })
        }

        const isRight = await bcrypt.compare(password, user.password)

        if (!isRight){
            return res.status(406).json({ message: 'Palavra-passe errada!' })
        }

        const secret = process.env.SECRET
        const token = jwt.sign({ id: user._id }, secret)

        const userDatas = {
            id: user._id,
            email: user.email,
            access: user.access,
            id_colaborador: user.id_colaborador
        }

        res.status(200).json({ message: 'Autenticação realizada com sucesso!', user: userDatas, token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Houve um erro no servidor, tenta novamente!' })
    }
}