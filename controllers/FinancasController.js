const Financa = require("../models/FinancaModel");

const getOneYearAgo = async (year) => {
  const startYear = new Date(`${year}-01-01`);

  const endYear = new Date(`${year}-12-31`);
  endYear.setDate(endYear.getDate() + 1);

  const financa = await Financa.find({
    criado_em: {
      $gte: startYear,
      $lt: endYear,
    },
  });

  const entrada = getEntrada(financa);
  const saida = getSaida(financa);

  return {
    entrada,
    saida,
    total: entrada - saida,
  };
};

const getPercentAboutOneYearAgo = (present, oneYearAgo) => {
  return ((present - oneYearAgo) / oneYearAgo) * 100;
};

const getEntrada = (fin) => {
  let sum = 0;
  if (Array.isArray(fin)) {
    fin.forEach((fin) => {
      if (fin.tipo === "Entrada") sum += fin.valor;
    });
  }
  return sum;
};

const getSaida = (fin) => {
  let sum = 0;
  if (Array.isArray(fin)) {
    fin.forEach((fin) => {
      if (fin.tipo === "Saída") sum += fin.valor;
    });
  }
  return sum;
};

exports.create = async (req, res) => {
  const { desc, valor, tipo } = req.body;

  const dado = { desc, valor, tipo };

  try {
    await Financa.create(dado);

    res
      .status(201)
      .json({ message: "Dado de Finança inserido no sistema com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
    console.log(error);
  }
};

exports.findAll = async (req, res) => {
  try {
    const dado = await Financa.find().sort({ criado_em: -1 });

    res.status(200).json(dado);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
    console.log(error);
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const dado = await Financa.findOne({ _id: id });

    if (!dado) {
      res.status(422).json({ message: "Dados de finança não encontrado!" });
      return;
    }

    res.status(200).json(dado);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
    console.log(error);
  }
};

exports.annualReport = async (req, res) => {
  const year = req.params.year;

  const startYear = new Date(`${year}-01-01`);
  const endYear = new Date(`${year + 1}-01-01`);

  try {
    const oneYearAgo = getOneYearAgo(year - 1);

    const financa = await Financa.find({
      criado_em: {
        $gte: startYear,
        $lt: endYear,
      },
    });

    const entrada = getEntrada(financa);
    const percentEntrada =
      getPercentAboutOneYearAgo(entrada, oneYearAgo.entrada) || 0;

    const saida = getSaida(financa);
    const percentSaida =
      getPercentAboutOneYearAgo(saida, oneYearAgo.saida) || 0;

    const total = entrada - saida;
    const percentTotal =
      getPercentAboutOneYearAgo(total, oneYearAgo.total) || 0;

    res.status(200).json({
      entrada: { qnt: entrada, percent: percentEntrada },
      saida: { qnt: saida, percent: percentSaida },
      total: { qnt: total, percent: percentTotal },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  const { desc, valor, tipo } = req.body;

  try {
    const dado = await Financa.findOne({ _id: id });

    if (!dado) {
      res.status(422).json({ message: "Dados de finança não encontrado!" });
      return;
    }

    const newDado = { desc, valor, tipo, atualizado_em: new Date() };

    await Financa.updateOne({ _id: id }, newDado);

    res
      .status(200)
      .json({ message: "Dados de finança atualizados com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
    console.log(error);
  }
};

exports.remove = async (req, res) => {
  const id = req.params.id;

  const dado = await Financa.findOne({ _id: id });

  if (!dado) {
    res.status(422).json({ message: "Dado de finança não encontrado!" });
    return;
  }

  try {
    await Financa.deleteOne({ _id: id });

    res.status(200).json({ message: "Dado de finança removido com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
    console.log(error);
  }
};

exports.removeAll = async (req, res) => {
  try {
    await Financa.deleteMany({});
    res.status(500).json({ message: "Dados de finanças removidos com sucesso!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};
