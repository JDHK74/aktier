const db = require('../config/database');

class Lead {
    // Create a new lead
    static async create(leadData) {
        const {
            sourceId,
            assignedTo,
            firstName,
            lastName,
            email,
            phone,
            address,
            postalCode,
            city,
            kommun,
            quality,
            notes,
            externalId
        } = leadData;

        const query = `
            INSERT INTO leads (
                source_id, assigned_to, first_name, last_name, email, phone,
                address, postal_code, city, kommun, quality, notes, external_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *
        `;

        const values = [
            sourceId || null,
            assignedTo || null,
            firstName,
            lastName,
            email || null,
            phone || null,
            address || null,
            postalCode || null,
            city || null,
            kommun || null,
            quality || null,
            notes || null,
            externalId || null
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    // Get all leads with optional filters
    static async findAll(filters = {}) {
        let query = `
            SELECT
                l.*,
                ls.name as source_name,
                ls.type as source_type,
                u.first_name as assigned_first_name,
                u.last_name as assigned_last_name,
                u.email as assigned_email
            FROM leads l
            LEFT JOIN lead_sources ls ON l.source_id = ls.id
            LEFT JOIN users u ON l.assigned_to = u.id
            WHERE 1=1
        `;

        const values = [];
        let paramCount = 1;

        // Apply filters
        if (filters.assignedTo) {
            query += ` AND l.assigned_to = $${paramCount}`;
            values.push(filters.assignedTo);
            paramCount++;
        }

        if (filters.sourceId) {
            query += ` AND l.source_id = $${paramCount}`;
            values.push(filters.sourceId);
            paramCount++;
        }

        if (filters.quality) {
            query += ` AND l.quality = $${paramCount}`;
            values.push(filters.quality);
            paramCount++;
        }

        if (filters.kommun) {
            query += ` AND l.kommun ILIKE $${paramCount}`;
            values.push(`%${filters.kommun}%`);
            paramCount++;
        }

        if (filters.search) {
            query += ` AND (
                l.first_name ILIKE $${paramCount} OR
                l.last_name ILIKE $${paramCount} OR
                l.email ILIKE $${paramCount} OR
                l.phone ILIKE $${paramCount}
            )`;
            values.push(`%${filters.search}%`);
            paramCount++;
        }

        query += ' ORDER BY l.created_at DESC';

        // Pagination
        if (filters.limit) {
            query += ` LIMIT $${paramCount}`;
            values.push(filters.limit);
            paramCount++;
        }

        if (filters.offset) {
            query += ` OFFSET $${paramCount}`;
            values.push(filters.offset);
            paramCount++;
        }

        const result = await db.query(query, values);
        return result.rows;
    }

    // Get a single lead by ID
    static async findById(id) {
        const query = `
            SELECT
                l.*,
                ls.name as source_name,
                ls.type as source_type,
                u.first_name as assigned_first_name,
                u.last_name as assigned_last_name,
                u.email as assigned_email
            FROM leads l
            LEFT JOIN lead_sources ls ON l.source_id = ls.id
            LEFT JOIN users u ON l.assigned_to = u.id
            WHERE l.id = $1
        `;

        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Update a lead
    static async update(id, leadData) {
        const {
            sourceId,
            assignedTo,
            firstName,
            lastName,
            email,
            phone,
            address,
            postalCode,
            city,
            kommun,
            quality,
            notes,
            lastContactedAt
        } = leadData;

        const query = `
            UPDATE leads
            SET
                source_id = COALESCE($1, source_id),
                assigned_to = COALESCE($2, assigned_to),
                first_name = COALESCE($3, first_name),
                last_name = COALESCE($4, last_name),
                email = COALESCE($5, email),
                phone = COALESCE($6, phone),
                address = COALESCE($7, address),
                postal_code = COALESCE($8, postal_code),
                city = COALESCE($9, city),
                kommun = COALESCE($10, kommun),
                quality = COALESCE($11, quality),
                notes = COALESCE($12, notes),
                last_contacted_at = COALESCE($13, last_contacted_at)
            WHERE id = $14
            RETURNING *
        `;

        const values = [
            sourceId,
            assignedTo,
            firstName,
            lastName,
            email,
            phone,
            address,
            postalCode,
            city,
            kommun,
            quality,
            notes,
            lastContactedAt,
            id
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    // Delete a lead
    static async delete(id) {
        const query = 'DELETE FROM leads WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Get lead count by filters
    static async count(filters = {}) {
        let query = 'SELECT COUNT(*) FROM leads WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (filters.assignedTo) {
            query += ` AND assigned_to = $${paramCount}`;
            values.push(filters.assignedTo);
            paramCount++;
        }

        if (filters.quality) {
            query += ` AND quality = $${paramCount}`;
            values.push(filters.quality);
            paramCount++;
        }

        const result = await db.query(query, values);
        return parseInt(result.rows[0].count);
    }
}

module.exports = Lead;
