const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000

// IMPORTAR ROTAS
const teamRoute = require('./routes/team_routes');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// CONFIGURAÇÃO DO MONGOOSE
mongoose.connect('mongodb://localhost:27017/f1_project')
  .then(() => {
    console.log('Database connected!')
  }).catch((error) => {
    console.log('Cant connect do Databse')
  });
mongoose.Promise = global.Promise;

// EXEMPLO DE MIDDLEWARE
/* app.use((req, res, next) => {
    console.log(`Request Time ${Date.now()}`);
    console.log(`Request Method: ${req.method}`);
    // Sem o next() a aplicação vai ficar rodando até dar TimeOut e não vai prosseguir com o código
    next();
    // Forma de incluir um bloqueio de métodos neste middleware
    /* if(req.method == 'GET'){
        next();
    }
    else{
        res.status(405).send("Metodo não permitido");
    }
}); */

// USO DAS ROTAS
app.use('/api/teams', teamRoute);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
