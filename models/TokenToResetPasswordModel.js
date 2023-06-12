const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir o schema para a recuperação de senha
const TokenToResetPasswordShema = new Schema({
  id_usuario: { type: String, required: true },
  token: { type: String, required: true },
  email: { type: String, required: true },
  criado_em: { type: Date, default: new Date(), expires: '1h' } // Definindo a expiração do token em 1 hora
});

// Criar o modelo baseado no schema
const TokenToResetPassword = mongoose.model('TokenToResetPassword', TokenToResetPasswordShema);

module.exports = TokenToResetPassword;
