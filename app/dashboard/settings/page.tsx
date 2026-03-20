'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Charity } from '@/types';

export default function DashboardSettingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [charityPercent, setCharityPercent] = useState(user?.charity_percentage || 10);
  const [selectedCharity, setSelectedCharity] = useState(user?.charity_id || '');
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setCharities([]);
    setLoading(false);
  }, [user, router]);
    };

    fetchCharities();
  }, [user, router]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name,
          charity_id: selectedCharity,
          charity_percentage: charityPercent,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update store
      setUser({
        ...user,
        name,
        charity_id: selectedCharity,
        charity_percentage: charityPercent,
      });

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {success && (
          <div className="p-4 rounded-lg bg-success/10 border border-success text-success mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Profile Section */}
          <div className="bg-secondary rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Charity Section */}
          <div className="bg-secondary rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Charity Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Charity</label>
                <select
                  value={selectedCharity}
                  onChange={(e) => setSelectedCharity(e.target.value)}
                  className="w-full"
                  required
                >
                  <option value="">Choose a charity...</option>
                  {charities.map((charity) => (
                    <option key={charity.id} value={charity.id}>
                      {charity.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Contribution Percentage</label>
                  <span className="text-lg font-bold text-accent">{charityPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={charityPercent}
                  onChange={(e) => setCharityPercent(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-2">
                  {charityPercent}% of your subscription goes to your selected charity
                </p>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-secondary rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Account</h2>
            <button
              type="button"
              className="w-full px-4 py-3 border-2 border-danger text-danger hover:bg-danger hover:text-white rounded-lg font-bold transition-colors"
            >
              Delete Account
            </button>
            <p className="text-xs text-gray-400 mt-2">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-accent hover:bg-blue-600 disabled:bg-gray-600 text-primary font-bold rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
