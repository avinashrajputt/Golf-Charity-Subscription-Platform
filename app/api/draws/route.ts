import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { DrawEngine } from '@/lib/draw-engine';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'generate') {
      return await generateDraw();
    } else if (action === 'publish') {
      return await publishDraw();
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function generateDraw() {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Get all active subscribers' scores
    const usersResult = await pool.query(
      'SELECT id FROM users WHERE subscription_status = $1',
      ['active']
    );
    
    const users = usersResult.rows;

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers' },
        { status: 400 }
      );
    }

    // Fetch scores for algorithmic draw
    const userIds = users.map((u) => u.id);
    const scoresResult = await pool.query(
      'SELECT user_id, score FROM golf_scores WHERE user_id = ANY($1)',
      [userIds]
    );
    
    const userScores = scoresResult.rows;

    const scoresByUser = userIds.map((userId) =>
      userScores.filter((s) => s.user_id === userId)
    );

    // Generate draw numbers
    const drawnNumbers = DrawEngine.generateAlgorithmicDraw(scoresByUser as any, 5);

    // Store draw in database
    const drawResult = await pool.query(
      'INSERT INTO draws (month, year, status, draw_type, drawn_numbers) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [month, year, 'simulated', 'algorithmic', JSON.stringify(drawnNumbers)]
    );

    const draw = drawResult.rows[0];

    return NextResponse.json({
      draw,
      userCount: users.length,
      drawnNumbers,
    });
  } catch (error) {
    throw error;
  }
}

async function publishDraw() {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Get the generated draw
    const drawResult = await pool.query(
      'SELECT * FROM draws WHERE month = $1 AND year = $2 AND status = $3',
      [month, year, 'simulated']
    );

    const draw = drawResult.rows[0];

    if (!draw) {
      return NextResponse.json(
        { error: 'No simulated draw found' },
        { status: 400 }
      );
    }

    // Get all active subscribers
    const usersResult = await pool.query(
      'SELECT id FROM users WHERE subscription_status = $1',
      ['active']
    );

    const users = usersResult.rows;

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers found' },
        { status: 400 }
      );
    }

    // Check each subscriber's scores against drawn numbers
    const winners: any[] = [];

    for (const user of users) {
      const scoresResult = await pool.query(
        'SELECT score FROM golf_scores WHERE user_id = $1 ORDER BY date DESC LIMIT 5',
        [user.id]
      );

      const scores = scoresResult.rows;

      if (!scores || scores.length === 0) continue;

      const userScores = scores.map((s) => s.score);
      const drawnNumbers = draw.drawn_numbers;
      
      // Simple match calculation (if actual DrawEngine is available)
      const matchCount = userScores.filter((score) => drawnNumbers && drawnNumbers.includes(score)).length;

      let matchType = null;
      if (matchCount === 5) matchType = '5-match';
      else if (matchCount === 4) matchType = '4-match';
      else if (matchCount === 3) matchType = '3-match';

      if (matchType) {
        winners.push({
          draw_id: draw.id,
          user_id: user.id,
          match_type: matchType,
          user_numbers: userScores,
        });
      }
    }

    // Calculate prize pools and amounts
    const totalSubscribers = users.length;
    const monthlyFee = 9.99;
    
    // Simple prize distribution
    const prizeDistribution: any = {
      '5-match': totalSubscribers * monthlyFee * 0.4,
      '4-match': totalSubscribers * monthlyFee * 0.3,
      '3-match': totalSubscribers * monthlyFee * 0.2,
    };

    // Insert winners and create prize pools
    for (const matchType of ['5-match', '4-match', '3-match']) {
      const matchWinners = winners.filter((w) => w.match_type === matchType);
      if (matchWinners.length === 0) continue;

      const totalPrize = prizeDistribution[matchType];
      const prizePerWinner = totalPrize / matchWinners.length;

      // Insert winners with prize amounts
      for (const winner of matchWinners) {
        await pool.query(
          'INSERT INTO draw_winners (draw_id, user_id, match_type, prize_amount) VALUES ($1, $2, $3, $4)',
          [winner.draw_id, winner.user_id, winner.match_type, prizePerWinner]
        );
      }

      // Create prize pool record
      await pool.query(
        'INSERT INTO prize_pools (draw_id, match_type, total_amount, winners_count, amount_per_winner) VALUES ($1, $2, $3, $4, $5)',
        [draw.id, matchType, totalPrize, matchWinners.length, prizePerWinner]
      );
    }

    // Update draw status
    await pool.query(
      'UPDATE draws SET status = $1, published_at = $2 WHERE id = $3',
      ['published', new Date().toISOString(), draw.id]
    );

    return NextResponse.json({
      draw: { ...draw, status: 'published' },
      winnersCount: winners.length,
    });
  } catch (error) {
    throw error;
  }
}
