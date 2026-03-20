import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        id, 
        name, 
        description, 
        logo_url, 
        website, 
        total_raised, 
        featured, 
        created_at, 
        updated_at 
      FROM charities 
      ORDER BY featured DESC, name ASC
    `);
    
    const charities = result.rows.map(row => ({
      ...row,
      total_raised: parseFloat(row.total_raised),
    }));
    
    return NextResponse.json(charities);
  } catch (error) {
    console.error('Error fetching charities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charities' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
