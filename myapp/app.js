const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

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
mongoose.connect('mongodb://localhost:27017/f1_project')
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


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
