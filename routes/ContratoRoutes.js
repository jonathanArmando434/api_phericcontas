const express = require("express");
const router = express.Router();
const Contrato = require("../controllers/ContratoController");

router.post('/', Contrato.create)

router.get('/', Contrato.findAll)

router.get('/:id', Contrato.findOne)

router.patch('/:id', Contrato.update)

router.delete('/:id', Contrato.remove)

module.exports = router;