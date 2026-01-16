const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const leadController = require('../controllers/leadController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Validation rules for creating/updating leads
const leadValidationRules = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('phone').optional().trim(),
    body('quality').optional().isIn(['hot', 'warm', 'cold']).withMessage('Invalid quality value')
];

// GET /api/leads - Get all leads
router.get('/', leadController.getAllLeads);

// GET /api/leads/stats - Get lead statistics
router.get('/stats', leadController.getLeadStats);

// GET /api/leads/:id - Get a single lead
router.get('/:id', leadController.getLeadById);

// POST /api/leads - Create a new lead
router.post('/', leadValidationRules, leadController.createLead);

// PUT /api/leads/:id - Update a lead
router.put('/:id', leadController.updateLead);

// DELETE /api/leads/:id - Delete a lead
router.delete('/:id', leadController.deleteLead);

module.exports = router;
