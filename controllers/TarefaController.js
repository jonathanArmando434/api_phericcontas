const Tarefa = require("../models/TarefaModel");

const getOneYearAgo = async (year) => {
    const startYear = new Date(`${year}-01-01`)
    const endYear = new Date(`${year + 1}-01-01`)

    const tarefa = await Tarefa.find({
        criado_em: {
            $gte: startYear,
            $lt: endYear
        }
    })

    const total = tarefa.length

    const qntFinished = getQntStatus(tarefa, 'Finalizado')

    const qntCanceled = getQntStatus(tarefa, 'Cancelado')

    const qntInProgress = getQntStatus(tarefa, 'Em progresso')

    return {
        qntFinished,
        qntCanceled,
        qntInProgress,
        total
    }
}

const getOneYearAgoAboutAssociate = async (id, year) => {
    const startYear = new Date(`${year}-01-01`)
    const endYear = new Date(`${year + 1}-01-01`)

    const tarefa = await Tarefa.find({
        $or: [
            {
                $and: [
                    { id_responsavel: id },
                    { status: 'Finalizado' },
                    {
                        criado_em: {
                            $gte: startYear,
                            $lt: endYear
                        }
                    }
                ]
            },
            {
                $and: [
                    { id_cliente: id },
                    { status: 'Finalizado' },
                    {
                        criado_em: {
                            $gte: startYear,
                            $lt: endYear
                        }
                    }
                ]
            }
        ]
    })

    const total = tarefa.length

    const qntFinishedOnTime = getQntFinishedOnTime(tarefa)

    const qntFinishedWithDelay = getQntFinishedWithDelay(tarefa)

    return {
        total,
        qntFinishedOnTime,
        qntFinishedWithDelay
    }
}

const getQntMonthlyFinished = (tarefa) => {
    const qntMonthlyFinished = Array(12).fill(0)
    tarefa.forEach(tar => {
        if (Object.keys(tar).length !== 0) {
            const month = tar.data_fim.getMonth()
            qntMonthlyFinished[month]++
        }
    })
    return qntMonthlyFinished
}

const getQntMonthlyOnTime = (tarefa) => {
    const qntMonthlyOnTime = Array(12).fill(0)
    tarefa.forEach(tar => {
        if (Object.keys(tar).length !== 0) {
            const month = tar.data_fim.getMonth()
            const data_limite = tar.data_limite.getTime()
            const data_fim = tar.data_fim.getTime()
            if (data_fim <= data_limite) qntMonthlyOnTime[month]++
        }
    })
    return qntMonthlyOnTime
}

const getMonthlyPerformance = (tarefa) => {
    const monthlyPerformance = Array(12).fill(0)

    const qntMonthlyFinished = getQntMonthlyFinished(tarefa)
    const qntMonthlyOnTime = getQntMonthlyOnTime(tarefa)

    for (let i = 0; i < 12; i++)
        if (qntMonthlyFinished[i] > 0) monthlyPerformance[i] = (qntMonthlyOnTime[i] / qntMonthlyFinished[i]) * 100

    return monthlyPerformance
}

const getQntFinishedOnTime = (tarefa) => {
    let qnt = 0
    tarefa.forEach(tar => {
        if (Object.keys(tar).length !== 0) {
            const data_limite = tar.data_limite.getTime()
            const data_fim = tar.data_fim.getTime()
            if (data_fim <= data_limite) qnt++
        }
    })
    return qnt
}

const getQntFinishedWithDelay = (tarefa) => {
    let qnt = 0
    tarefa.forEach(tar => {
        if (Object.keys(tar).length !== 0) {
            const data_limite = tar.data_limite.getTime()
            const data_fim = tar.data_fim.getTime()
            if (data_fim > data_limite) qnt++
        }
    })
    return qnt
}

const getMonthlyEarnings = (tarefa) => {
    // Array de soma dos valores por mês (inicializado com valores zero)
    const monthlyEarnings = Array(12).fill(0);

    // Percorrer o array de tarefas
    tarefa.forEach(tar => {
        if (tar.status === 'Finalizado') {
            // Obter o mês da data da tarefa (0-11, onde 0 representa janeiro)
            const mes = tar.criado_em.getMonth();

            // Adicionar o valor da tarefa ao acumulador do mês correspondente
            monthlyEarnings[mes] += tar.valor;
        }
    });
    return monthlyEarnings
}

const getQntStatus = (tarefa, status) => {
    let qnt = 0
    tarefa.forEach(tar => {
        if (tar.status === status) qnt++
    })
    return qnt
}

const getQntService = (tarefa, servico) => {
    let qnt = 0
    tarefa.forEach(tar => {
        if (tar.servico === servico) qnt++
    })
    return qnt
}

const getPercentAboutOneYearAgo = (present, oneYearAgo) => {
    return ((present - oneYearAgo) / oneYearAgo) * 100
}

