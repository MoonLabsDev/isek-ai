'use client';

import { useApi } from '@/contexts/ApiContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Skill {
  name: string;
  fullName: string;
  statValue: number;
  modifier: number;
  proficiencyBonus: number;
  total: number;
  isProficient: boolean;
}

interface Character {
  id: string;
  name: string;
  description: string;
  level: number;
  experience: number;
  stats: Record<string, number>;
  skills: Skill[];
  equipment: Record<string, number>;
  createdAt: number;
  updatedAt: number;
}

const CharacterSheet = () => {
  const params = useParams();
  const { api } = useApi();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await api.getCharacter(params.id as string);

        if (response.success && response.data) {
          setCharacter(response.data.character);
        } else {
          setError(response.error || 'Failed to fetch character');
        }
      } catch (err) {
        setError('Failed to fetch character data');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCharacter();
    }
  }, [params.i]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading character...</div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">
            {error || 'Character not found'}
          </div>
          <Link
            href="/character"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  const getModifierDisplay = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const getStatModifier = (statValue: number) => {
    return Math.floor((statValue - 10) / 2);
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {character.name}
              </h1>
              <p className="text-gray-300 text-lg">{character.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-2xl font-bold text-white">
                Level {character.level}
              </div>
              <div className="text-gray-300">{character.experience} XP</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Ability Scores
              </h2>
              <div className="space-y-4">
                {Object.entries(character.stats).map(([stat, value]) => {
                  const modifier = getStatModifier(value);
                  return (
                    <div
                      key={stat}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-sm uppercase">
                          {stat}
                        </span>
                        <span className="text-white font-semibold">
                          {value}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 text-sm">Modifier</span>
                        <div className="text-white font-bold text-lg">
                          {getModifierDisplay(modifier)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Skills</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {character.skills.map(skill => (
                  <div
                    key={skill.name}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      skill.isProficient
                        ? 'bg-emerald-500/20 border-emerald-500/50'
                        : 'bg-white/5 border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">
                          {skill.fullName}
                        </span>
                        {skill.isProficient && (
                          <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded-full font-bold">
                            PROF
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold text-lg">
                          {getModifierDisplay(skill.total)}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {skill.statValue} +{' '}
                          {getModifierDisplay(skill.modifier)}
                          {skill.proficiencyBonus > 0 &&
                            ` + ${skill.proficiencyBonus}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Section */}
        {Object.keys(character.equipment).length > 0 && (
          <div className="mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Equipment</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(character.equipment).map(([item, quantity]) => (
                  <div key={item} className="p-3 bg-white/5 rounded-lg">
                    <div className="text-white font-semibold">{item}</div>
                    <div className="text-gray-400 text-sm">
                      Quantity: {quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          Character created:{' '}
          {new Date(character.createdAt).toLocaleDateString()}
          {character.updatedAt !== character.createdAt && (
            <span>
              {' '}
              • Last updated:{' '}
              {new Date(character.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
