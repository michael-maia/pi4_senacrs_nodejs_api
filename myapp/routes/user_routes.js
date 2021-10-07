const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

//router.get('/', userController.tokenValidation, userController.showList);
router.get('/', userController.isAdmin, userController.showList);
router.get('/search',userController.search);
router.get('/:id', userController.findById)
router.post('/', userController.create)
router.post('/login', userController.userValidation)
router.put('/:id', userController.update)
router.delete('/:id', userController.delete)

module.exports = router;
