const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', roomController.index);
router.post('/', roomController.store);
router.get('/:id', roomController.show);
router.put('/:id', roomController.update);
router.delete('/:id', roomController.destroy);

module.exports = router;
