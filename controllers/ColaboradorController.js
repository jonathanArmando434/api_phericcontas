const fs = require("fs");
const path = require('path')
const Colaborador = require("../models/ColaboradorModel");
const User = require("../models/UserModel");
const Contrato = require("../models/ContratoModel");
const { async } = require("regenerator-runtime");

const getQntYearlyTotalColStart = (contrato, year) => {
  let count = 0;

  contrato.forEach((con) => {
    const dataFim = con.data_fim;
    const dataInicio = con.data_inicio;

    const firstDateOfYear = new Date(year, 1, 1);

    if (
      dataFim.getTime() > firstDateOfYear.getTime() &&
      firstDateOfYear.getTime() >= dataInicio.getTime()
    ) {
      count++;
    }
  });

  return count;
};

const getQntYearlyTotalColEnd = (contrato, year) => {
  let count = 0;

  contrato.forEach((con) => {
    const dataFim = con.data_fim;
    const dataInicio = con.data_inicio;

    const lastDayOfYear = new Date(year, 12, 31);
    lastDayOfYear.setHours(0, 0, 0, 0);
    lastDayOfYear.setDate(lastDayOfYear.getDate() + 1);
    lastDayOfYear.setMilliseconds(lastDayOfYear.getMilliseconds() - 1);

    if (
      dataFim.getTime() > lastDayOfYear.getTime() &&
      lastDayOfYear.getTime() >= dataInicio.getTime()
    ) {
      count++;
    }
  });

  return count;
};

const getQntYearlyAdmission = (contrato, year) => {
  let count = 0;
  let i = 0;

  contrato.forEach((con) => {
    const dataInicio = con.data_inicio;
    const inicioYear = dataInicio.getFullYear().toString();

    if (inicioYear === year) {
      count++;
    }
  });

  return count;
};

const getQntYearlyDemission = (contrato, year) => {
  let count = 0;

  contrato.forEach((con) => {
    const dataFim = con.data_fim;
    const fimYear = dataFim.getFullYear().toString();

    if (fimYear === year) {
      count++;
    }
  });

  return count;
};

const getQntMonthlyAdmission = (contrato, year) => {
  // Array de contagem de objetos por mês
  const contagemPorMes = Array(12).fill(0);

  // Percorre cada objeto e atualiza a contagem por mês
  contrato.forEach((con) => {
    const dataInicio = con.data_inicio;

    for (let mes = 0; mes < 12; mes++) {
      const primeiroDiaMes = new Date(year, mes, 1);
      const ultimoDiaMes = new Date(year, mes + 1, 0);
      ultimoDiaMes.setHours(0, 0, 0, 0);
      ultimoDiaMes.setDate(ultimoDiaMes.getDate() + 1);
      ultimoDiaMes.setMilliseconds(ultimoDiaMes.getMilliseconds() - 1);

      if (primeiroDiaMes <= dataInicio && dataInicio <= ultimoDiaMes) {
        contagemPorMes[mes]++;
      }
    }
  });

  return contagemPorMes;
};

const getQntMonthlyDemission = (contrato, year) => {
  // Array de contagem de objetos por mês
  const contagemPorMes = Array(12).fill(0);

  // Percorre cada objeto e atualiza a contagem por mês
  contrato.forEach((con) => {
    const dataFim = con.data_fim;

    for (let mes = 0; mes < 12; mes++) {
      const primeiroDiaMes = new Date(year, mes, 1);

      const ultimoDiaMes = new Date(year, mes + 1, 0);
      ultimoDiaMes.setHours(0, 0, 0, 0);
      ultimoDiaMes.setDate(ultimoDiaMes.getDate() + 1);
      ultimoDiaMes.setMilliseconds(ultimoDiaMes.getMilliseconds() - 1);

      if (primeiroDiaMes <= dataFim && dataFim <= ultimoDiaMes) {
        contagemPorMes[mes]++;
      }
    }
  });

  return contagemPorMes;
};