exports.create = async (req, res) => {
    const { servico, data_limite, valor, id_cliente, id_responsavel } = req.body

    const tarefa = { servico, data_limite: new Date(data_limite), valor, id_cliente, id_responsavel }

    try {
        await Tarefa.create(tarefa)

        res.status(201).json({ message: 'Tarefa inserida no sistema com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.findAll = async (req, res) => {
    try {
        const tarefa = await Tarefa.find().sort({ criado_em: -1 })

        res.status(200).json(tarefa)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id

    try {
        const tarefa = await Tarefa.findOne({ _id: id })

        if (!tarefa) {
            res.status(422).json({ message: 'Tarefa não encontrada!' })
            return
        }

        res.status(200).json(tarefa)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.findMany = async (req, res) => {
    const id = req.params.id

    try {
        let tarefa = await Tarefa.find({ id_cliente: id }).sort({ criado_em: -1 }) || {}

        if (Object.keys(tarefa).length === 0) {
            tarefa = await Tarefa.find({ id_responsavel: id }).sort({ criado_em: -1 }) || {}
            if (Object.keys(tarefa).length === 0) {
                res.status(422).json({ message: 'Tarefas não encontrada!' })
                return
            }
        }

        res.status(200).json(tarefa)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.annualReport = async (req, res) => {
    const year = req.params.year

    try {
        const oneYearAgo = getOneYearAgo(year - 1)

        const startYear = new Date(`${year}-01-01`)
        const endYear = new Date(`${year + 1}-01-01`)

        const tarefa = await Tarefa.find({
            criado_em: {
                $gte: startYear,
                $lt: endYear
            }
        })

        const total = tarefa.length
        const percentTotal = getPercentAboutOneYearAgo(total, oneYearAgo.total) || 0

        const qntFinished = getQntStatus(tarefa, 'Finalizado')
        const percentFinished = getPercentAboutOneYearAgo(qntFinished, oneYearAgo.qntFinished) || 0

        const qntCanceled = getQntStatus(tarefa, 'Cancelado')
        const percentCanceled = getPercentAboutOneYearAgo(qntCanceled, oneYearAgo.qntCanceled) || 0

        const qntInProgress = getQntStatus(tarefa, 'Em progresso')
        const percentInProgress = getPercentAboutOneYearAgo(qntInProgress, oneYearAgo.qntInProgress) || 0

        const qntOne = getQntService(tarefa, 'Organização contabilística')

        const qntTwo = getQntService(tarefa, 'Constituição e legalização de empresas')

        const qntThree = getQntService(tarefa, 'Consultoria fiscal')

        const qntFour = getQntService(tarefa, 'Gestão de recursos humanos')

        const monthlyEarnings = getMonthlyEarnings(tarefa)

        res.status(200).json({
            finished: { qnt: qntFinished, percent: percentFinished },
            canceled: { qnt: qntCanceled, percent: percentCanceled },
            inProgress: { qnt: qntInProgress, percent: percentInProgress },
            total: { qnt: total, percent: percentTotal },
            qntServices: [qntOne, qntTwo, qntThree, qntFour],
            monthlyEarnings
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.annualReportAboutAssociate = async (req, res) => {
    const id = req.params.id
    const year = req.params.year

    const startYear = new Date(`${year}-01-01`)
    const endYear = new Date(`${year + 1}-01-01`)

    try {
        const oneYearAgo = getOneYearAgoAboutAssociate(id, (year - 1))

        const tarefa = await Tarefa.find({
            $or: [
                {
                    $and: [
                        { id_responsavel: id },
                        { status: 'Finalizado' },
                        {
                            criado_em: {
                                $gte: startYear,
                                $lt: endYear
                            }
                        }
                    ]
                },
                {
                    $and: [
                        { id_cliente: id },
                        { status: 'Finalizado' },
                        {
                            criado_em: {
                                $gte: startYear,
                                $lt: endYear
                            }
                        }
                    ]
                }
            ]
        })

        const total = tarefa.length
        const percentTotal = getPercentAboutOneYearAgo(total, oneYearAgo.total) || 0

        const qntFinishedOnTime = getQntFinishedOnTime(tarefa)
        const percentFinishedOnTime = getPercentAboutOneYearAgo(qntFinishedOnTime, oneYearAgo.qntFinishedOnTime) || 0

        const qntFinishedWithDelay = getQntFinishedWithDelay(tarefa)
        const percentFinishedWithDelay = getPercentAboutOneYearAgo(qntFinishedWithDelay, oneYearAgo.qntFinishedWithDelay) || 0

        const monthlyPerformance = getMonthlyPerformance(tarefa)

        res.status(200).json({
            finishedOnTime: { qnt: qntFinishedOnTime, percent: percentFinishedOnTime },
            finishedWithDelay: { qnt: qntFinishedWithDelay, percent: percentFinishedWithDelay },
            total: { qnt: total, percent: percentTotal },
            monthlyPerformance
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    const { servico, data_limite, data_fim, valor, status, id_cliente, id_responsavel } = req.body

    try {
        const tarefa = await Tarefa.findOne({ _id: id })

        if (!tarefa) {
            res.status(422).json({ message: 'Tarefa não encontrada!' })
            return
        }

        const newTarefa = (
            data_fim ?
                { servico, data_limite, data_fim, valor, status, id_cliente, id_responsavel, atualizado_em: new Date() } :
                { servico, data_limite, valor, status, id_cliente, id_responsavel, atualizado_em: new Date() }
        )

        await Tarefa.updateOne({ _id: id }, newTarefa)

        res.status(200).json({ message: 'Tarefa atualizada com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id

    const tarefa = await Tarefa.findOne({ _id: id })

    if (!tarefa) {
        res.status(422).json({ message: 'Tarefa não encontrada!' })
        return
    }

    try {
        await Tarefa.deleteOne({ _id: id })

        res.status(200).json({ message: 'Tarefa removida com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no sistema, tente novamente!' })
    }
}

exports.removeAll = async (req, res) => {
    try {
        await Tarefa.deleteMany({})
        res.status(500).json({ message: 'Tarefas removidas com sucesso!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Houve um erro no servidor, tente novamente!' })
    }
}