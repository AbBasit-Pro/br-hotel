const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public
router.post('/login', authController.login);
router.post('/register-admin-manager',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['admin', 'Manager'])
  ],
  authController.registerAdminManager
);

// Protected
router.post('/logout', authMiddleware, authController.logout);

// admin/Manager only to create receptionist
router.post('/register-receptionist', authMiddleware, roleMiddleware('admin', 'Manager'), authController.registerReceptionist);

module.exports = router;
