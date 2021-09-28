const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team_controller')

router.get('/', teamController.showList)
router.get('/search', teamController.search)
router.get('/:id', teamController.findById)
router.post('/', teamController.create)
router.put('/:id', teamController.update)
router.delete('/:id', teamController.delete)

module.exports = router;
