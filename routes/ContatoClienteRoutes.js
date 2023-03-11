const express = require("express");
const router = express.Router();
const ContatoCliente = require("../controllers/ContatoClienteController");

router.post('/', ContatoCliente.create)

router.get('/', ContatoCliente.findAll)

router.get('/:id', ContatoCliente.findOne)

router.patch('/:id', ContatoCliente.update)

router.delete('/:id', ContatoCliente.remove)

module.exports = router;