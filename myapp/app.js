const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

// Importando as Rotas
const teamRoute = require('./routes/team_routes');
const driverRoute = require('./routes/driver_routes');
const userRoute = require('./routes/user_routes');

// Importando user_controller para validacao do token
const userController = require('./controllers/user_controller');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Configuracao do Mongoose
mongoose.connect('mongodb://localhost:27017/f1_project')
  .then(() => {
    console.log('Database connected!')
  }).catch((error) => {
    console.log('Cant connect do Databse')
  });
mongoose.Promise = global.Promise;

// Uso das rotas
app.use('/api/teams', userController.tokenValidation, teamRoute);
app.use('/api/drivers', userController.tokenValidation, driverRoute);
app.use('/api/users', userRoute);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
