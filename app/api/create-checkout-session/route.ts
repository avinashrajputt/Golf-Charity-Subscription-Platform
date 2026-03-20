import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICING = {
  monthly: 999,
  yearly: 9999,
};

export async function POST(request: NextRequest) {
  try {
    const { planType } = await request.json();

    if (!['monthly', 'yearly'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Golf Charity ${planType === 'monthly' ? 'Monthly' : 'Annual'} Subscription`,
              description: 'Support charities while tracking golf scores',
            },
            unit_amount: PRICING[planType as keyof typeof PRICING],
            recurring: {
              interval: planType === 'monthly' ? 'month' : 'year',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/onboarding/subscription`,
      metadata: {
        user_id: session.user.id,
        plan_type: planType,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
