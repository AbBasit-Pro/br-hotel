const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', paymentController.index);
router.post('/', paymentController.store);
router.get('/:id', paymentController.show);
router.put('/:id', paymentController.update);
router.delete('/:id', paymentController.destroy);

module.exports = router;
