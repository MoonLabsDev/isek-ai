'use client';

import { ChatWindow } from '@/components/chat/ChatWindow';
import { useApi } from '@/contexts/ApiContext';
import { useWebSocketClient } from '@/contexts/WebSocketContext';
import { useState } from 'react';

interface Tab {
  id: string;
  name: string;
  icon: string;
}

const GamePage = () => {
  const { api } = useApi();
  const { wsClient } = useWebSocketClient();
  const [activeTab, setActiveTab] = useState('world');
  const [selectedWorld, setSelectedWorld] = useState<any>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  const tabs: Tab[] = [
    { id: 'world', name: 'World', icon: '🌍' },
    { id: 'character', name: 'Character', icon: '⚔️' },
    { id: 'inventory', name: 'Inventory', icon: '🎒' },
    { id: 'story', name: 'Story', icon: '📖' },
  ];

  const renderTabContent = () => {
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
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">
                    {selectedCharacter.name}
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {selectedCharacter.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Stats</h4>
                  <div className="grid grid-cols-2 gap-2">
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
