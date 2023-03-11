const express = require("express");
const router = express.Router();
const Financas = require("../controllers/FinancasController");

router.post('/', Financas.create)

router.get('/', Financas.findAll)

router.get('/:id', Financas.findOne)

router.patch('/:id', Financas.update)

router.delete('/:id', Financas.remove)

module.exports = router;