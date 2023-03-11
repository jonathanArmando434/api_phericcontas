const express = require("express");
const router = express.Router();
const Historico = require("../controllers/HistoricoController");

router.post('/', Historico.create)

router.get('/', Historico.findAll)

router.get('/:data', Historico.findMany)

router.delete('/:id', Historico.remove)

module.exports = router;