// Importando schema/model criado no arquivo
const Driver = require('../models/driver');

// Mostra todos os drivers cadastrados no banco e retorna um JSON
exports.showList = (req, res) => {
    Driver.find({}, (err, drivers) => {
        if(err){
            res.status(500).send({error: "Request error!"});
        }
        res.status(200).json(drivers);
    });
}

// Procura um driver através do seu ObjectId e retorna um JSON com suas propriedades
exports.findById = (req, res) => {
    const id = req.params.id;
    Driver.findById(id, (err, driver) => {
        try{
            if(err){
                res.status(500).send({error: "Request error!"});
            }
            else if(driver){
                res.status(200).json(driver);
            }
            else{
                res.status(404).json({error: "Driver not found"});
            }
        }
        catch(e){
            res.status(500).send({error: "Request error!"});
            console.log(e);
        }
    });
}

exports.create = (req, res) => {
    let newDriver = new Driver(req.body);
    // RaceVictories, ChampionshipsVictories podem ser zero então tenho que tirar da validação abaixo
    if(!newDriver || !newDriver.fullName || !newDriver.nationality || !newDriver.carNumber){
        res.status(400).send({error: "JSON parameters cannot be Null or Empty"});
    }
    else{
        newDriver.save((err, driver) => {
            if(err){
                res.status(500).send({error: "Request error!"});
            }
            res.status(201).json(driver);
        });
    }
}

exports.update = (req, res) => {
    const id = req.params.id;
    const driverUpdate = req.body;
    if(!driverUpdate || !driverUpdate.fullName || !driverUpdate.nationality || !driverUpdate.carNumber){
        res.status(400).send({error: "JSON parameters cannot be Null or Empty"});
    }
    else{
        Driver.findByIdAndUpdate(id, driverUpdate, {new: true}, (err, updatedDriver) => {
            if(err){
                res.status(500).send({error: "Request error!"});
            }
            if(updatedDriver){
                res.status(200).json(updatedDriver);
            }
            else{
                res.status(404).json({error: "Driver not found"});
            }
        });
    }
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Driver.findByIdAndDelete(id, (err, driverDeleted) => {
        if(err){
            res.status(500).send({error: "Request error!"});
        }
        if(driverDeleted){
            //res.json(teamDeleted);
            res.status(200).json("DRIVER REMOVED!");
        }
        else{
            res.status(404).json({error: "Driver not found"});
        }
    });
}

/* exports.search = (req, res) => {
    // Verifica se existe query na URI e se tem o parametro "nome" nela
    if(req.query && req.query.name){
        const paramName = req.query.name;
        Driver.find({fullName: paramName}, (err, driver) => {
            if(err){
                res.status(500).send(err);
            }
            // Como vai retornar um Array, devemos verificar se a quantidade de elementos é maior que zero também
            if(drivers && drivers.length > 0){
                res.json(drivers);
            }
            else{
                res.status(404).json({error: "Driver not found"});
            }
        });
    }
    else{
        res.status(400).send({error: "Parameter 'name' is required"});
    }
}; */

// Funciona caso a propriedade Teams não seja ARRAY
exports.showTeams = (req, res) => {
    if(!req.query || !req.query.driverName){
        res.status(404).send({error: "Query parameter cannot be Null or Empty"});
    }
    else{
        const paramName = req.query.driverName;
        Driver.findOne({fullName: paramName}).populate('teams').
        exec((err, driver) => {
            if(err){
                res.status(500).send({error: "Request error!"});
            }
            res.status(200).json(driver.teams.fullName);
        })
    }
}
