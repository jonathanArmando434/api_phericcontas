const BankAccount = require("../models/BankAccountModel");

exports.create = async (req, res) => {
    const { banco, numero, iban, id_colaborador } = req.body
    
    const bankAccount = { banco, numero, iban, id_colaborador }

    try {
        await BankAccount.create(bankAccount)

        res.status(201).json({ message: 'Conta bancária inserida no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findAll = async (req, res) => {
    try {
        const bankAccount = await BankAccount.find()

        res.status(200).json(bankAccount)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const bankAccount = await BankAccount.findOne({ _id: id })

        if (!bankAccount) {
            res.status(422).json({ message: 'Conta bancária não encontrado!' })
            return
        }

        res.status(200).json(bankAccount)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { banco, numero, iban, id_colaborador } = req.body
    
    const bankAccount = { banco, numero, iban, id_colaborador }

    try {
        const updateBankAccount = await BankAccount.updateOne({ _id: id }, bankAccount)

        if (updateBankAccount.matchedCount === 0) {       
            res.status(422).json({ message: 'Conta bancária não encontrado!' })
            return
        }

        res.status(200).json(bankAccount)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const bankAccount = await BankAccount.findOne({ _id: id })

    if (!bankAccount) {
        res.status(422).json({ message: 'Conta bancária não encontrado!' })
        return
    }

    try {
        await bankAccount.deleteOne({ _id: id })

        res.status(200).json({ message: 'Conta bancária removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}