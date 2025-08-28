const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', reservationController.index);
router.post('/', reservationController.store);
router.get('/:id', reservationController.show);
router.put('/:id', reservationController.update);
router.delete('/:id', reservationController.destroy);

module.exports = router;
