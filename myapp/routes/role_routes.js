const express = require('express');
const routes = express.Router();
const roleController = require('../controllers/role_controller');
const userController = require('../controllers/user_controller');
const router = require('./team_routes');

router.get('/', roleController.showList);
router.post('/', roleController.create);
router.put('/', roleController.update);
router.delete('/', roleController.delete);

module.exports = router;