const getQntMonthlyTotalColStart = (contrato, year) => {
  // Array de contagem de objetos por mês
  const contagemPorMes = Array(12).fill(0);

  // Percorre cada objeto e atualiza a contagem por mês
  contrato.forEach((con) => {
    const dataInicio = con.data_inicio;
    const dataFim = con.data_fim;

    for (let mes = 0; mes < 12; mes++) {
      const primeiroDiaMes = new Date(year, mes, 1);

      if (dataFim > primeiroDiaMes && primeiroDiaMes >= dataInicio) {
        contagemPorMes[mes]++;
      }
    }
  });

  return contagemPorMes;
};

const getQntMonthlyTotalColEnd = (contrato, year) => {
  // Array de contagem de objetos por mês
  const contagemPorMes = Array(12).fill(0);

  // Percorre cada objeto e atualiza a contagem por mês
  contrato.forEach((con) => {
    const dataInicio = con.data_inicio;
    const dataFim = con.data_fim;

    for (let mes = 0; mes < 12; mes++) {
      const ultimoDiaMes = new Date(year, mes + 1, 0);
      ultimoDiaMes.setHours(0, 0, 0, 0);
      ultimoDiaMes.setDate(ultimoDiaMes.getDate() + 1);
      ultimoDiaMes.setMilliseconds(ultimoDiaMes.getMilliseconds() - 1);

      if (dataFim > ultimoDiaMes && ultimoDiaMes >= dataInicio) {
        contagemPorMes[mes]++;
      }
    }
  });

  return contagemPorMes;
};

const getYearlyTurnover = async (contrato, year) => {
  const qntYearlyAdmission = getQntYearlyAdmission(contrato, year);
  const qntYearlyDemission = getQntYearlyDemission(contrato, year);
  const qntYearlyTotalColStart = getQntYearlyTotalColStart(contrato, year);
  const qntYearlyTotalColEnd = getQntYearlyTotalColEnd(contrato, year);

  const avgEmployees = (qntYearlyTotalColStart + qntYearlyTotalColEnd) / 2;
  const turnovel = Math.min(
    (
      ((qntYearlyAdmission + qntYearlyDemission) / 2 / avgEmployees) *
      100
    ).toFixed("2"),
    100
  );

  return turnovel;
};

const getMonthlyTurnovel = async (contrato, year) => {
  const monthlyTurnover = Array(12).fill(0);

  const qntMonthlyAdmission = getQntMonthlyAdmission(contrato, year);
  const qntMonthlyDemission = getQntMonthlyDemission(contrato, year);
  const qntMonthlyTotalColStart = getQntMonthlyTotalColStart(contrato, year);
  const qntMonthlyTotalColEnd = getQntMonthlyTotalColEnd(contrato, year);

  for (let mes = 0; mes < 12; mes++) {
    const AverageOfMember =
      (qntMonthlyTotalColStart[mes] + qntMonthlyTotalColEnd[mes]) / 2;
    monthlyTurnover[mes] = Math.min(
      (
        ((qntMonthlyAdmission[mes] + qntMonthlyDemission[mes]) /
          2 /
          AverageOfMember) *
        100
      ).toFixed('2'),
      100
    );
  }

  const aux = monthlyTurnover.map(value => value || 0)

  return aux;
};

const getTurnovel = async (colaborador, year) => {
  const id = colaborador.map((col) => col._id);
  const contrato = await Contrato.find({ id_associado: { $in: id } });
  const monthlyTurnovel = await getMonthlyTurnovel(contrato, year);
  const yearlyTurnovel = await getYearlyTurnover(contrato, year) || 0;

  return {
    monthlyTurnovel,
    yearlyTurnovel,
  };
};

