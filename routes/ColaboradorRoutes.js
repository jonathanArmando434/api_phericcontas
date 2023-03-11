const express = require("express");
const router = express.Router();
const upload = require("../config/colaboradorMulter");
const Colaborador = require("../controllers/ColaboradorController");

router.post('/', upload.single("file"), colaborador.createColaborador)

router.get('/', Colaborador.findAll)

router.get('/:id', Colaborador.findOne)

router.patch('/:id', Colaborador.update)

router.delete('/:id', Colaborador.remove)

module.exports = router;