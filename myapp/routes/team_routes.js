const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team_controller');
const userController = require('../controllers/user_controller');

router.get('/', teamController.showList);
//router.get('/search', teamController.search)
router.get('/:id', teamController.findById);
router.post('/', userController.tokenValidation, userController.isAdmin, teamController.create);
router.put('/:id', userController.tokenValidation, userController.isAdmin, teamController.update);
router.delete('/:id', userController.tokenValidation, userController.isAdmin, teamController.delete);

module.exports = router;
