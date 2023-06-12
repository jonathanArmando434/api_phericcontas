const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  password: { type: String, require: true },
  access: { type: String, required: true },
  id_colaborador: { type: String, require: true },
  criado_em: { type: Date, require: true, default: new Date() },
  atualizado_em: { type: Date, require: true, default: new Date() }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;