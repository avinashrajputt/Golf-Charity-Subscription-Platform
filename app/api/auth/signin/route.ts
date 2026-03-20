import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const userResult = await client.query(
      'SELECT id, email, password_hash, full_name, role, subscription_status, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data (without password hash)
    const createdAt = user.created_at instanceof Date 
      ? user.created_at.toISOString() 
      : (typeof user.created_at === 'string' ? user.created_at : new Date().toISOString());
    
    const updatedAt = user.updated_at instanceof Date 
      ? user.updated_at.toISOString() 
      : (typeof user.updated_at === 'string' ? user.updated_at : new Date().toISOString());

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      subscription_status: user.subscription_status,
      charity_percentage: user.charity_percentage || 50,
      created_at: createdAt,
      updated_at: updatedAt,
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Sign in failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
