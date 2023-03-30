const express = require("express");
const router = express.Router();
const User = require("../controllers/UserController");
const { checkToken } = require('../middlewares/othersMiddleware')

router.post('/', User.create)

router.get('/', checkToken, User.findAll)

router.get('/:id', checkToken, User.findOne)

router.patch('/:id', checkToken, User.update)

router.delete('/:id', checkToken, User.remove)

module.exports = router;