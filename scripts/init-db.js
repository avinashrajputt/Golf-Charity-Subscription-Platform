const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Creating database tables...');
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        full_name VARCHAR(255),
        phone VARCHAR(20),
        role VARCHAR(50) DEFAULT 'user',
        subscription_status VARCHAR(50) DEFAULT 'inactive',
        subscription_plan VARCHAR(50),
        charity_id UUID,
        charity_contribution_percentage INTEGER DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS charities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url VARCHAR(500),
        website VARCHAR(255),
        total_raised DECIMAL(12, 2) DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Charities table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        plan VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        renew_date TIMESTAMP,
        cancel_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Subscriptions table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES subscriptions(id),
        stripe_payment_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Payments table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS golf_scores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        score INTEGER NOT NULL,
        course_name VARCHAR(255),
        date_played DATE,
        stableford_points INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Golf Scores table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS draws (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        draw_month DATE NOT NULL,
        draw_numbers INTEGER[] NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        prize_pool DECIMAL(12, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Draws table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS draw_winners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        matched_numbers INTEGER DEFAULT 0,
        prize_amount DECIMAL(10, 2) DEFAULT 0,
        payment_status VARCHAR(50) DEFAULT 'pending',
        verified BOOLEAN DEFAULT FALSE,
        verification_proof_url VARCHAR(500),
        payment_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Draw Winners table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS prize_pools (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
        match_type VARCHAR(50),
        percentage DECIMAL(5, 2),
        amount DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Prize Pools table created');
    
    // Insert sample charities
    console.log('\nInserting sample data...');
    
    const result = await client.query(`
      INSERT INTO charities (name, description, logo_url, website, total_raised, featured) VALUES
      ('Cancer Research Institute', 'Leading the world in immunotherapy research', 'https://images.unsplash.com/photo-1576091160550-112173f7f8db?w=200&h=200&fit=crop', 'https://www.cancerresearch.org', 125000, true),
      ('Children''s Hospital Foundation', 'Providing world-class care to children worldwide', 'https://images.unsplash.com/photo-1576091160397-112173f7f8db?w=200&h=200&fit=crop', 'https://www.childrenshospital.org', 89500, true),
      ('Environmental Conservation Fund', 'Protecting our planet for future generations', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop', 'https://www.envconservation.org', 156200, true),
      ('Education for All', 'Making quality education accessible to every child', 'https://images.unsplash.com/photo-1427504494785-cdff9a6f34c6?w=200&h=200&fit=crop', 'https://www.educationforall.org', 98700, true),
      ('Mental Health Alliance', 'Breaking stigma and improving mental health awareness', 'https://images.unsplash.com/photo-1576091160550-2173337f9d45?w=200&h=200&fit=crop', 'https://www.mentalhealthalliance.org', 67300, true)
      ON CONFLICT DO NOTHING
      RETURNING id, name;
    `);
    
    console.log(`✓ Inserted ${result.rows.length} charities:`, result.rows.map(r => r.name).join(', '));
    
    console.log('\n✅ Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

initializeDatabase();
