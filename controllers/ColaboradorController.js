const fs = require('fs')
// const { subMonths, endOfMonth } = require('date-fns');
const Colaborador = require("../models/ColaboradorModel");
const User = require('../models/UserModel')
const Contrato = require('../models/ContratoModel');

// const getLastDayOfLastMonth = () => {
//      // Subtrai um mês da data atual
//     const dataMesPassado = subMonths(new Date(), 1);
//     // Obtém o último dia do mês anterior
//     return endOfMonth(dataMesPassado);
// }

// const getMonthlyTurnovel = (colaborador) => {
//     const currentDate = new Date()
//     const currentYear = new Date().getUTCFullYear()
//     const startDate = new Date(`${currentYear}-01-01`)
//     const endDate = new Date(`${currentYear + 1}-01-01`)
//     const id = colaborador.map(col => col._id)
//     const contrato = Contrato.find({ id_associado: { $in: id } })
//     const qntCol = Array(12).fill(0)
//     let month = 0
//     contrato.forEach(con => {
//         if(con.status && getLastDayOfLastMonth().getTime() <= con.data_fim ){
//             if(currentDate.getUTCFullYear() === con.data_inicio.getUTCFullYear()){
//                 const monthOfDateInicio = con.data_inicio.getMonth()
//                 for(; month <= currentDate.getMonth(); month++) 
//                     if(monthOfDateInicio <= )
//             }
//         }
//     })
// }

const getAcademicLevel = (colaborador) => {
    const qntByAcademicLevel = Array(4).fill(0)

    colaborador.forEach((col) => {
        const nivelAcademico = col.nivel_academico
        switch (nivelAcademico) {
            case 'Primeiro cíclo do secundário': qntByAcademicLevel[0]++; break;
            case 'Ensino médio': qntByAcademicLevel[1]++; break;
            case 'Superior incompleto': qntByAcademicLevel[2]++; break;
            case 'Superior completo': qntByAcademicLevel[3]++;
        }
    });

    return qntByAcademicLevel
}

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
    })

    return qntByCompanyTime
}

const getAgeRange = (colaborador) => {
    // Array para armazenar as quantidades de colaboradores por faixa etária
    const qntByAgeRange = Array(!2).fill(0);

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

    return qntByAgeRange
}

const getPercent = (qnt, total) => {
    return (qnt / total) * 100
}

const getQntMale = (colaborador) => {
    let qnt = 0
    colaborador.forEach(col => {
        if (colaborador.genero === 'Masculino') qnt++
    })
    return qnt
}

const getQntFemale = (colaborador) => {
    let qnt = 0
    colaborador.forEach(col => {
        if (colaborador.genero === 'Feminino') qnt++
    })
    return qnt
}

const contractIsOkay = async (id) => {
    const contrato = Contrato.findOne({ id_associado: id })

    const current = (new Date()).getTime()
    const data_fim = contrato.data_fim.getTime()

    if (!contrato.status || data_fim <= current) return false

    return true
}

const colaboradorExist = async (num_bi) => {
    const result = await Colaborador.findOne({ num_bi: num_bi })
    if (result) {
        return true
    }
    return false
}

const removeSamevalue = (array) => {
    array.forEach((value, index) => {
        for (let i = index + 1; i < array.length; i++)
            if (array[i] === value) array[i] = ''
    })

    return array
}

const removeValueEmpty = (array) => {
    array = removeSamevalue(array)
    const aux = array.filter(value => value !== '')
    return aux
}

exports.create = async (req, res) => {
    const {
        nome,
        num_bi,
        data_nasc,
        genero,
        num_iban,
        nivel_academico,
        cargo,
        idioma
    } = req.body

    if (!nome) {
        res.status(422).json({ message: 'O nome é obrigatório1' })
        return
    }
    if (!num_bi) {
        res.status(422).json({ message: 'O numero de BI é obrigatório!' })
        return
    }
    if (!data_nasc) {
        res.status(422).json({ message: 'A data de nascimento é obrigatória!' })
        return
    }
    if (!genero) {
        res.status(422).json({ message: 'O género é obrigatório1' })
        return
    }
    if (!cargo) {
        res.status(422).json({ message: 'O cargo é obrigatório1' })
        return
    }
    if (!num_iban) {
        res.status(422).json({ message: 'O numero de IBAN é obrigatório!' })
        return
    }

    const exist = await colaboradorExist(num_bi)
    if (exist) {
        res.status(406).json({ message: 'Este número de BI já foi usado!' })
        return
    }

    try {
        const file = req.file || '';

        const birthDate = new Date(data_nasc)

        const colaborador = {
            nome,
            num_bi,
            num_iban,
            nivel_academico,
            data_nasc: birthDate,
            genero,
            foto_url: file.path.split('/').pop(),
            cargo,
            idioma
        }

        const result = await Colaborador.create(colaborador)
        res.status(201).json({ message: 'Colaborador inserido no sistema com sucesso!', result })
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
        return
    }
}

