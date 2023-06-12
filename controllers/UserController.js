const User = require("../models/UserModel");
const Colaborador = require("../models/ColaboradorModel");
const TokenToResetPassword = require("../models/TokenToResetPasswordModel");
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");

const gerarCredencialAleatoria = () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const credencial = '';
  
  for (const i = 0; i < 10; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    credencial += caracteres[indiceAleatorio];
  }
  
  return credencial;
}

const userExist = async (id_colaborador, res) => {
  const result = await User.findOne({ id_colaborador: id_colaborador });
  if (result) {
    res
      .status(406)
      .json({ message: "Já foi cadastrado um usuário com este ID!" });
    return true;
  }
  return false;
};

const verifyPassword = (password) => {
  // Create a schema
  const schema = new passwordValidator();

  // Add properties to it
  schema
    .is()
    .min(12) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(1) // Must have at least 2 digits
    .has()
    .not()
    .spaces(); // Should not have spaces

  // Validate against a password string
  return schema.validate(password);
};

const verifyIdColaborador = async (id_colaborador) => {
  const result = await Colaborador.findById(id_colaborador);

  if (result) return true;
  return false;
};

const verifyDatas = async (password, id_colaborador, res) => {
  if (!verifyPassword(password)) {
    res.status(406).json({
      message:
        "A Palavra passe deve ter entre 12 à 100 caracteres, deve ter letras maiúsculas e minúsculas, deve conter pelomenos um dígito e não deve ter spaços em branco!",
    });
    return false;
  }
  if (!(await verifyIdColaborador(id_colaborador))) {
    res
      .status(406)
      .json({ message: "Não existe nenhum usuário com o ID especificado!" });
    return false;
  }
  return true;
};

const generateAccess = async (id_colaborador) => {
  const result = await Colaborador.findById(id_colaborador);
  return result.cargo === "PCA" || result.cargo === "Gerente"
    ? "total"
    : "restrito";
};

exports.create = async (req, res) => {
  const { password, id_colaborador } = req.body;

  if (!id_colaborador) {
    res.status(422).json({ message: "O ID do calabotrador é obrigatório!" });
    return;
  }

  if (!password) {
    res.status(422).json({ message: "A palavra-passe é obrigatório!" });
    return;
  }

  const alreadyExist = await userExist(id_colaborador, res);
  if (alreadyExist) return;

  const isOk = await verifyDatas(password, id_colaborador, res);
  if (!isOk) return;

  try {
    const access = await generateAccess(id_colaborador);

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = { password: passwordHash, access, id_colaborador };

    const userCreated = await User.create(user);

    res.status(201).json({
      userIds: {
        userId: userCreated._id,
        userIdColaborador: userCreated.id_colaborador,
      },
      message: "Usuário inserido no sistema com sucesso!",
    });
    return;
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tenta novamente!" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const user = await User.find().sort({ criado_em: -1 });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tenta novamente!" });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    let user = await User.findOne({ id_colaborador: id });

    if (!user) {
      user = await User.findOne({ _id: id });
      if (!user) {
        res.status(422).json({ message: "Usuário não encontrado!" });
        return;
      }
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tenta novamente!" });
  }
};

exports.update = async (req, res) => {
  const { token } = req.params;

  const { password } = req.body;

  try {
    const tokenDoc = await TokenToResetPassword.findOne({ token: token });

    if (!tokenDoc) {
      res.status(422).json({ message: "Permissão negada para redefinir senha!" });
      return;
    }

    const id = tokenDoc.id_usuario
    const email = tokenDoc.email

    const user = await User.findOne({ _id: id });

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    const id_colaborador = user.id_colaborador

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = { password: passwordHash, atualizado_em: new Date() };

    await User.updateOne({ _id: id }, newUser);

    await TokenToResetPassword.deleteOne({token: token})

    res.status(200).json({ message: "Palavra-passe redefinida com sucesso!", email });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tenta novamente!" });
  }
};

exports.remove = async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({ _id: id });

  if (!user) {
    res.status(422).json({ message: "Usuário não encontrado!" });
    return;
  }

  try {
    await User.deleteOne({ _id: id });

    res.status(200).json({ message: "Usuário removido com sucesso!", id_colaborador });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tenta novamente!" });
  }
};

exports.removeAll = async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(500).json({ message: "Tarefas removidas com sucesso!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};
