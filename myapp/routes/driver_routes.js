const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver_controller')

router.get('/', driverController.showList)
router.get('/search', driverController.search)
router.get('/:id', driverController.findById)
router.post('/', driverController.create)
router.put('/:id', driverController.update)
router.delete('/:id', driverController.delete)

module.exports = router;
