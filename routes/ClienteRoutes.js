const express = require("express");
const router = express.Router();
const upload = require("../config/clienteMulter");
const Cliente = require("../controllers/ClienteController");

router.post('/', upload.single("file"), Cliente.create)

router.get('/', Cliente.findAll)

router.get('/:id', Cliente.findOne)

router.get('/search/:query', Cliente.search)

router.patch('/:id', Cliente.update)

router.patch('/update-logo/:id', upload.single("file"), Cliente.updatePhoto)

router.delete('/:id', Cliente.remove)

router.delete('/remove/all', Cliente.removeAll)

module.exports = router;