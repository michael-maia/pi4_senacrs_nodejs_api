const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

//router.get('/', userController.tokenValidation, userController.showList);
router.get('/', userController.tokenValidation, userController.isAdmin, userController.showList);
//router.get('/search',userController.tokenValidation, userController.isAdmin, userController.search);
router.get('/:id', userController.tokenValidation, userController.isAdmin, userController.findById);
router.post('/', userController.create);
router.post('/login', userController.userValidation);
router.put('/:id', userController.tokenValidation, userController.isIdOwner, userController.update);
router.put('/role/:id', userController.tokenValidation, userController.isAdmin, userController.changeRole);
router.delete('/:id', userController.isAdmin, userController.delete);

module.exports = router;
