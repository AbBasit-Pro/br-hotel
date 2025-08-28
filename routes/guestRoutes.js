const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', guestController.index);
router.post('/', guestController.uploadMiddleware, guestController.store);
router.get('/:id', guestController.show);
router.put('/:id', guestController.uploadMiddleware, guestController.update);
router.delete('/:id', guestController.destroy);

module.exports = router;
