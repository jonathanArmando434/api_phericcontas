const User = require("../models/UserModel")
const ContatoColaborador = require('../models/ContatoColaboradorModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.loginMiddleware = async (req, res, next) => {
    const { email, password } = req.body

    if (!email){
        res.status(422).json({ message: 'Preencha o campo de E-mail!' })
        return
    }
    if (!password){
        res.status(422).json({ message: 'Preencha o campo da palavra-passe!' })
        return
    }

    try {
        const contatoColaborador = await ContatoColaborador.findOne({ email: email })

        if (!contatoColaborador){
            res.status(406).json({ message: 'Verifica o seu E-mail!' })
            return
        }

        const user = await User.findOne({ id_colaborador: contatoColaborador.id_colaborador })

        if (!user){
            res.status(406).json({ message: 'Verifica o seu E-mail!' })
            return
        }

        const isRight = await bcrypt.compare(password, user.password)

        if (!isRight){
            res.status(406).json({ message: 'Palavra-passe errada!' })
            return
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