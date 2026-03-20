const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seedUsers() {
  const client = await pool.connect();
  
  try {
    console.log('Creating test users...\n');
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    // Insert test users
    const result = await client.query(`
      INSERT INTO users (email, password_hash, full_name, role, subscription_status) VALUES
      ('admin@golf.com', $1, 'Admin User', 'admin', 'active'),
      ('user@golf.com', $2, 'Test User', 'user', 'active')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING email, role, full_name;
    `, [adminPassword, userPassword]);
    
    console.log('✅ Test Users Created:\n');
    result.rows.forEach(row => {
      console.log(`  • ${row.email}`);
      console.log(`    Role: ${row.role}`);
      console.log(`    Name: ${row.full_name}\n`);
    });
    
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
  } finally {
    client.release();
    pool.end();
  }
}

seedUsers();
