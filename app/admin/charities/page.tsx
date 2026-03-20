'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Charity } from '@/types';

export default function AdminCharitiesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    website: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    setCharities([]);
    setLoading(false);
  }, [user, router]);
        setCharities(data || []);
      } catch (error) {
        console.error('Error fetching charities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, [user, router]);

  const handleAddCharity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('charities')
        .insert([formData])
        .select();

      if (error) throw error;

      setCharities([...charities, data[0]]);
      setFormData({ name: '', description: '', logo_url: '', website: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding charity:', error);
      alert('Failed to add charity');
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Charity Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg"
          >
            {showForm ? 'Cancel' : 'Add Charity'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddCharity} className="bg-secondary rounded-xl p-6 border border-gray-700 mb-8">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Charity Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
              <input
                type="url"
                placeholder="Logo URL"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              />
              <input
                type="url"
                placeholder="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
              <button
                type="submit"
                className="w-full py-2 bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg"
              >
                Add Charity
              </button>
            </div>
          </form>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {charities.map((charity) => (
            <div key={charity.id} className="bg-secondary rounded-xl p-6 border border-gray-700">
              {charity.logo_url && (
                <img
                  src={charity.logo_url}
                  alt={charity.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-lg font-bold mb-2">{charity.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{charity.description}</p>
              <p className="text-accent font-bold text-sm">Raised: ${charity.total_raised.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
