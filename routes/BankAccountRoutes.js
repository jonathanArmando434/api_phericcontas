const express = require("express");
const router = express.Router();
const BankAccount = require("../controllers/BankAccountController");

router.post('/', BankAccount.create)

router.get('/', BankAccount.findAll)

router.get('/:id', BankAccount.findOne)

router.patch('/:id', BankAccount.update)

router.delete('/:id', BankAccount.remove)

module.exports = router;