const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Create a new user
    static async create(userData) {
        const { email, password, firstName, lastName, role = 'salesperson' } = userData;

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (email, password_hash, first_name, last_name, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, first_name, last_name, role, is_active, created_at
        `;

        const values = [email, passwordHash, firstName, lastName, role];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    // Find user by email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    // Find user by ID
    static async findById(id) {
        const query = `
            SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at
            FROM users
            WHERE id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Get all users
    static async findAll() {
        const query = `
            SELECT id, email, first_name, last_name, role, is_active, created_at
            FROM users
            ORDER BY first_name, last_name
        `;
        const result = await db.query(query);
        return result.rows;
    }

    // Verify password
    static async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    // Update user
    static async update(id, userData) {
        const { firstName, lastName, role, isActive } = userData;

        const query = `
            UPDATE users
            SET
                first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                role = COALESCE($3, role),
                is_active = COALESCE($4, is_active)
            WHERE id = $5
            RETURNING id, email, first_name, last_name, role, is_active
        `;

        const values = [firstName, lastName, role, isActive, id];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = User;
