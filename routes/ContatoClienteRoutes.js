const express = require("express");
const router = express.Router();
const ContatoCliente = require("../controllers/ContatoClienteController");

router.post('/', ContatoCliente.create)

router.get('/', ContatoCliente.findAll)

router.get('/:id', ContatoCliente.findOne)

router.patch('/:id', ContatoCliente.update)

router.patch('/:id/:localID', ContatoCliente.updateLocation)

router.patch('/remove-location/:id/:localID', ContatoCliente.removeLocation)

router.delete('/:id', ContatoCliente.remove)

router.delete('/remove/all', ContatoCliente.removeAll)

module.exports = router;