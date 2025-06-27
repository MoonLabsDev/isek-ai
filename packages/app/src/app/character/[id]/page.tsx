'use client';

import { useApi } from '@/contexts/ApiContext';
import {
  backgroundIcons,
  backgroundNames,
  classIcons,
  classNames,
  isBackgroundSkill,
  raceIcons,
  raceNames,
  skillNames,
} from '@/utils/game';
import { DnD, ESkills } from '@moonlabs/isek-ai-core/src/lib/games/DnD';
import {
  ISchema_Character,
  ISchema_World,
} from '@moonlabs/isek-ai-core/src/types';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CharacterSheet = () => {
  const params = useParams();
  const router = useRouter();
  const { api } = useApi();
  const [character, setCharacter] = useState<ISchema_Character | null>(null);
  const [worlds, setWorlds] = useState<ISchema_World[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWorldDialog, setShowWorldDialog] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState<string>('');
  const [joiningWorld, setJoiningWorld] = useState(false);

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
  }, [params.id]);

  const fetchWorlds = async () => {
    try {
      const response = await api.getWorlds();
      if (response.success && response.data) {
        setWorlds(response.data.worlds);
      }
    } catch (err) {
      console.error('Failed to fetch worlds:', err);
    }
  };

  const handleEnterWorld = () => {
    if (character?.worldId) {
      // Character already has a world, go directly to game
      router.push(`/game?char=${character.id}`);
    } else {
      // Character needs to select a world
      fetchWorlds();
      setShowWorldDialog(true);
    }
  };

  const handleJoinWorld = async () => {
    if (!selectedWorldId || !character) return;

    setJoiningWorld(true);
    try {
      const response = await api.joinWorld(character.id, selectedWorldId);

      if (response.success) {
        // Update character with new worldId
        setCharacter(prev =>
          prev ? { ...prev, worldId: selectedWorldId } : null
        );
        setShowWorldDialog(false);
        setSelectedWorldId('');

        // Navigate to game
        router.push(`/game?char=${character.id}`);
      } else {
        setError(response.error || 'Failed to join world');
      }
    } catch (err) {
      setError('Failed to join world');
    } finally {
      setJoiningWorld(false);
    }
  };

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
              <p className="text-gray-300 text-lg mb-4">
                {character.description}
              </p>
              {/* Race, Class, and Background Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                  {raceIcons[character.race] || '👤'}{' '}
                  {raceNames[character.race]}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                  {classIcons[character.class] || '⚔️'}{' '}
                  {classNames[character.class]}
                </span>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full border border-orange-500/30">
                  {backgroundIcons[character.background] || '🎭'}{' '}
                  {backgroundNames[character.background]}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-2xl font-bold text-white">
                Level {character.level}
              </div>
              <div className="text-gray-300">{character.experience} XP</div>
              <button
                onClick={handleEnterWorld}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                Enter World
              </button>
            </div>
          </div>
        </div>

        {/* World Selection Dialog */}
        {showWorldDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-6">
                Select a World
              </h2>
              <p className="text-gray-300 mb-6">
                Choose a world for {character.name} to enter:
              </p>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {worlds.map(world => (
                  <div
                    key={world.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedWorldId === world.id
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedWorldId(world.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold mb-2">
                          {world.name}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {world.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">
                          Level {world.level}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowWorldDialog(false);
                    setSelectedWorldId('');
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinWorld}
                  disabled={!selectedWorldId || joiningWorld}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joiningWorld ? 'Joining...' : 'Join World'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Stats</h2>
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
                {Object.keys(character.skills).map(skill => {
                  const isBackground = isBackgroundSkill(
                    skill as ESkills,
                    character.background
                  );
                  const isProficient = character.skills[skill as ESkills] === 1;
                  const stat =
                    character.stats[DnD.skillStats[skill as ESkills]];
                  const modifier = getStatModifier(stat);
                  const proficiencyBonus =
                    isBackground || isProficient
                      ? DnD.proficiencyLevelBonus[character.level - 1]
                      : 0;

                  return (
                    <div
                      key={skill}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        isBackground
                          ? 'bg-blue-500/20 border-blue-500/50'
                          : isProficient
                            ? 'bg-emerald-500/20 border-emerald-500/50'
                            : 'bg-white/5 border-white/20'
                      }`}
                      title={`${stat} ${getModifierDisplay(modifier)} ${getModifierDisplay(proficiencyBonus)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">
                            {skillNames[skill as ESkills]}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold text-lg">
                            {stat + modifier + proficiencyBonus}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
      </div>
    </div>
  );
};

export default CharacterSheet;
