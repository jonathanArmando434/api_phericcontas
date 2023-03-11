const express = require("express");
const router = express.Router();
const Notificacao = require("../controllers/NotificacaoController");

router.post('/', Notificacao.create)

router.get('/', Notificacao.findAll)

router.get('/:data', Notificacao.findMany)

router.delete('/:id', Notificacao.remove)

module.exports = router;