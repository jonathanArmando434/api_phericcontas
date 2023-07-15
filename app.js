require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set("strictQuery", true)
mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.emit('pronto')
  })
  .catch(e => console.log(e))
const path = require('path')
const helmet = require('helmet')
const port = process.env.PORT
const { checkToken } = require('./middlewares/othersMiddleware')
const cliente = require('./routes/ClienteRoutes')
const colaborador = require('./routes/ColaboradorRoutes')
const contrato = require('./routes/ContratoRoutes')
const contatoCliente = require('./routes/ContatoClienteRoutes')
const contatoColaborador = require('./routes/ContatoColaboradorRoutes')
const tarefa = require('./routes/TarefaRoutes')
const user = require('./routes/UserRoutes')
const financas = require('./routes/FinancasRoutes')
const login = require('./routes/LoginRoutes')
const _public = require('./routes/PublicRoutes')

app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(express.static(path.resolve(__dirname, 'uploads', 'img', 'colaborador')))
app.use(express.static(path.resolve(__dirname, 'uploads', 'img', 'cliente')))

//Rotas
app.use('/cliente', checkToken, cliente)
app.use('/colaborador', checkToken, colaborador)
app.use('/contato-colaborador', checkToken, contatoColaborador)
app.use('/contato-cliente', checkToken, contatoCliente)
app.use('/tarefa', checkToken, tarefa)
app.use('/usuario', user)
app.use('/contrato', checkToken, contrato)
app.use('/financas', checkToken, financas)
app.use('/login', login)
app.use('/public', _public)

app.on('pronto', () => {
  app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`)
  })
})
