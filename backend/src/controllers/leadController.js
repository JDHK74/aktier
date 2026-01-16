const Lead = require('../models/Lead');
const { validationResult } = require('express-validator');

// Get all leads
exports.getAllLeads = async (req, res, next) => {
    try {
        const {
            assignedTo,
            sourceId,
            quality,
            kommun,
            search,
            limit = 50,
            offset = 0
        } = req.query;

        const filters = {
            assignedTo,
            sourceId,
            quality,
            kommun,
            search,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };

        const leads = await Lead.findAll(filters);
        const total = await Lead.count(filters);

        res.json({
            success: true,
            data: leads,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: parseInt(offset) + leads.length < total
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get a single lead by ID
exports.getLeadById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findById(id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found'
            });
        }

        res.json({
            success: true,
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

// Create a new lead
exports.createLead = async (req, res, next) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const leadData = {
            sourceId: req.body.sourceId,
            assignedTo: req.body.assignedTo,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            postalCode: req.body.postalCode,
            city: req.body.city,
            kommun: req.body.kommun,
            quality: req.body.quality,
            notes: req.body.notes,
            externalId: req.body.externalId
        };

        const lead = await Lead.create(leadData);

        res.status(201).json({
            success: true,
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

// Update a lead
exports.updateLead = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if lead exists
        const existingLead = await Lead.findById(id);
        if (!existingLead) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found'
            });
        }

        const leadData = {
            sourceId: req.body.sourceId,
            assignedTo: req.body.assignedTo,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            postalCode: req.body.postalCode,
            city: req.body.city,
            kommun: req.body.kommun,
            quality: req.body.quality,
            notes: req.body.notes,
            lastContactedAt: req.body.lastContactedAt
        };

        const updatedLead = await Lead.update(id, leadData);

        res.json({
            success: true,
            data: updatedLead
        });
    } catch (error) {
        next(error);
    }
};

// Delete a lead
exports.deleteLead = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedLead = await Lead.delete(id);

        if (!deletedLead) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found'
            });
        }

        res.json({
            success: true,
            message: 'Lead deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get lead statistics
exports.getLeadStats = async (req, res, next) => {
    try {
        const { assignedTo } = req.query;

        const stats = {
            total: await Lead.count({ assignedTo }),
            hot: await Lead.count({ assignedTo, quality: 'hot' }),
            warm: await Lead.count({ assignedTo, quality: 'warm' }),
            cold: await Lead.count({ assignedTo, quality: 'cold' })
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};