const getMonthlyDemissionRate = async (colaborador, year) => {
  const id = colaborador.map((col) => col._id);
  const contrato = await Contrato.find({ id_associado: { $in: id } });
  const monthlyDemissionRate = Array(12).fill(0);

  const qntMonthlyDemission = getQntMonthlyDemission(contrato, year);
  const qntMonthlyTotalColStart = getQntMonthlyTotalColStart(contrato, year);
  const qntMonthlyTotalColEnd = getQntMonthlyTotalColEnd(contrato, year);

  for (let mes = 0; mes < 12; mes++) {
    const AverageOfMember =
      (qntMonthlyTotalColStart[mes] + qntMonthlyTotalColEnd[mes]) / 2;
    monthlyDemissionRate[mes] = Math.min(
      ((qntMonthlyDemission[mes] / AverageOfMember) * 100).toFixed("2"),
      100
    );
  }

  const aux = monthlyDemissionRate.map(value => value || 0)

  return aux;
};

const getMonthlyAdmissionRate = async (colaborador, year) => {
  const id = colaborador.map((col) => col._id);
  const contrato = await Contrato.find({ id_associado: { $in: id } });
  const monthlyAdmissionRate = Array(12).fill(0);

  const qntMonthlyAdmission = getQntMonthlyAdmission(contrato, year);
  const qntMonthlyTotalColStart = getQntMonthlyTotalColStart(contrato, year);
  const qntMonthlyTotalColEnd = getQntMonthlyTotalColEnd(contrato, year);

  for (let mes = 0; mes < 12; mes++) {
    const AverageOfMember =
      (qntMonthlyTotalColStart[mes] + qntMonthlyTotalColEnd[mes]) / 2;
    monthlyAdmissionRate[mes] = Math.min(
      ((qntMonthlyAdmission[mes] / AverageOfMember) * 100).toFixed("2"),
      100
    );
  }

  const aux = monthlyAdmissionRate.map(value => value || 0)

  return aux;
};

const getAcademicLevel = (colaborador) => {
  const qntByAcademicLevel = Array(4).fill(0);

  colaborador.forEach((col) => {
    const nivelAcademico = col.nivel_academico;
    switch (nivelAcademico) {
      case "Primeiro cíclo do secundário":
        qntByAcademicLevel[0]++;
        break;
      case "Ensino médio":
        qntByAcademicLevel[1]++;
        break;
      case "Superior incompleto":
        qntByAcademicLevel[2]++;
        break;
      case "Superior completo":
        qntByAcademicLevel[3]++;
    }
  });

  return qntByAcademicLevel;
};

