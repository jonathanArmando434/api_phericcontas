require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.set("strictQuery", true)
mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.emit('pronto')
  })
  .catch(e => console.log(e))
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const path = require('path')
const helmet = require('helmet')
//const csrf = require('csurf')
const port = process.env.PORT
//const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./middlewares/middleware')

const cargo = require('./routes/CargoRoutes')
const cliente = require('./routes/ClienteRoutes')
const colaborador = require('./routes/ColaboradorRoutes')
const bankAccount = require('./routes/BankAccountRoutes')
const contrato = require('./routes/ContratoRoutes')
const contatoCliente = require('./routes/ContatoClienteRoutes')
const contatoColaborador = require('./routes/ContatoColaboradorRoutes')
const localizacao = require('./routes/LocalizacaoRoutes')
const historico = require('./routes/HistoricoRoutes')
const notificacao = require('./routes/NotificacaoRoutes')
const tarefa = require('./routes/TarefaRoutes')
const user = require('./routes/UserRoutes')
const financas = require('./routes/FinancasRoutes')

app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sessionOptions = session({
  secret: 'sispenaareaasuamaesabequeuasacortinadela',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
})
app.use(sessionOptions)
app.use(flash())

//app.use(csrf())

// Nossos próprios middlewares
//app.use(middlewareGlobal);
//app.use(checkCsrfError);
//app.use(csrfMiddleware);

//Rotas
app.use('/cargo', cargo)
app.use('/cliente', cliente)
app.use('/colaborador', colaborador)
app.use('/conta-bancaria', bankAccount)
app.use('/contato-colaborador', contatoColaborador)
app.use('/contato-cliente', contatoCliente)
app.use('/localizacao', localizacao)
app.use('/historico', historico)
app.use('/notificacao', notificacao)
app.use('/tarefa', tarefa)
app.use('/usuario', user)
app.use('/contrato', contrato)
app.use('/financas', financas)

app.on('pronto', () => {
  app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`)
  })
})
