const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var mongoose = require('mongoose');
const { response } = require('express');

exports.showList = (req, res) => {
    User.find({}, (err, users) => {
        if(err){
            res.status(500).send({error: "Request error!"});
        }
        res.status(200).json(
                users.map((user) => {return ({id: user.id, fullName: user.fullName, email: user.email});
            })
        );
    })
}

exports.findById = (req, res) => {
    const id = req.params.id;
    User.findById(id, (err, user) => {
        if(err){
            res.status(500).send({error: "Request error!"});
        }
        if(user){
            res.status(200).json(user);
        }
        else{
            res.status(404).json({error: "User not found"});
        }
    });
}

exports.create = (req, res) => {
    let newUser = new User(req.body);
    if(!newUser || !newUser.fullName || !newUser.email || !newUser.password){
        res.status(400).send({error: "JSON parameters cannot be Null or Empty"});
    }
    else{
        // Atribuindo automaticamente o role de Visitante
        newUser.role = "615f7584a673d7ff7d2bfc42";
        // Encriptando a senha do usuario antes de adicionar no banco de dados
        newUser.password = bcrypt.hashSync(req.body.password, 10);
        newUser.save((err, user) => {
            if(err){
                res.status(500).send({error: "Request error!"});
            }
            res.status(201).send(user);
        });
    }
}

exports.update = (req, res) => {
    const id = req.params.id;
    const userUpdate = req.body;
    if(!userUpdate || !userUpdate.fullName || !userUpdate.email || !userUpdate.password){
        res.status(400).send({error: "JSON parameters cannot be Null or Empty"});
    }
    else{
        // Se o usuario alterar a senha, ela deve ser encriptada novamente
        if(req.body.password){
            userUpdate.password = bcrypt.hashSync(req.body.password, 10);
        }
        User.findByIdAndUpdate(id, userUpdate, {new: true}, (err, updatedUser) => {
            if(err){
                res.status(500).send({error: "Request error!"});
            }
            if(updatedUser){
                res.status(200).json(updatedUser);
            }
            else{
                res.status(404).json({error: 'User not found'});
            }
        });
    }
}

exports.delete = (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id, (err, userDeleted) => {
        if(err) {
            res.status(500).send({error: "Request error!"});
        }
        if(userDeleted) {
            res.status(200).json(userDeleted);
        }
        else {
            res.status(404).json({error: 'User not found'});
        }
    })
}

/* exports.search = (req, res) => {
    if(req.query && req.query.fullName){
        const paramName = req.query.fullName;
        User.findOne({fullName: paramName}, (err, user) => {
            if(err) {
                res.status(500).send(err);
            }
            if(user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({error: 'User not found'});
            }
        });
    }
    else{
        res.status(404).json({error: 'Parameter "fullName" is missing'});
    }
} */

exports.userValidation = (req, res) => {
    if(req.body && req.body.email && req.body.password) {
        const userEmail = req.body.email;
        const userPassword = req.body.password;

        User.findOne({email: userEmail}, (err, user) => {
            if(err){
                res.status(500).send({error: "Request error!"});
            }
            // Comparando a senha inserida com a cadastrada no banco de dados
            if(user && bcrypt.compareSync(userPassword, user.password)) {
                // Depois de comparar, sera retornado um token com tempo de expiracao de 1 hora
                const token = jwt.sign({
                    id: user.id
                }, 'Sen@crs', {expiresIn: '1h'});
                res.status(201).json({token: token});
            }
            else{
                res.status(401).json({error: 'Invalid user or password'})
            }
        });
    }
    else{
        res.status(401).json({error: 'Invalid user or password'})
    }
}

exports.tokenValidation = (req, res, next) => {
    // Vem do header da requisição
    const token = req.get('x-auth-token');
    if(!token){
        res.status(401).json({error: 'Invalid token'});
    }
    else{
        // Verifica o token baseado na nossa chave-secreta
        jwt.verify(token, 'Sen@crs', (err, payload) => {
            if(err){
                res.status(401).json({error: 'Invalid token'});
            }
            // Estando tudo OK, ele passa para o proxima etapa do codigo
            else{
                next();
            }
        });
    }
}

exports.isAdmin = (req, res, next) => {
    const token = req.get('x-auth-token');
    if(!token){
        res.status(401).json({error: "Can't access."});
    }
    else{
        jwt.verify(token, 'Sen@crs', (err, payload) => {
            if(err){
                res.status(500).send({error: "Request error!"});
            }
            else{
                const user = User.findOne({_id: payload.id}).populate('role').
                exec((err, user) => {
                    if(err){
                        res.status(500).send({error: "Request error!"});
                    }
                    if(user.role.name === 'Admin'){
                        console.log(("ADMIN OK"));
                        next();
                    }
                    else{
                        res.status(403).json({error: "Can't access."});
                    }
                })
            }
        });
    }
}

exports.isIdOwner = (req, res, next) => {
    const id = req.params.id;
    const token = req.get('x-auth-token');
    if(!token){
        res.status(400).json({error: "Invalid token"});
    }
    else{
        jwt.verify(token, 'Sen@crs', (err, payload) => {
            if(err){
                res.status(500).send({error: "Request error!"});
            }
            else{
                if(id == payload.id){
                    next();
                }
                else{
                    res.status(403).json({error: "Can't access."});
                }
            }
        });
    }
}

exports.changeRole = (req, res) => {
    const userId = req.params.id;
    const roleId = req.body.roleId;

    //userUpdate = User.findById(userId);
    //userUpdate.role = roleId;
    User.updateOne({_id: userId}, {
        role: roleId
    }, function(err, affected, resp) {
        res.status(200).json({success: "Role updated"});
        console.log(resp);
    })
    /* User.findByIdAndUpdate(userId, userUpdate, {new: true}, (err, updatedUser) => {
        if(err){
            res.status(500).send(err);
        }
        if(updatedUser){
            res.status(200).json(updatedUser);
        }
        else{
            res.status(404).json({error: 'User not found'});
        }
    }); */
}

/* exports.isModerator = (req, res, next) => {
    const token = req.get('x-auth-token');
    if(!token){
        res.status(401).json({error: "Can't access."});
    }
    else{
        jwt.verify(token, 'Sen@crs', (err, payload) => {
            if(err){
                res.status(500).send(err);
            }
            else{
                const user = User.findOne({_id: payload.id}).populate('role').
                exec((err, user) => {
                    if(err){
                        res.status(500).send(err);
                    }
                    if(user.role.name === 'Moderator'){
                        next();
                    }
                    else{
                        res.status(403).json({error: "Can't access."});
                    }
                })
            }
        });
    }
} */
