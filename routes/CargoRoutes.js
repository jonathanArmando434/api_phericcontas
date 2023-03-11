const express = require("express");
const router = express.Router();
const Cargo = require("../controllers/CargoController");

router.post('/', Cargo.create)

router.get('/', Cargo.findAll)

router.get('/:id', Cargo.findOne)

router.patch('/:id', Cargo.update)

router.delete('/:id', Cargo.remove)

module.exports = router