exports.findAll = async (req, res) => {
    try {
        const colaborador = await Colaborador.find().sort({ criado_em: -1 })

        res.status(200).json(colaborador)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor!' })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const colaborador = await Colaborador.findOne({ _id: id })

        if (!colaborador) {
            res.status(404).json({ message: 'Colaborador não encontrado!' })
            return
        }

        res.status(200).json(colaborador)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor!' })
    }
}

exports.search = async (req, res) => {
    const query = req.params.query

    try {
        let colaborador = await Colaborador.find({ num_bi: query }).sort({ criado_em: -1 })

        if (Object.keys(colaborador).length === 0) {
            colaborador = await Colaborador.find({ nome: { $regex: query, $options: "i" } }).sort({ criado_em: -1 });
            if (Object.keys(colaborador) === 0) {
                res.status(404).json({ message: 'Colaborador não encontrado!' })
                return
            }
        }

        res.status(200).json(colaborador)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor!' })
    }
}

exports.annualReport = async (req, res) => {
    const year = req.params.year

    try {
        const colaborador = Colaborador.find()

        const colaboradorAtivo = colaborador.filter(col => contractIsOkay(col._id))

        const total = colaboradorAtivo.length

        const qntMale = getQntMale(colaboradorAtivo)
        const percentMale = getPercent(qntMale, total)

        const qntFemale = getQntFemale(colaboradorAtivo)
        const percentFemale = getPercent(qntFemale, total)

        const ageRange = getAgeRange(colaboradorAtivo)

        const companyTime = getCompanyTime(colaboradorAtivo)

        const academicLevel = getAcademicLevel(colaboradorAtivo)

        res.status(200).json({
            male: { qnt: qntMale, percent: percentMale },
            female: { qnt: qntFemale, percent: percentFemale },
            total: { qnt: total, percent: 100 },
            ageRange,
            academicLevel,
            companyTime
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { nome, num_iban, nivel_academico, cargo, idioma } = req.body

    try {
        const colaborador = await Colaborador.findOne({ _id: id })

        if (!colaborador) {
            res.status(404).json({ message: 'Colaborador não encontrado!' })
            return
        }

        const atualizado_em = new Date()

        const newColaborador = { nome, num_iban, nivel_academico, cargo, idioma, atualizado_em }

        const updateColaborador = await Colaborador.updateOne({ _id: id }, newColaborador)

        if (cargo !== colaborador.cargo) {
            const user = await User.findOne({ id_colaborador: id })
            if (user) {
                const access = (cargo === 'PCA' || cargo === 'Gerente') ? 'total' : 'restrito'
                user.access = access
                await user.save()
            }
        }

        res.status(200).json({ message: 'Colaborador atualizado com sucesso!', result: { ...updateColaborador, _id: colaborador._id } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.updatePhoto = async (req, res) => {
    const id = req.params.id

    const file = req.file || '';

    try {
        const colaborador = await Colaborador.findOne({ _id: id })

        if (!colaborador) {
            res.status(404).json({ message: 'Colaborador não encontrado!' })
            return
        }

        if (colaborador.foto_url) fs.unlinkSync(colaborador.foto_url);

        const atualizado_em = new Date()
        const foto_url = file.path.split('/').pop()

        const newColaborador = { foto_url }

        await Colaborador.updateOne({ _id: id }, newColaborador)

        colaborador.foto_url = foto_url
        colaborador.atualizado_em = atualizado_em

        res.status(200).json({ message: 'Imagem do colaborador atualizado com sucesso!', result: { ...colaborador } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const colaborador = await Colaborador.findOne({ _id: id })

    if (!colaborador) {
        res.status(404).json({ message: 'Colaborador não encontrado!' })
        return
    }

    if (colaborador.foto_url) fs.unlinkSync(colaborador.foto_url);

    try {
        await Colaborador.deleteOne({ _id: id })

        res.status(200).json({ message: 'Colaborador removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
}