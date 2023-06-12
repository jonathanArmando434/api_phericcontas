const jwt = require("jsonwebtoken");
const enviarEmail = require('../config/nodeMailer');


exports.checkToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) res.status(401).json({ message: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (err) {
    res.status(400).json({ message: "Token inválido!" });
  }
};

exports.sendEmail = async (req, res) => {
  try {
    const { nome, email, assunto, mensagem } = req.body;

    const enviado = await enviarEmail(nome, email, assunto, mensagem);

    if(enviado) res.status(200).json({ message: "E-mail enviado com sucesso!" });
    else res.status(401).json({ message: "Erro ao enviar o e-mail!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Houve um erro no servidor, tente novamente.",
      });
  }
};

exports.publicInfo = async (req, res) => {
  const err = req.error
    if(Array.isArray(err) && err.length === 0) {
      res.status(500).json({ message: 'Houve um erro, recarregue a página por favor!' })
      return
    }

    res.status(200).json({
      members: req.members,
      clients: req.clients,
      projetsFinished: req.projetsFinished,
      clientsLogo: req.clientsLogo
    })
}
