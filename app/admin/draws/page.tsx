'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Draw, DrawWinner } from '@/types';

export default function AdminDrawsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [winners, setWinners] = useState<DrawWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'draws' | 'winners'>('draws');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    setDraws([]);
    setWinners([]);
    setLoading(false);
  }, [user, router]);

  const handleVerifyWinner = async (winnerId: string, status: 'approved' | 'rejected') => {
    try {
      setWinners(winners.filter((w) => w.id !== winnerId));
    } catch (error) {
      alert('Failed to verify winner');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Draw Management</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('draws')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'draws'
                ? 'text-accent border-accent'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Draws
          </button>
          <button
            onClick={() => setActiveTab('winners')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'winners'
                ? 'text-accent border-accent'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Verify Winners ({winners.length})
          </button>
        </div>

        {/* Draws Tab */}
        {activeTab === 'draws' && (
          <div className="space-y-4">
            {draws.length === 0 ? (
              <p className="text-gray-400">No draws yet</p>
            ) : (
              draws.map((draw) => (
                <div key={draw.id} className="bg-secondary rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        {draw.month}/{draw.year}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Numbers: {draw.drawn_numbers.join(', ')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      draw.status === 'published'
                        ? 'bg-success/20 text-success'
                        : draw.status === 'simulated'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {draw.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Type: {draw.draw_type}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Winners Verification Tab */}
        {activeTab === 'winners' && (
          <div className="space-y-4">
            {winners.length === 0 ? (
              <p className="text-gray-400">No pending verifications</p>
            ) : (
              winners.map((winner) => (
                <div key={winner.id} className="bg-secondary rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{winner.match_type}</h3>
                      <p className="text-gray-400 text-sm">Prize: ${winner.prize_amount.toFixed(2)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleVerifyWinner(winner.id, 'approved')}
                        className="px-4 py-2 bg-success hover:bg-green-600 text-white rounded font-medium text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyWinner(winner.id, 'rejected')}
                        className="px-4 py-2 bg-danger hover:bg-red-600 text-white rounded font-medium text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  {winner.proof_url && (
                    <a
                      href={winner.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline text-sm"
                    >
                      View Proof
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
