const express = require("express");
const router = express.Router();
const upload = require("../config/colaboradorMulter");
const Colaborador = require("../controllers/ColaboradorController");

router.post('/', upload.single("file"), Colaborador.create)

router.get('/', Colaborador.findAll)

router.get('/:id', Colaborador.findOne)

router.get('/search/:query', Colaborador.search)

router.get('/annual-report/:year', Colaborador.annualReport)

router.patch('/:id', Colaborador.update)

router.patch('/update-photo/:id', upload.single("file"), Colaborador.updatePhoto)

router.delete('/:id', Colaborador.remove)

router.delete('/remove/all', Colaborador.removeAll)

module.exports = router;