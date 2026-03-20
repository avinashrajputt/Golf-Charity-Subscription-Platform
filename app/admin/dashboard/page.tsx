'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Analytics } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    setAnalytics(null);
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage platform, users, and draws</p>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4 mb-8 text-sm border-b border-gray-700">
          <a href="#" className="px-4 py-3 text-accent border-b-2 border-accent font-semibold">Overview</a>
          <a href="/admin/users" className="px-4 py-3 text-gray-400 hover:text-white">Users</a>
          <a href="/admin/draws" className="px-4 py-3 text-gray-400 hover:text-white">Draws</a>
          <a href="/admin/charities" className="px-4 py-3 text-gray-400 hover:text-white">Charities</a>
        </div>

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Users',
              value: analytics?.total_users || 0,
              icon: '👥',
            },
            {
              label: 'Active Subscribers',
              value: analytics?.active_subscribers || 0,
              icon: '✓',
            },
            {
              label: 'Monthly Revenue',
              value: `$${(analytics?.monthly_revenue || 0).toFixed(2)}`,
              icon: '💰',
            },
            {
              label: 'Charity Raised',
              value: `$${(analytics?.total_charity_raised || 0).toFixed(2)}`,
              icon: '❤️',
            },
          ].map((card, idx) => (
            <div key={idx} className="bg-secondary rounded-xl p-6 border border-gray-700">
              <div className="text-3xl mb-3">{card.icon}</div>
              <p className="text-gray-400 text-sm mb-2">{card.label}</p>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-secondary rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6">Monthly Draw Management</h2>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg transition-colors">
              Generate Draw
            </button>
            <button className="px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-primary font-bold rounded-lg transition-colors">
              Simulate Draw
            </button>
            <button className="px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-primary font-bold rounded-lg transition-colors">
              Publish Draw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
