const express = require("express");
const router = express.Router();
const Tarefa = require("../controllers/TarefaController");

router.post('/', Tarefa.create)

router.get('/', Tarefa.findAll)

router.get('/:id', Tarefa.findOne)

router.get('/all/:id', Tarefa.findMany)

router.patch('/:id', Tarefa.update)

router.delete('/:id', Tarefa.remove)

module.exports = router;