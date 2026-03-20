'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { PRICING, createCheckoutSession, getStripe } from '@/lib/stripe';

export default function SubscriptionPlanPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
    setLoading(true);

    try {
      if (user) {
        const { sessionId } = await createCheckoutSession(plan);
        const stripe = await getStripe();
        
        if (!stripe) throw new Error('Stripe failed to load');
        
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw error;
      } else {
        alert('Please sign up first to continue with your subscription');
        router.push('/auth/signup');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to initiate checkout. Please try again.');
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-primary py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Choose Your Plan</h1>
          <p className="text-gray-400">Start tracking scores and winning prizes today</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {[
            {
              plan: 'monthly',
              name: 'Monthly',
              price: PRICING.monthly,
              benefits: [
                'Latest 5 scores tracking',
                'Monthly draw entries',
                '10-100% to charity',
                'Email notifications',
              ],
            },
            {
              plan: 'yearly',
              name: 'Annual',
              price: PRICING.yearly,
              benefits: [
                'Everything in Monthly',
                '17% savings vs monthly',
                'Exclusive perks',
                'Priority support',
              ],
            },
          ].map(({ plan, name, price, benefits }) => (
            <div
              key={plan}
              className={`rounded-xl border-2 p-8 transition-all ${
                selectedPlan === plan
                  ? 'border-accent bg-accent/10'
                  : 'border-gray-700'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{name}</h3>
              <div className="text-4xl font-bold mb-6">
                ${price}
                <span className="text-lg text-gray-400">{plan === 'monthly' ? '/month' : '/year'}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <span className="text-accent mr-3">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan as 'monthly' | 'yearly')}
                disabled={loading && selectedPlan === plan}
                className={`w-full py-3 rounded-lg font-bold transition-colors ${
                  selectedPlan === plan
                    ? 'bg-accent text-primary hover:bg-blue-600'
                    : 'border-2 border-accent text-accent hover:bg-accent hover:text-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading && selectedPlan === plan ? 'Processing...' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-secondary rounded-xl p-6 text-center text-gray-400">
          <p className="text-sm">
            You can cancel your subscription anytime. No lock-in contract.
          </p>
        </div>
      </div>
    </div>
  );
}
