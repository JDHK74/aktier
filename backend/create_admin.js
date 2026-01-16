const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

async function createAdmin() {
    try {
        // Generate password hash
        const passwordHash = await bcrypt.hash('admin123', 10);
        console.log('Generated password hash for admin123');

        // Check if admin exists
        const checkResult = await pool.query(
            "SELECT * FROM users WHERE email = 'admin@villabatteri.se'"
        );

        if (checkResult.rows.length > 0) {
            // Update existing admin
            await pool.query(
                "UPDATE users SET password_hash = $1 WHERE email = 'admin@villabatteri.se'",
                [passwordHash]
            );
            console.log('✓ Updated admin user password');
        } else {
            // Create new admin
            await pool.query(
                `INSERT INTO users (email, password_hash, first_name, last_name, role)
                 VALUES ($1, $2, $3, $4, $5)`,
                ['admin@villabatteri.se', passwordHash, 'Admin', 'User', 'admin']
            );
            console.log('✓ Created admin user');
        }

        console.log('\nAdmin credentials:');
        console.log('Email: admin@villabatteri.se');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

createAdmin();
