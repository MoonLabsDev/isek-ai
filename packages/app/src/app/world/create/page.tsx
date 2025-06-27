'use client';

import { useApi } from '@/contexts/ApiContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface WorldForm {
  name: string;
  description: string;
}

const CreateWorld = () => {
  const router = useRouter();
  const { api } = useApi();
  const [form, setForm] = useState<WorldForm>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const updateForm = (updates: Partial<WorldForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.createWorld(form);

      if (response.success && response.data) {
        router.push(`/world/${response.data.world.id}`);
      } else {
        alert('Failed to create world: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to create world');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = form.name.trim() && form.description.trim();

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Create New World
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Design your own DnD world and bring it to life
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* World Name */}
            <div>
              <label className="block text-white font-medium mb-2">
                World Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => updateForm({ name: e.target.value })}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter your world's name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => updateForm({ description: e.target.value })}
                rows={3}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Briefly describe your world..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Creating World...' : 'Create World'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWorld;
