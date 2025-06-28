'use client';

import { useApi } from '@/contexts/ApiContext';
import { Translation } from '@/labels/Translation';
import { backgroundIcons, classIcons, raceIcons } from '@/utils/game';
import { ISchema_Character } from '@moonlabs/isek-ai-core/src/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CharactersList = () => {
  const { api } = useApi();
  const [characters, setCharacters] = useState<ISchema_Character[]>([]);
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
            <Translation id="pages.character.title" />
          </h1>
          <p className="text-xl text-gray-300">
            <Translation id="pages.character.description" />
          </p>
        </div>

        {/* Characters Grid */}
        {characters.length === 0 ? (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12">
              <div className="text-6xl mb-4">🎭</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                <Translation id="pages.character.noCharactersFound" />
              </h2>
              <p className="text-gray-300 mb-6">
                <Translation id="pages.character.noCharactersFoundDescription" />
              </p>
              <Link
                href="/character/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
              >
                <Translation id="pages.character.createCharacter" />
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
                  {/* Name and Level */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {character.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        Lv.{character.level}
                      </div>
                    </div>
                  </div>

                  {/* Race, Class, and Background Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                      {raceIcons[character.race]}{' '}
                      <Translation id={`games.dnd.races.${character.race}`} />
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                      {classIcons[character.class]}{' '}
                      <Translation
                        id={`games.dnd.classes.${character.class}`}
                      />
                    </span>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                      {backgroundIcons[character.background]}{' '}
                      <Translation
                        id={`games.dnd.backgrounds.${character.background}`}
                      />
                    </span>
                  </div>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {Object.entries(character.stats).map(([stat, value]) => (
                      <div
                        key={stat}
                        className="text-center p-2 bg-white/5 rounded"
                      >
                        <div className="text-gray-400 text-xs uppercase">
                          <Translation id={`games.dnd.stats.${stat}`} />
                        </div>
                        <div className="text-white font-semibold">{value}</div>
                      </div>
                    ))}
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
              <Translation id="pages.character.createCharacter" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharactersList;
