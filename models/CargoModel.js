const mongoose = require('mongoose');

const CargoSchema = new mongoose.Schema({
    tipo: {type: String, required: true},
    salario: {type: Number, required: true},
    id_colaborador: {type: String, required: true}
});

const Cargo = mongoose.model('Cargo', CargoSchema);

module.exports = Cargo;

