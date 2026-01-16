const db = require('../config/database');

class LeadSource {
    // Create a new lead source
    static async create(sourceData) {
        const { name, type, description } = sourceData;

        const query = `
            INSERT INTO lead_sources (name, type, description)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const values = [name, type, description || null];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    // Get all lead sources
    static async findAll(includeInactive = false) {
        let query = 'SELECT * FROM lead_sources';

        if (!includeInactive) {
            query += ' WHERE is_active = true';
        }

        query += ' ORDER BY name';

        const result = await db.query(query);
        return result.rows;
    }

    // Get a single lead source by ID
    static async findById(id) {
        const query = 'SELECT * FROM lead_sources WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Update a lead source
    static async update(id, sourceData) {
        const { name, type, description, isActive } = sourceData;

        const query = `
            UPDATE lead_sources
            SET
                name = COALESCE($1, name),
                type = COALESCE($2, type),
                description = COALESCE($3, description),
                is_active = COALESCE($4, is_active)
            WHERE id = $5
            RETURNING *
        `;

        const values = [name, type, description, isActive, id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    // Delete a lead source
    static async delete(id) {
        const query = 'DELETE FROM lead_sources WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = LeadSource;
