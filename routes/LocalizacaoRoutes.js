const express = require("express");
const router = express.Router();
const Localizacao = require("../controllers/LocalizacaoController");

router.post('/', Localizacao.create)

router.get('/', Localizacao.findAll)

router.get('/:id', Localizacao.findMany)

router.patch('/:id', Localizacao.update)

router.delete('/:id', Localizacao.remove)

module.exports = router;