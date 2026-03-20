const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function verify() {
  const client = await pool.connect();
  
  try {
    // Get all tables
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    // Get charities
    const charities = await client.query(`
      SELECT id, name, total_raised FROM charities ORDER BY name
    `);
    
    // Get users
    const users = await client.query(`SELECT COUNT(*) as count FROM users`);
    
    console.log('\n📊 Database Tables:');
    tables.rows.forEach(r => console.log(`  • ${r.table_name}`));
    
    console.log('\n🎗️  Sample Charities:');
    charities.rows.forEach(r => {
      console.log(`  • ${r.name} ($${parseFloat(r.total_raised).toLocaleString()} raised)`);
    });
    
    console.log(`\n👥 Total Users: ${users.rows[0].count}`);
    console.log('\n✅ Database verification complete!');
    
  } catch (error) {
    console.error('❌ Verification error:', error.message);
  } finally {
    client.release();
    pool.end();
  }
}

verify();
