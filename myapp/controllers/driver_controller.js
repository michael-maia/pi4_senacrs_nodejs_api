// Importando schema/model criado no arquivo
const Driver = require('../models/driver');

exports.showList = (req, res) => {
    Driver.find({}, (err, drivers) => {
        if(err){
            res.status(500).send(err);
        }
        res.json(drivers);
    });
}

exports.findById = (req, res) => {
    const id = req.params.id;

    Driver.findfindById(id, (err, driver) => {
        if(err){
            res.status(500).send(err);
        }

        if(driver){
            res.json(driver);
        }
        else{
            res.status(404).json({error: "Driver not found"});
        }
    });
}

exports.create = (req, res) => {
    let newDriver = new Driver(req.body);

    newDriver.save((err, driver) => {
        if(err){
            res.send(err);
        }
        res.status(200).json(driver);
    });
}

exports.update = (req, res) => {
    const id = req.params.id;
    const driverUpdate = req.body;

    Driver.findByIdAndUpdate(id, driverUpdate, {new: true}, (err, updatedDriver) => {
        if(err){
            res.status(500).send(err);
        }
        if(updatedDriver){
            res.json(updatedDriver);
        }
        else{
            res.status(404).json({error: "Driver not found"});
        }
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Team.findByIdAndDelete(id, (err, driverDeleted) => {
        if(err){
            res.status(500).send(err);
        }
        if(teamDeleted){
            //res.json(teamDeleted);
            res.json("DRIVER REMOVED!");
        }
        else{
            res.status(404).json({error: "Driver not found"});
        }
    });
}

exports.search = (req, res) => {
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
};
