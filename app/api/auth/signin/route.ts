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
      'SELECT id, email, password_hash, full_name, role, subscription_status, charity_percentage, created_at, updated_at FROM users WHERE email = $1',
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
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      subscription_status: user.subscription_status,
      charity_percentage: user.charity_percentage || 50,
      created_at: user.created_at?.toISOString?.() || new Date().toISOString(),
      updated_at: user.updated_at?.toISOString?.() || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Sign in failed' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
