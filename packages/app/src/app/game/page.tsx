'use client';

import { ChatWindow } from '@/components/chat/ChatWindow';
import { useApi } from '@/contexts/ApiContext';
import { useWebSocketClient } from '@/contexts/WebSocketContext';
import { Translation } from '@/labels/Translation';
import { isBackgroundSkill } from '@/utils/game';
import { DnD, ESkills } from '@moonlabs/isek-ai-core/src/lib/games/DnD';
import {
  ISchema_Character,
  ISchema_World,
} from '@moonlabs/isek-ai-core/src/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Tab {
  id: string;
  name: string;
  icon: string;
}

const GamePage = () => {
  const { api } = useApi();
  const { wsClient } = useWebSocketClient();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('world');
  const [selectedWorld, setSelectedWorld] = useState<ISchema_World | null>(
    null
  );
  const [selectedCharacter, setSelectedCharacter] =
    useState<ISchema_Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs: Tab[] = [
    { id: 'world', name: 'World', icon: '🌍' },
    { id: 'character', name: 'Character', icon: '⚔️' },
    { id: 'inventory', name: 'Inventory', icon: '🎒' },
    { id: 'story', name: 'Story', icon: '📖' },
  ];

  // Helper function to get stat modifier
  const getStatModifier = (statValue: number) => {
    return Math.floor((statValue - 10) / 2);
  };

  // Helper function to get modifier display
  const getModifierDisplay = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  // Load character and world data on component mount
  useEffect(() => {
    const loadGameData = async () => {
      const characterId = searchParams.get('char');

      if (!characterId) {
        setError('No character ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load character data
        const characterResponse = await api.getCharacter(characterId);
        if (!characterResponse.success || !characterResponse.data) {
          throw new Error(
            characterResponse.error || 'Failed to load character'
          );
        }

        const character = characterResponse.data.character;
        setSelectedCharacter(character);

        // Load world data if character has a world
        if (character.worldId) {
          const worldResponse = await api.getWorld(character.worldId);
          if (worldResponse.success && worldResponse.data) {
            setSelectedWorld(worldResponse.data.world);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load game data'
        );
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [searchParams]);

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-white text-lg">Loading game data...</div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4">
          <div className="text-red-400 text-center">
            <div className="text-lg font-semibold mb-2">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'world':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              World Information
            </h3>
            {selectedWorld ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">
                    {selectedWorld.name}
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {selectedWorld.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Story</h4>
                  <p className="text-gray-300 text-sm">{selectedWorld.story}</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Level</h4>
                  <p className="text-gray-300 text-sm">
                    Level {selectedWorld.level}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No world selected</p>
            )}
          </div>
        );

      case 'character':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Character Sheet
            </h3>
            {selectedCharacter ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-2">
                    {selectedCharacter.name}
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {selectedCharacter.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Basic Info</h4>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-gray-400 text-xs uppercase">
                        Race
                      </div>
                      <div className="text-white font-semibold">
                        {selectedCharacter.race}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-gray-400 text-xs uppercase">
                        Class
                      </div>
                      <div className="text-white font-semibold">
                        {selectedCharacter.class}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-gray-400 text-xs uppercase">
                        Background
                      </div>
                      <div className="text-white font-semibold">
                        {selectedCharacter.background}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-gray-400 text-xs uppercase">
                        Level
                      </div>
                      <div className="text-white font-semibold">
                        {selectedCharacter.level}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Stats</h4>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {Object.entries(selectedCharacter.stats).map(
                      ([stat, value]) => (
                        <div key={stat} className="bg-white/5 rounded p-2">
                          <div className="text-gray-400 text-xs uppercase">
                            {stat}
                          </div>
                          <div className="text-white font-semibold">
                            {value as number}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Skills</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.keys(selectedCharacter.skills).map(skill => {
                      const isBackground = isBackgroundSkill(
                        skill as ESkills,
                        selectedCharacter.background
                      );
                      const isProficient =
                        selectedCharacter.skills[skill as ESkills] === 1;
                      const stat =
                        selectedCharacter.stats[
                          DnD.skillStats[skill as ESkills]
                        ];
                      const modifier = getStatModifier(stat);
                      const proficiencyBonus =
                        isBackground || isProficient
                          ? DnD.proficiencyLevelBonus[
                              selectedCharacter.level - 1
                            ]
                          : 0;
                      const totalBonus = modifier + proficiencyBonus;

                      return (
                        <div
                          key={skill}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            isBackground
                              ? 'bg-blue-500/20 border-blue-500/50'
                              : isProficient
                                ? 'bg-emerald-500/20 border-emerald-500/50'
                                : 'bg-white/5 border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold text-sm">
                                <Translation id={`games.dnd.skills.${skill}`} />
                              </span>
                              <div className="flex gap-1">
                                <span className="px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded-full border border-gray-500/30">
                                  <Translation
                                    id={`games.dnd.stats.${DnD.skillStats[skill as ESkills]}`}
                                  />{' '}
                                  {getModifierDisplay(modifier)}
                                </span>
                                {isBackground && (
                                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                                    Background +{proficiencyBonus}
                                  </span>
                                )}
                                {isProficient && !isBackground && (
                                  <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
                                    Proficient +{proficiencyBonus}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-white font-bold text-lg">
                                {getModifierDisplay(totalBonus)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No character selected</p>
            )}
          </div>
        );

      case 'inventory':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Inventory</h3>
            <p className="text-gray-400 text-sm">
              Inventory system coming soon...
            </p>
          </div>
        );

      case 'story':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Story Log</h3>
            <p className="text-gray-400 text-sm">
              Story log and quest tracking coming soon...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Panel - Chat (2/3 width) */}
      <div className="w-2/3 flex flex-col bg-white/5">
        {/* Chat Messages */}
        <div className="flex-1">
          <ChatWindow
            onExecute={async (functions, input) => {
              await functions.executeQuery(input);
            }}
          />
        </div>
      </div>

      {/* Right Panel - Tabs (1/3 width) */}
      <div className="w-1/3 flex flex-col bg-white/10 backdrop-blur-sm border-l border-white/20">
        {/* Tab Headers */}
        <div className="flex border-b border-white/20">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-3 text-sm font-medium transition-all duration-200
                ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-500'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default GamePage;
