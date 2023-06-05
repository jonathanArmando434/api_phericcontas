const router = require('express').Router() 
const { sendEmail, publicInfo } = require('../middlewares/othersMiddleware')
const Colaborador = require("../controllers/ColaboradorController");
const Cliente = require("../controllers/ClienteController");
const Tarefa = require("../controllers/TarefaController");

router.get('/company/info', Colaborador.membersActives, Cliente.clientsActives, Tarefa.tasksFinished, publicInfo)

router.post('/email', sendEmail)

module.exports = router