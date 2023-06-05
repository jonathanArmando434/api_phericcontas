const express = require("express");
const router = express.Router();
const Financas = require("../controllers/FinancasController");

router.post('/', Financas.create)

router.get('/', Financas.findAll)

router.get('/:id', Financas.findOne)

router.get('/annual-report/:year', Financas.annualReport)

router.patch('/:id', Financas.update)

router.delete('/:id', Financas.remove)

router.delete('/remove/all', Financas.removeAll)

module.exports = router;