const router = require('express').Router() 
const { sendEmail } = require('../middlewares/othersMiddleware')

router.post('/email', sendEmail)

module.exports = router