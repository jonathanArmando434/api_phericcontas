const express = require("express");
const router = express.Router();
const ContatoColaborador = require("../controllers/ContatoColaboradorController");

router.post('/', ContatoColaborador.create)

router.get('/', ContatoColaborador.findAll)

router.get('/:id', ContatoColaborador.findOne)

router.patch('/:id', ContatoColaborador.update)

router.delete('/:id', ContatoColaborador.remove)

router.delete('/remove/all', ContatoColaborador.removeAll)

module.exports = router;