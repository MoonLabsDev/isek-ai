'use client';

import { useApi } from '@/contexts/ApiContext';
import {
  backgroundIcons,
  classIcons,
  isBackgroundSkill,
  raceIcons,
  skillNames,
} from '@/utils/game';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Character {
  id: string;
  name: string;
  description: string;
  level: number;
  experience: number;
  race: string;
  class: string;
  background: string;
  stats: Record<string, number>;
  skills: Record<string, number>;
  equipment: Record<string, number>;
  createdAt: number;
  updatedAt: number;
}

const CharactersList = () => {
  const { api } = useApi();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await api.getCharacters();

        if (response.success && response.data) {
          setCharacters(response.data.characters);
        } else {
          setError(response.error || 'Failed to fetch characters');
        }
      } catch (err) {
        setError('Failed to fetch characters data');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading characters...</div>
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
            Character Sheets
          </h1>
          <p className="text-xl text-gray-300">
            View and manage your DnD characters
          </p>
        </div>

        {/* Characters Grid */}
        {characters.length === 0 ? (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12">
              <div className="text-6xl mb-4">🎭</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No Characters Found
              </h2>
              <p className="text-gray-300 mb-6">
                You haven't created any characters yet. Start your adventure by
                creating a new character!
              </p>
              <Link
                href="/character/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
              >
                Create Character
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
            {characters.map(character => (
              <Link
                key={character.id}
                href={`/character/${character.id}`}
                className="group block"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {character.name}
                      </h3>
                      {/* Race, Class, and Background Badges */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                          {raceIcons[character.race] || '👤'} {character.race}
                        </span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                          {classIcons[character.class] || '⚔️'}{' '}
                          {character.class}
                        </span>
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                          {backgroundIcons[character.background] || '🎭'}{' '}
                          {character.background}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        Lv.{character.level}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {character.experience} XP
                      </div>
                    </div>
                  </div>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {Object.entries(character.stats).map(([stat, value]) => (
                      <div
                        key={stat}
                        className="text-center p-2 bg-white/5 rounded"
                      >
                        <div className="text-gray-400 text-xs uppercase">
                          {stat}
                        </div>
                        <div className="text-white font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Skills Preview */}
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(character.skills)
                      .filter(([_, level]) => level > 0)
                      .map(([skill, level]) => (
                        <span
                          key={skill}
                          className={`px-2 py-1 text-xs rounded-full ${
                            isBackgroundSkill(skill, character.background)
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                          title={`${skillNames[skill] || skill} ${
                            isBackgroundSkill(skill, character.background)
                              ? '(Background)'
                              : ''
                          }`}
                        >
                          {skillNames[skill] || skill}
                        </span>
                      ))}
                  </div>

                  <div className="mt-4 text-gray-400 text-xs">
                    Created:{' '}
                    {new Date(character.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create New Character Button */}
        {characters.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/character/create"
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
              Create New Character
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharactersList;
