const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.showList = (req, res) => {
    User.find({}, (err, users) => {
        if(err){
            res.status(500).send(err);
        }
        res.status(200).json(
            users.map((user) => {return({id: user.id, fullName: user.fullName, email: user.email});
            })
        );
    })
}

exports.findById = (req, res) => {
    const id = req.params.id;
    User.findById(id, (err, user) => {
        if(err){
            res.status(500).send(err);
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
    // Encriptando a senha do usuario antes de adicionar no banco de dados
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    newUser.save((err, user) => {
        if(err){
            res.status(500).send(err);
        }
        res.status(201).json(newUser);
    });
}

exports.update = (req, res) => {
    const id = req.params.id;
    const userUpdate = req.body;
    // Se o usuario alterar a senha, ela deve ser encriptada novamente
    if(req.body.password){
        userUpdate.password = bcrypt.hashSync(req.body.password, 10);
    }
    User.findByIdAndUpdate(id, userUpdate, {new: true}, (err, updatedUser) => {
        if(err){
            res.status(500).send(err);
        }
        if(updatedUser){
            res.status(200).json(updatedUser);
        }
        else{
            res.status(404).json({error: 'User not found'});
        }
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id, (err, userDeleted) => {
        if(err) {
            res.status(500).send(err);
        }
        if(userDeleted) {
            res.status(200).json(userDeleted);
        }
        else {
            res.status(404).json({error: 'User not found'});
        }
    })
}

exports.search = (req, res) => {
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
}

exports.userValidation = (req, res) => {
    if(req.body && req.body.email && req.body.password) {
        const userEmail = req.body.email;
        const userPassword = req.body.password;

        User.findOne({email: userEmail}, (err, user) => {
            if(err){
                res.status(500).send(err);
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
                console.log('Payload: '+JSON.stringify(payload));
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
                res.status(500).send(err);
            }
            else{
                const user = User.findOne({_id: payload.id}).populate('role').
                exec((err, user) => {
                    if(err){
                        res.status(500).send(err);
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
