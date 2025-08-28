const express = require('express');
const router = express.Router();
const guestHistoryController = require('../controllers/guestHistoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', guestHistoryController.index);
router.post('/', guestHistoryController.store);
router.get('/:id', guestHistoryController.show);
router.put('/:id', guestHistoryController.update);
router.delete('/:id', guestHistoryController.destroy);

module.exports = router;
