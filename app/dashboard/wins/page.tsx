'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Subscription, DrawWinner } from '@/types';

export default function DashboardWinsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [winnings, setWinnings] = useState<DrawWinner[]>([]);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setWinnings([]);
    setTotalWinnings(0);
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4"></div>
          <p>Loading winnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Winnings</h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-secondary rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Total Winnings</h3>
            <p className="text-4xl font-bold">${totalWinnings.toFixed(2)}</p>
          </div>

          <div className="bg-secondary rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Total Wins</h3>
            <p className="text-4xl font-bold">{winnings.length}</p>
          </div>

          <div className="bg-secondary rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Verified</h3>
            <p className="text-4xl font-bold">
              {winnings.filter((w) => w.verification_status === 'approved').length}
            </p>
          </div>
        </div>

        {/* Winnings Table */}
        <div className="bg-secondary rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Verification</th>
                <th className="px-6 py-3 font-semibold">Payment Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {winnings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No winnings recorded yet
                  </td>
                </tr>
              ) : (
                winnings.map((winning) => (
                  <tr key={winning.id} className="border-b border-gray-700 hover:bg-primary/50 transition-colors">
                    <td className="px-6 py-4 font-semibold">{winning.match_type}</td>
                    <td className="px-6 py-4">${winning.prize_amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        winning.verification_status === 'approved'
                          ? 'bg-success/20 text-success'
                          : winning.verification_status === 'rejected'
                          ? 'bg-danger/20 text-danger'
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {winning.verification_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        winning.payment_status === 'paid'
                          ? 'bg-success/20 text-success'
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {winning.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(winning.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
