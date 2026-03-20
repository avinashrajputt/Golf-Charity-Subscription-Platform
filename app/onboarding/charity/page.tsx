'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Charity } from '@/types';

export default function CharitySelectionPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharityId, setSelectedCharityId] = useState('');
  const [charityPercent, setCharityPercent] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await fetch('/api/charities');
        const data = await response.json();
        setCharities(data);
      } catch (error) {
        console.error('Failed to fetch charities:', error);
        alert('Failed to load charities');
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  const handleContinue = async () => {
    if (!selectedCharityId) {
      alert('Please select a charity');
      return;
    }

    setSaving(true);
    try {
      router.push('/onboarding/subscription');
    } catch (error) {
      alert('Failed to save charity selection');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4"></div>
          <p>Loading charities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Choose Your Charity</h1>
          <p className="text-gray-400">A portion of your subscription will support causes you care about</p>
        </div>

        <div className="space-y-4 mb-8">
          {charities.map((charity) => (
            <div
              key={charity.id}
              onClick={() => setSelectedCharityId(charity.id)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedCharityId === charity.id
                  ? 'border-accent bg-accent/10'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start space-x-4">
                {charity.logo_url && (
                  <img
                    src={charity.logo_url}
                    alt={charity.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{charity.name}</h3>
                  <p className="text-gray-400 text-sm">{charity.description}</p>
                  <p className="text-accent text-sm mt-2">Raised: ${charity.total_raised.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary rounded-xl p-6 mb-8">
          <label className="block text-sm font-medium mb-4">
            Charity Contribution: {charityPercent}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={charityPercent}
            onChange={(e) => setCharityPercent(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-gray-400 text-sm mt-2">
            {charityPercent}% of your subscription will go directly to your chosen charity
          </p>
        </div>

        <button
          onClick={handleContinue}
          disabled={saving || !selectedCharityId}
          className="w-full py-4 bg-accent hover:bg-blue-600 disabled:bg-gray-600 text-primary font-bold rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : 'Continue to Plan Selection'}
        </button>
      </div>
    </div>
  );
}
