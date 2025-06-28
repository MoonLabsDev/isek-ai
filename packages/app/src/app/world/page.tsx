'use client';

import { useApi } from '@/contexts/ApiContext';
import { Translation } from '@/labels/Translation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface World {
  id: string;
  name: string;
  description: string;
  story: string;
  level: number;
  image?: string;
  createdAt: number;
  updatedAt: number;
}

const WorldsList = () => {
  const { api } = useApi();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const response = await api.getWorlds();

        if (response.success && response.data) {
          setWorlds(response.data.worlds);
        } else {
          setError(response.error || 'Failed to fetch worlds');
        }
      } catch (err) {
        setError('Failed to fetch worlds data');
      } finally {
        setLoading(false);
      }
    };

    fetchWorlds();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading worlds...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <Translation id="pages.world.title" />
          </h1>
          <p className="text-xl text-gray-300">
            <Translation id="pages.world.description" />
          </p>
        </div>

        {/* Worlds Grid */}
        {worlds.length === 0 ? (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12">
              <div className="text-6xl mb-4">🌍</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                <Translation id="pages.world.noWorldsFound" />
              </h2>
              <p className="text-gray-300 mb-6">
                <Translation id="pages.world.noWorldsFoundDescription" />
              </p>
              <Link
                href="/world/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
              >
                <Translation id="pages.world.createWorld" />
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {worlds.map(world => (
              <Link
                key={world.id}
                href={`/world/${world.id}`}
                className="group block"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {world.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        Lv.{world.level}
                      </div>
                    </div>
                  </div>

                  {world.image ? (
                    <div className="mb-6">
                      <img
                        src={`data:image/png;base64,${world.image}`}
                        alt={`${world.name} world image`}
                        className="w-full h-48 object-cover rounded-lg shadow-lg"
                        onError={e => {
                          // Hide the image and show description instead if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove(
                            'hidden'
                          );
                        }}
                      />
                      <p className="text-gray-300 hidden">
                        {world.description.split('\n').map((l, i) => (
                          <span key={i}>
                            {l}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-300 mb-6">
                      {world.description.split('\n').map((l, i) => (
                        <span key={i}>
                          {l}
                          <br />
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create New World Button */}
        {worlds.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/world/create"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg"
            >
              <svg
                className="mr-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <Translation id="pages.world.createWorld" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldsList;
