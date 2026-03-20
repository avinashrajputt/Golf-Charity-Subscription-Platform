'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [step, setStep] = useState<'check' | 'choose' | 'setup'>('check');

  useEffect(() => {
    if (!user) {
      setStep('choose');
    } else {
      setStep('setup');
    }
  }, [user]);

  if (step === 'choose') {
    return (
      <div className="min-h-screen bg-primary py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">
              Ready to Start?
            </h1>
            <p className="text-xl text-gray-400 mb-2">Join thousands of golfers making a difference</p>
          </div>

          <div className="space-y-4 mb-12">
            <button
              onClick={() => router.push('/auth/signup')}
              className="w-full py-4 bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg transition-colors text-lg"
            >
              Create New Account
            </button>
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full py-4 border-2 border-accent text-accent hover:bg-accent hover:text-primary font-bold rounded-lg transition-colors text-lg"
            >
              Sign In to Existing Account
            </button>
          </div>

          <div className="bg-secondary rounded-xl p-8">
            <h3 className="text-lg font-bold mb-4">What happens next?</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-accent mr-3 font-bold">1</span>
                <span>Create your account or sign in</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 font-bold">2</span>
                <span>Choose which charity to support</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 font-bold">3</span>
                <span>Select your subscription plan</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 font-bold">4</span>
                <span>Start tracking scores and winning prizes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-primary py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Complete Your Setup</h1>
            <p className="text-xl text-gray-400">Almost there! Just a couple more steps</p>
          </div>

          <div className="space-y-4 mb-12">
            <button
              onClick={() => router.push('/onboarding/charity')}
              className="w-full py-4 bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg transition-colors text-lg"
            >
              Choose Your Charity
            </button>
            <button
              onClick={() => router.push('/onboarding/subscription')}
              className="w-full py-4 border-2 border-accent text-accent hover:bg-accent hover:text-primary font-bold rounded-lg transition-colors text-lg"
            >
              Select Your Plan
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 border-2 border-gray-700 text-gray-400 hover:border-gray-500 font-bold rounded-lg transition-colors text-lg"
            >
              Go to Dashboard
            </button>
          </div>

          <div className="bg-secondary rounded-xl p-6 text-center">
            <p className="text-gray-400">
              Welcome back! Choose a charity to support or select your subscription plan to start.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}
