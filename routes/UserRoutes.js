const express = require("express");
const router = express.Router();
const User = require("../controllers/UserController");

router.post('/', User.create)

router.get('/', User.findAll)

router.get('/:id', User.findOne)

router.patch('/:id', User.update)

router.delete('/:id', User.remove)

module.exports = router;