const User = require("../models/UserModel");
const ContatoColaborador = require("../models/ContatoColaboradorModel");
const TokenToResetPassword = require("../models/TokenToResetPasswordModel");
const sendEmail = require("../config/nodeMailerResetPassword");
const generateCredential = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~";
  let credencial = "";

  for (let i = 0; i < 12; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    credencial += caracteres[indiceAleatorio];
  }

  return credencial;
};

exports.recorvePassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(422).json({ message: "Preencha o campo de E-mail!" });
    return;
  }

  try {
    const contatoColaborador = await ContatoColaborador.findOne({
      email: email,
    });

    if (!contatoColaborador) {
      res.status(406).json({
        message: "Não há nenhum usuário com este e-mail!",
      });
      return;
    }

    const user = await User.findOne({
      id_colaborador: contatoColaborador.id_colaborador,
    });

    if (!user) {
      res.status(406).json({
        message: "Não há nenhum usuário com este e-mail!",
      });
      return;
    }

    const token = generateCredential();

    const tokenToResetPassword = await TokenToResetPassword.create({
      id_usuario: user._id,
      token,
      email
    });

    const linkReset = `${process.env.URL_FRONT}/admin/palavra-passe/redefinir/${token}`;

    const response = await sendEmail(email, linkReset)

    if (response)
      res.status(200).json({
        message: "Verifica o seu email!",
      });
    else
      res
        .status(500)
        .json({ message: "Houve um erro no servidor, tenta novamente!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tenta novamente!" });
  }
};