function calculateAge(dataNascimento) {
  const diff = Date.now() - dataNascimento.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const getCompanyTime = (colaborador) => {
  const qntByCompanyTime = Array(5).fill(0);

  // Loop pelos colaboradores e contagem por tempo de serviço
  colaborador.forEach((col) => {
    const serviceTime = calculateAge(col.criado_em);

    if (serviceTime < 2) {
      qntByCompanyTime[0]++;
    } else if (serviceTime >= 2 && serviceTime <= 5) {
      qntByCompanyTime[1]++;
    } else if (serviceTime >= 6 && serviceTime <= 10) {
      qntByCompanyTime[2]++;
    } else if (serviceTime >= 11 && serviceTime <= 20) {
      qntByCompanyTime[3]++;
    } else {
      qntByCompanyTime[4]++;
    }
  });

  return qntByCompanyTime;
};

const getAgeRange = (colaborador) => {
  // Array para armazenar as quantidades de colaboradores por faixa etária
  const qntByAgeRange = Array(5).fill(0);

  // Loop pelos colaboradores e contagem por faixa etária
  colaborador.forEach((col) => {
    const idade = calculateAge(col.data_nasc);

    if (idade <= 25) {
      qntByAgeRange[0]++;
    } else if (idade >= 26 && idade <= 35) {
      qntByAgeRange[1]++;
    } else if (idade >= 36 && idade <= 45) {
      qntByAgeRange[2]++;
    } else if (idade >= 46 && idade <= 55) {
      qntByAgeRange[3]++;
    } else {
      qntByAgeRange[4]++;
    }
  });

  return qntByAgeRange;
};

const getPercent = (qnt, total) => {
  return ((qnt / total) * 100).toFixed("2");
};

const getQntMale = (colaborador) => {
  let qnt = 0;
  colaborador.forEach((col) => {
    if (col.genero === "Masculino") qnt++;
  });
  return qnt;
};

const getQntFemale = (colaborador) => {
  let qnt = 0;
  colaborador.forEach((col) => {
    if (col.genero === "Feminino") qnt++;
  });
  return qnt;
};

const contractIsOkay = async (id) => {
  const contrato = await Contrato.findOne({ id_associado: id });

  const current = new Date().getTime();
  const data_fim = contrato.data_fim && contrato.data_fim.getTime();

  if (!contrato.status || data_fim <= current) return false;

  return true;
};

const colaboradorExist = async (num_bi) => {
  const result = await Colaborador.findOne({ num_bi: num_bi });
  if (result) {
    return true;
  }
  return false;
};

exports.create = async (req, res) => {
  const {
    nome,
    num_bi,
    data_nasc,
    genero,
    num_iban,
    nivel_academico,
    cargo,
    idioma,
  } = req.body;

  if (!nome) {
    res.status(422).json({ message: "O nome é obrigatório1" });
    return;
  }
  if (!num_bi) {
    res.status(422).json({ message: "O numero de BI é obrigatório!" });
    return;
  }
  if (!data_nasc) {
    res.status(422).json({ message: "A data de nascimento é obrigatória!" });
    return;
  }
  if (!genero) {
    res.status(422).json({ message: "O género é obrigatório1" });
    return;
  }
  if (!cargo) {
    res.status(422).json({ message: "O cargo é obrigatório1" });
    return;
  }
  if (!num_iban) {
    res.status(422).json({ message: "O numero de IBAN é obrigatório!" });
    return;
  }

  const exist = await colaboradorExist(num_bi);
  if (exist) {
    res.status(406).json({ message: "Este número de BI já foi usado!" });
    return;
  }

  try {
    const file = req.file;

    const birthDate = new Date(data_nasc);

    const colaborador = {
      nome,
      num_bi,
      num_iban,
      nivel_academico,
      data_nasc: birthDate,
      genero,
      foto_url: file ? file.path.split("/").pop() : "",
      cargo,
      idioma,
    };

    const result = await Colaborador.create(colaborador);
    res.status(201).json({
      message: "Colaborador inserido no sistema com sucesso!",
      result,
    });
    return;
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
    return;
  }
};

exports.findAll = async (req, res) => {
  try {
    const colaborador = await Colaborador.find().sort({ criado_em: -1 });

    res.status(200).json(colaborador);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Houve um erro no servidor!" });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const colaborador = await Colaborador.findOne({ _id: id });

    if (!colaborador) {
      res.status(404).json({ message: "Colaborador não encontrado!" });
      return;
    }

    res.status(200).json(colaborador);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Houve um erro no servidor!" });
  }
};

exports.search = async (req, res) => {
  const query = req.params.query;

  try {
    let colaborador = await Colaborador.find({ num_bi: query }).sort({
      criado_em: -1,
    });

    if (Object.keys(colaborador).length === 0) {
      colaborador = await Colaborador.find({
        nome: { $regex: query, $options: "i" },
      }).sort({ criado_em: -1 });
      if (Object.keys(colaborador) === 0) {
        res.status(404).json({ message: "Colaborador não encontrado!" });
        return;
      }
    }

    res.status(200).json(colaborador);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Houve um erro no servidor!" });
  }
};

exports.annualReport = async (req, res) => {
  const year = req.params.year;

  try {
    const colaborador = await Colaborador.find();

    const colaboradorAtivo = colaborador.filter((col) =>
      contractIsOkay(col._id)
    );

    const total = colaboradorAtivo.length;

    const qntMale = getQntMale(colaboradorAtivo);
    const percentMale = getPercent(qntMale, total);

    const qntFemale = getQntFemale(colaboradorAtivo);
    const percentFemale = getPercent(qntFemale, total);

    const ageRange = getAgeRange(colaboradorAtivo);

    const companyTime = getCompanyTime(colaboradorAtivo);

    const academicLevel = getAcademicLevel(colaboradorAtivo);

    const turnovel = await getTurnovel(colaborador, year);

    const monthlyDemissionRate = await getMonthlyDemissionRate(
      colaborador,
      year
    );

    const monthlyAdmissionRate = await getMonthlyAdmissionRate(
      colaborador,
      year
    );

    res.status(200).json({
      male: { qnt: qntMale, percent: percentMale },
      female: { qnt: qntFemale, percent: percentFemale },
      total: { qnt: total, percent: 100 },
      ageRange,
      academicLevel,
      companyTime,
      monthlyTurnovel: turnovel.monthlyTurnovel,
      yearlyTurnovel: turnovel.yearlyTurnovel,
      monthlyDemissionRate,
      monthlyAdmissionRate,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};

exports.membersActives = async (req, res, next) => {
  try {
    const colaborador = await Colaborador.find();

    const colaboradorAtivo = colaborador.filter((col) =>
      contractIsOkay(col._id)
    );

    const total = colaboradorAtivo.length;

    req.members = total

    next()
  } catch (error) {
    req.error = []
    req.error.push('Erro ao determinar o número de colaboradores ativos')
    console.log(error)
  }
}

exports.update = async (req, res) => {
  const id = req.params.id;

  const { nome, num_iban, nivel_academico, cargo, idioma } = req.body;

  try {
    const colaborador = await Colaborador.findOne({ _id: id });

    if (!colaborador) {
      res.status(404).json({ message: "Colaborador não encontrado!" });
      return;
    }

    const atualizado_em = new Date();

    const newColaborador = {
      nome,
      num_iban,
      nivel_academico,
      cargo,
      idioma,
      atualizado_em,
    };

    const updateColaborador = await Colaborador.updateOne(
      { _id: id },
      newColaborador
    );

    if (cargo !== colaborador.cargo) {
      const user = await User.findOne({ id_colaborador: id });
      if (user) {
        const access =
          cargo === "PCA" || cargo === "Gerente" ? "total" : "restrito";
        user.access = access;
        await user.save();
      }
    }

    res.status(200).json({
      message: "Colaborador atualizado com sucesso!",
      result: { ...updateColaborador, _id: colaborador._id },
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
    const colaborador = await Colaborador.findOne({ _id: id });

    if (!colaborador) {
      res.status(404).json({ message: "Colaborador não encontrado!" });
      return;
    }

    if (colaborador.foto_url) {
      const oldFotoUrl = path.resolve(__dirname.split("/").shift(), 'uploads', 'img', 'colaborador', colaborador.foto_url)
      fs.unlinkSync(oldFotoUrl);
    }

    const atualizado_em = new Date();
    const foto_url = file ? file.path.split("/").pop() : "";

    const newColaborador = { foto_url };

    await Colaborador.updateOne({ _id: id }, newColaborador);

    colaborador.foto_url = foto_url;
    colaborador.atualizado_em = atualizado_em;

    res.status(200).json({
      message: "Foto do colaborador atualizado com sucesso!",
      result: { ...colaborador },
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

  const colaborador = await Colaborador.findOne({ _id: id });

  if (!colaborador) {
    res.status(404).json({ message: "Colaborador não encontrado!" });
    return;
  }

  if (colaborador.foto_url) fs.unlinkSync(colaborador.foto_url);

  try {
    await Colaborador.deleteOne({ _id: id });

    res.status(200).json({ message: "Colaborador removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
};

exports.removeAll = async (req, res) => {
  try {
    await Colaborador.deleteMany({});
    res.status(500).json({ message: "Colaboradores removidos com sucesso!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro no servidor, tente novamente!" });
  }
};
