'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { GolfScore, Subscription } from '@/types';
import { ScoreManager } from '@/lib/score-manager';

export default function UserDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [scores, setScores] = useState<GolfScore[]>([]);
  const [newScore, setNewScore] = useState('');
  const [scoreDate, setScoreDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setSubscription(null);
    setScores([]);
    setLoading(false);
  }, [user, router]);

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScore || !user) return;

    const scoreNum = parseInt(newScore);
    if (!ScoreManager.isValidScore(scoreNum)) {
      alert('Score must be between 1 and 45');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('golf_scores')
        .insert([
          {
            user_id: user.id,
            score: scoreNum,
            date: scoreDate,
          },
        ])
        .select();

      if (error) throw error;

      setScores([...scores, data[0]]);
      setNewScore('');
      setScoreDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error adding score:', error);
      alert('Failed to add score');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const latestScores = ScoreManager.getLatestScores(scores);
  const stats = ScoreManager.getStatistics(latestScores);

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-400">Track your scores and win prizes</p>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4 mb-8 text-sm">
          <a href="#" className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold">Scores</a>
          <a href="/dashboard/draws" className="px-4 py-2 text-gray-400 hover:text-white rounded-lg">Draws</a>
          <a href="/dashboard/wins" className="px-4 py-2 text-gray-400 hover:text-white rounded-lg">Winnings</a>
          <a href="/dashboard/settings" className="px-4 py-2 text-gray-400 hover:text-white rounded-lg">Settings</a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Subscription Status */}
          <div className="bg-secondary rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Subscription</h3>
            <p className="text-2xl font-bold mb-2 capitalize">
              {subscription?.plan || 'Inactive'}
            </p>
            <p className="text-sm text-gray-400">
              {subscription?.status === 'active'
                ? `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                : 'Not active'}
            </p>
            <button className="mt-4 text-accent text-sm hover:underline">
              Manage Plan
            </button>
          </div>

          {/* Score Statistics */}
          <div className="bg-secondary rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Latest Scores</h3>
            <p className="text-2xl font-bold mb-2">{stats.count}/5</p>
            <p className="text-sm text-gray-400">Average: {stats.average}</p>
            <p className="text-sm text-gray-400 mt-2">High: {stats.highest} | Low: {stats.lowest}</p>
          </div>

          {/* Charity */}
          <div className="bg-secondary rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Your Charity</h3>
            <p className="text-lg font-bold mb-2">{user?.charity_percentage}%</p>
            <p className="text-sm text-gray-400">of subscription goes to charity</p>
            <button className="mt-4 text-accent text-sm hover:underline">
              Change Charity
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Score Form */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Add New Score</h2>
              <form onSubmit={handleAddScore} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Score (1-45)</label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    placeholder="Enter score"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={scoreDate}
                    onChange={(e) => setScoreDate(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-accent hover:bg-blue-600 disabled:bg-gray-600 text-primary font-bold rounded-lg transition-colors"
                >
                  {submitting ? 'Adding...' : 'Add Score'}
                </button>
              </form>
            </div>
          </div>

          {/* Scores History */}
          <div className="lg:col-span-2">
            <div className="bg-secondary rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Your Scores</h2>
              <div className="space-y-3">
                {latestScores.length === 0 ? (
                  <p className="text-gray-400">No scores yet. Add your first score above!</p>
                ) : (
                  latestScores.map((score) => (
                    <div key={score.id} className="flex items-center justify-between p-4 bg-primary rounded-lg border border-gray-700">
                      <div>
                        <p className="font-semibold">{score.score} Stableford Points</p>
                        <p className="text-sm text-gray-400">
                          {new Date(score.date).toLocaleDateString()}
                          {score.course && ` • ${score.course}`}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-red-400">✕</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
