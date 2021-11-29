const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver_controller');
const userController = require('../controllers/user_controller');

router.get('/', driverController.showList);
//router.get('/search', driverController.search);
router.get('/showTeams', driverController.showTeams);
router.get('/:id', driverController.findById);
//router.post('/', userController.tokenValidation, userController.isAdmin, driverController.create);
router.post('/', driverController.create);
router.put('/:id', userController.tokenValidation, userController.isAdmin, driverController.update);
router.delete('/:id', userController.tokenValidation, userController.isAdmin, driverController.delete);

module.exports = router;
