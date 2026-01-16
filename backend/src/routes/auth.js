const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

// Validation rules
const loginValidationRules = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
];

const registerValidationRules = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('role').optional().isIn(['admin', 'manager', 'salesperson']).withMessage('Invalid role')
];

// POST /api/auth/login - Login
router.post('/login', loginValidationRules, authController.login);

// POST /api/auth/register - Register new user (admin only)
router.post(
    '/register',
    authenticate,
    authorize('admin'),
    registerValidationRules,
    authController.register
);

// GET /api/auth/me - Get current user
router.get('/me', authenticate, authController.getCurrentUser);

// GET /api/auth/users - Get all users
router.get('/users', authenticate, authController.getAllUsers);

module.exports = router;
