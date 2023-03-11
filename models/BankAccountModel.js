const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
    banco: { type: String, requiredd: true },
    numero: { type: String, required: true },
    iban: { type: String, required: true },
    id_colaborador: { type: String, required: true }
});

const BankAccount = mongoose.model('BankAccount', BankAccountSchema);

module.exports = BankAccount;