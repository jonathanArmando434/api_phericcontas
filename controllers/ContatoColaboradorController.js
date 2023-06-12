const validator = require("email-validator");
const ContatoColaborador = require("../models/ContatoColaboradorModel");
const Colaborador = require("../models/ColaboradorModel");

const contatoExist = async (email, id_colaborador, res) => {
    let result = await ContatoColaborador.findOne({ email: email })
    if (result) {
        res.status(406).json({ message: 'Este e-mail já foi usado!' })
        return true
    }
    else {
        result = await ContatoColaborador.findOne({ id_colaborador: id_colaborador })
        if (result) {
            res.status(406).json({ message: 'Já foi cadastrado um usuário com este ID!' })
            return true
        }
    }
    return false
}

const verifyIdColaborador = async (id_colaborador) => {
    const result = await Colaborador.findById(id_colaborador)
    if (result) return true
    return false
}

const removeEmptyValue = (array) => {
    array = removeSamevalue(array)
    const aux = array.filter(value => value !== '')
    return aux
}


const removeSamevalue = (array) => {
    array.forEach((value, index) => {
        for (let i = index + 1; i < array.length; i++)
            if (array[i] === value) array[i] = ''
    })

    return array
}

exports.create = async (req, res) => {
    const { telefone, email, endereco, id_colaborador } = req.body

    const auxTelefone = removeEmptyValue(telefone)

    if (!auxTelefone || auxTelefone.length === 0) {
        res.status(422).json({ message: 'O telefone / whatsApp é obrigatório!' })
        return
    }
    if (!validator.validate(email)) {
        res.status(406).json({ message: 'E-mail inválido' })
        return false
    }
    if (!id_colaborador) {
        res.status(422).json({ message: 'O ID do calabotrador é obrigatório!' })
        return
    }

    const verified = await verifyIdColaborador(id_colaborador)
    if (!verified) {
        res.status(406).json({ message: 'O ID do colaborador especificado não existe!' })
        return
    }

    const exist = await contatoExist(email, id_colaborador, res)
    if (exist) return

    try {
        const contatoColaborador = { telefone: auxTelefone, email, endereco, id_colaborador }

        const result = await ContatoColaborador.create(contatoColaborador)

        res.status(201).json({ message: 'Contato do Colaborador inserido no sistema com sucesso!', result })
        return
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Houve um erro no servidor, temte novamente!' })
        return
    }
}

exports.findAll = async (req, res) => {
    try {
        const contatoColaborador = await ContatoColaborador.find().sort({criado_em: -1})

        res.status(200).json(contatoColaborador)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        let contatoColaborador = await ContatoColaborador.findOne({ _id: id })

        if (!contatoColaborador) {
            contatoColaborador = await ContatoColaborador.findOne({ id_colaborador: id })
            if (!contatoColaborador) {
                res.status(422).json({ message: 'Contato do colaborador não encontrado!' })
                return
            }
        }

        res.status(200).json(contatoColaborador)
    } catch (error) {
        consolelog(error)
        res.status(500).json({ message: 'Houve um erro no servidor!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { telefone, email, endereco } = req.body

    let isPrimary = true

    try {
        let contato = await ContatoColaborador.findOne({ _id: id })

        if (!contato) {
            contato = await ContatoColaborador.findOne({ id_colaborador: id })
            if (!contato) {
                res.status(422).json({ message: 'Contato não encontrado!' })
                return
            }
            else isPrimary = false
        }


        const auxTelefone = removeEmptyValue(telefone)

        const atualizado_em = new Date()

        const contatoColaborador = { telefone: auxTelefone, email, endereco, atualizado_em }

        let updateContatoColaborador
        if (isPrimary) updateContatoColaborador = await ContatoColaborador.updateOne({ _id: id }, contatoColaborador)
        else updateContatoColaborador = await ContatoColaborador.updateOne({ id_colaborador: id }, contatoColaborador)

        res.status(200).json({
            message: 'Contato do colaborador atualizado com sucesso!',
            result: {
                ...updateContatoColaborador,
                _id: contato._id
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const contatoColaborador = await ContatoColaborador.findOne({ 
        $or: [
            {_id: id},
            {id_colaborador: id}
        ]
     })

    if (!contatoColaborador) {
        res.status(422).json({ message: 'Contato do colaborador não encontrado!' })
        return
    }

    try {
        await ContatoColaborador.deleteOne({ 
        $or: [
            {_id: id},
            {id_colaborador: id}
        ]
     })

        res.status(200).json({ message: 'Contato do colaborador removido com sucesso!' })
        console.log('ok')

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.removeAll = async (req, res) => {
    try {
      await ContatoColaborador.deleteMany({ id_colaborador: { $ne: "647dc61efffa5aebf951018b" } });
      res.status(500).json({ message: "Contatos dos colaboradores removidos com sucesso!" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Houve um erro no servidor, tente novamente!" });
    }
  };