const express = require("express");
const router = express.Router();
const User = require("../controllers/UserController");
const { checkToken } = require('../middlewares/othersMiddleware')
const { recorvePassword } = require('../middlewares/resetPasswordMiddleware')

router.post('/', User.create)

router.post('/reset-password', recorvePassword)

router.get('/', checkToken, User.findAll)

router.get('/:id', checkToken, User.findOne)

router.patch('/:token', User.update)

router.delete('/:id', checkToken, User.remove)

router.delete('/remove/all', checkToken, User.removeAll)

module.exports = router;