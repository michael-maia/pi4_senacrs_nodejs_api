const express = require('express')
const mongoose = require('mongoose')
const app = express()
const dotenv = require("dotenv")

// String de conexão do MongoDB Atlas
dotenv.config()
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.3nz0l.mongodb.net/Projeto1?retryWrites=true&w=majority`
const port = process.env.PORT

// Importando as Rotas
const teamRoute = require('./routes/team_routes');
const driverRoute = require('./routes/driver_routes');
const userRoute = require('./routes/user_routes');
const roleRoute = require('./routes/role_routes');

// Importando user_controller para validacao do token
const userController = require('./controllers/user_controller');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Configuracao do Mongoose
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected!')
  }).catch((error) => {
    console.log(error)
  });
mongoose.Promise = global.Promise;

// Uso das rotas
app.use('/api/teams', teamRoute);
app.use('/api/drivers', driverRoute);
app.use('/api/users', userRoute);
app.use('/api/roles', userController.isAdmin, roleRoute);

console.log("TESTE")

/* app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
}) */
