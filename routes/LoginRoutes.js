const router = require('express').Router() 
const { loginMiddleware } = require('../middlewares/loginMiddleware')

router.post('/', loginMiddleware)

module.exports = router