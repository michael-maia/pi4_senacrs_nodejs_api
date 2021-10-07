const Role = require('../models/role');

exports.showList = (res) => {
    Role.find({}, (err, roles) => {
        if(err){
            res.status(500).send(err);
        }
        res.status(200).json(roles);
    });
}

exports.create = (req, res) => {
    let newRole = new Role(req.body);

    newRole.save((err, role) => {
        if(err){
            res.status(500).send(err);
        }
        res.status(201).json(role);
    });
}

exports.update = (req, res) => {
    const id = req.params.id;
    const roleUpdate = req.body;

    Role.findByIdAndUpdate(id, roleUpdate, {new: true}, (err, updatedRole) => {
        if(err){
            res.status(500).send(err);
        }
        if(updatedRole){
            res.status(200).json(updatedRole);
        }
        else{
            res.status(404).json({error: "Role not found"});
        }
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Role.findByIdAndDelete(id, (err, roleDeleted) => {
        if(err){
            res.status(500).send(err);
        }
        if(roleDeleted){
            res.status(200).json("ROLE REMOVED");
        }
        else{
            res.status(404).json({error: "Role not found"});
        }
    });
}
