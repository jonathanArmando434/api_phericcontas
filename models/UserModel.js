const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  access: {type: Number, required: true},
  id_colaborador: {type: String, require: true}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;