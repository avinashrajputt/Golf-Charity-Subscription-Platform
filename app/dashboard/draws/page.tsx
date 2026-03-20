'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Draw, DrawWinner, User } from '@/types';

export default function DashboardDrawsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [myWinnings, setMyWinnings] = useState<DrawWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setDraws([]);
    setMyWinnings([]);
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4"></div>
          <p>Loading draws...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Monthly Draws</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Draw History */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Published Draws</h2>
            <div className="space-y-4">
              {draws.length === 0 ? (
                <p className="text-gray-400">No draws published yet</p>
              ) : (
                draws.map((draw) => (
                  <div
                    key={draw.id}
                    className="bg-secondary rounded-xl p-6 border border-gray-700 hover:border-accent transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">
                          {new Date(draw.year, draw.month - 1).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          Numbers: {draw.drawn_numbers.join(', ')}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-success/20 text-success text-xs font-bold rounded">
                        Published
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Type: <span className="capitalize">{draw.draw_type}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Winnings */}
          <div>
            <h2 className="text-xl font-bold mb-6">Your Winnings</h2>
            <div className="space-y-4">
              {myWinnings.length === 0 ? (
                <div className="bg-secondary rounded-xl p-6 border border-gray-700 text-center">
                  <p className="text-gray-400">No winnings yet</p>
                  <p className="text-sm text-gray-500 mt-2">Keep playing to win!</p>
                </div>
              ) : (
                myWinnings.map((winning) => (
                  <div
                    key={winning.id}
                    className="bg-secondary rounded-xl p-4 border border-gray-700"
                  >
                    <p className="font-bold text-lg">${winning.prize_amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">{winning.match_type}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Status: <span className="capitalize">{winning.payment_status}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
