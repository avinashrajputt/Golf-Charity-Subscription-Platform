'use client';

import { useState, useEffect } from 'react';
import { Charity } from '@/types';

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await fetch('/api/charities');
        const data = await response.json();
        setCharities(data);
      } catch (error) {
        console.error('Failed to fetch charities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

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
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-accent/10 to-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            Charities That Make a <span className="text-charity">Difference</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Support causes that matter. A portion of every subscription goes directly to the charity of your choice.
          </p>
        </div>
      </div>

      {/* Featured Charities */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Featured Organizations</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {charities.filter(c => c.featured).map((charity) => (
              <div key={charity.id} className="group rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-accent/10 to-blue-500/10 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                {charity.logo_url && (
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-accent to-blue-600">
                    <img
                      src={charity.logo_url}
                      alt={charity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold">{charity.name}</h2>
                    <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full">
                      Featured
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-3">{charity.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-accent font-bold text-lg">
                      ${charity.total_raised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    {charity.website && (
                      <a
                        href={charity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-accent/20 text-accent hover:bg-accent hover:text-primary rounded-lg font-semibold transition-all text-sm"
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Charities */}
        {charities.filter(c => !c.featured).length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">All Partners</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {charities.filter(c => !c.featured).map((charity) => (
                <div key={charity.id} className="group rounded-xl border border-gray-700 bg-secondary/50 hover:bg-secondary overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 backdrop-blur">
                  {charity.logo_url && (
                    <div className="h-32 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
                      <img
                        src={charity.logo_url}
                        alt={charity.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2">{charity.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{charity.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-accent font-bold">
                        ${charity.total_raised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      {charity.website && (
                        <a
                          href={charity.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-blue-400 transition text-sm font-semibold"
                        >
                          →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center bg-gradient-to-r from-charity/20 via-accent/20 to-blue-500/20 rounded-3xl p-12 border-2 border-charity/50">
          <h2 className="text-4xl font-bold mb-4">Support a Charity You Believe In</h2>
          <p className="text-lg text-gray-300 mb-8">Every subscription automatically donates to your chosen organization</p>
          <a href="/auth/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-charity to-purple-600 hover:shadow-2xl rounded-xl text-white font-bold text-lg transition-all transform hover:-translate-y-2">
            Support a Charity
          </a>
        </div>
      </div>
    </div>
  );
}
