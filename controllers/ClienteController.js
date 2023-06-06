const fs = require("fs");
const path = require("path");
const Cliente = require("../models/ClienteModel");
const Contrato = require("../models/ContratoModel");

const ExistClientByNif = async (nif) => {
  let result = await Cliente.findOne({ nif: nif });
  if (result) {
    return true;
  }
  return false;
};

const ExistClientByNome = async (nome) => {
  let result = await Cliente.findOne({ nome: nome });
  if (result) {
    return true;
  }
  return false;
};

const contractIsOkay = async (id) => {
  const contrato = await Contrato.findOne({ id_associado: id });

  if (!contrato || !contrato.data_fim) {
    return false;
  }

  const current = new Date().getTime();
  const data_fim = contrato.data_fim.getTime();

  if (!contrato.status || data_fim <= current) {
    return false;
  }

  return true;
};

exports.create = async (req, res) => {
  const { nif, nome, area_negocio } = req.body;

  const file = req.file;

  if (!nif) {
    res.status(422).json({ message: "O NIF é obrigatório!" });
    return;
  }

  if (!nome) {
    res.status(422).json({ message: "O nome é obrigatório!" });
    return;
  }

  if (!area_negocio) {
    res.status(422).json({ message: "A área de negócio é obrigatório1" });
    return;
  }

  if (await ExistClientByNif(nif)) {
    res.status(406).json({ message: "Este NIF já foi usado!" });
    return;
  }

  if (await ExistClientByNome(nome)) {
    res.status(406).json({ message: "Este nome já foi usado!" });
    return;
  }

  const cliente = {
    nif,
    nome,
    area_negocio,
    foto_url: file ? file.path.split("/").pop() : "",
  };

  try {
    const result = await Cliente.create(cliente);

    res
      .status(201)
      .json({ message: "Cliente inserido no sistema com sucesso!", result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const cliente = await Cliente.find().sort({ criado_em: -1 });

    res.status(200).json(cliente);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const cliente = await Cliente.findOne({ _id: id });

    if (!cliente) {
      res.status(422).json({ message: "Cliente não encontrado!" });
      return;
    }

    res.status(200).json(cliente);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};

exports.search = async (req, res) => {
  const query = req.params.query;

  try {
    let cliente = await Cliente.find({ nif: query }).sort({ criado_em: -1 });

    if (Object.keys(cliente).length === 0) {
      cliente = await Cliente.find({
        $or: [
          { nome: { $regex: query, $options: "i" } },
          { area_negocio: { $regex: query, $options: "i" } },
        ],
      }).sort({ criado_em: -1 });
      if (Object.keys(cliente) === 0) {
        res.satus(404).json({ message: "Cliente não encontrado!" });
        return;
      }
    }

    res.status(200).json(cliente);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Houve um erro no servidor!" });
  }
};

exports.clientsActives = async (req, res, next) => {
  try {
    const cliente = await Cliente.find();

    const clienteAtivo = cliente.filter((cli) => contractIsOkay(cli._id));

    const total = clienteAtivo.length;

    let clientsLogo = clienteAtivo.map((cli) => cli.foto_url || "");
    clientsLogo = clientsLogo.filter((cli) => cli.foto_url);

    req.clients = {
      total,
      clientsLogo,
    };

    next();
  } catch (error) {
    const err = req.error || [];
    err.push("Erro ao determinar o número de clientes ativos");
    req.error = err;
    console.log(error);
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  const { nome, area_negocio } = req.body;

  try {
    const cliente = await Cliente.findOne({ _id: id });

    if (!cliente) {
      res.status(422).json({ message: "Cliente não encontrado!" });
      return;
    }

    const newCliente = { nome, area_negocio, atualizado_em: new Date() };

    const updateCliente = await Cliente.updateOne({ _id: id }, newCliente);

    res.status(200).json({
      message: "Cliente atualizado com sucesso!",
      result: { ...updateCliente, _id: cliente._id },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};

exports.updatePhoto = async (req, res) => {
  const id = req.params.id;

  const file = req.file;

  try {
    const cliente = await Cliente.findOne({ _id: id });

    if (!cliente) {
      res.status(404).json({ message: "Cliente não encontrado!" });
      return;
    }

    if (cliente.foto_url) {
      const oldFotoUrl = path.resolve(
        __dirname.split("/").shift(),
        "uploads",
        "img",
        "cliente",
        cliente.foto_url
      );
      fs.unlinkSync(oldFotoUrl);
    }

    const atualizado_em = new Date();
    const foto_url = file ? file.path.split("/").pop() : "";

    const newClient = { foto_url };

    await Cliente.updateOne({ _id: id }, newClient);

    cliente.foto_url = foto_url;
    cliente.atualizado_em = atualizado_em;

    res.status(200).json({
      message: "Logotipo do cliente foi atualizado com sucesso!",
      result: { ...cliente },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};

exports.remove = async (req, res) => {
  const id = req.params.id;

  const cliente = await Cliente.findOne({ _id: id });

  if (!cliente) {
    res.status(422).json({ message: "Cliente não encontrado!" });
    return;
  }

  console.log(cliente.foto_url);

  try {
    if (cliente.foto_url) fs.unlinkSync(cliente.foto_url);

    await Cliente.deleteOne({ _id: id });

    res.status(200).json({ message: "Cliente removido com sucesso!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};

exports.removeAll = async (req, res) => {
  try {
      await Cliente.deleteMany({})
      res.status(500).json({ message: 'Clientes removidos com sucesso!' })
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
  }
}
