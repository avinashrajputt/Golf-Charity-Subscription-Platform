import { NextRequest, NextResponse } from 'next/server';
import { DrawEngine } from '@/lib/draw-engine';

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
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Get all active subscribers' scores
  const { data: users } = await supabaseServer
    .from('users')
    .select('id')
    .eq('subscription_status', 'active');

  if (!users || users.length === 0) {
    return NextResponse.json(
      { error: 'No active subscribers' },
      { status: 400 }
    );
  }

  // Fetch scores for algorithmic draw
  const userIds = users.map((u) => u.id);
  const { data: userScores } = await supabaseServer
    .from('golf_scores')
    .select('user_id, score')
    .in('user_id', userIds);

  const scoresByUser = userIds.map((userId) =>
    (userScores || []).filter((s) => s.user_id === userId)
  );

  // Generate draw numbers
  const drawnNumbers = DrawEngine.generateAlgorithmicDraw(scoresByUser as any, 5);

  // Store draw in database
  const { data: draw, error } = await supabaseServer
    .from('draws')
    .insert([
      {
        month,
        year,
        status: 'simulated',
        draw_type: 'algorithmic',
        drawn_numbers: drawnNumbers,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    draw,
    userCount: users.length,
    drawnNumbers,
  });
}

async function publishDraw() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Get the generated draw
  const { data: draw, error: drawError } = await supabaseServer
    .from('draws')
    .select('*')
    .eq('month', month)
    .eq('year', year)
    .eq('status', 'simulated')
    .single();

  if (drawError || !draw) {
    return NextResponse.json(
      { error: 'No simulated draw found' },
      { status: 400 }
    );
  }

  // Get all active subscribers
  const { data: users } = await supabaseServer
    .from('users')
    .select('id')
    .eq('subscription_status', 'active');

  if (!users) {
    return NextResponse.json(
      { error: 'No subscribers found' },
      { status: 400 }
    );
  }

  // Check each subscriber's scores against drawn numbers
  const winners: any[] = [];

  for (const user of users) {
    const { data: scores } = await supabaseServer
      .from('golf_scores')
      .select('score')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5);

    if (!scores || scores.length === 0) continue;

    const userScores = scores.map((s) => s.score);
    const matchCount = DrawEngine.calculateMatches(userScores, draw.drawn_numbers);
    const matchType = DrawEngine.getMatchType(matchCount);

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
  const prizeDistribution = DrawEngine.calculatePrizeDistribution(totalSubscribers, monthlyFee);

  // Insert winners and create prize pools
  for (const matchType of ['5-match', '4-match', '3-match']) {
    const matchWinners = winners.filter((w) => w.match_type === matchType);
    if (matchWinners.length === 0) continue;

    const totalPrize = prizeDistribution[matchType as keyof typeof prizeDistribution];
    const prizePerWinner = DrawEngine.calculatePrizePerWinner(totalPrize, matchWinners.length);

    // Insert winners with prize amounts
    await supabaseServer.from('draw_winners').insert(
      matchWinners.map((w) => ({
        ...w,
        prize_amount: prizePerWinner,
      }))
    );

    // Create prize pool record
    await supabaseServer.from('prize_pools').insert([
      {
        draw_id: draw.id,
        match_type: matchType,
        total_amount: totalPrize,
        winners_count: matchWinners.length,
        amount_per_winner: prizePerWinner,
      },
    ]);
  }

  // Update draw status
  await supabaseServer
    .from('draws')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', draw.id);

  return NextResponse.json({
    draw: { ...draw, status: 'published' },
    winnersCount: winners.length,
  });
}
