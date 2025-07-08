'use client';

import { Button_GenerateImage, Image_Generated } from '@/components';
import { useApi } from '@/contexts/ApiContext';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

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

interface Location {
  id: string;
  worldId: string;
  name: string;
  description: string;
  image?: string;
  createdAt: number;
  updatedAt: number;
}

interface NPC {
  id: string;
  worldId: string;
  name: string;
  description: string;
  image?: string;
  voice: string;
  createdAt: number;
  updatedAt: number;
}

type TabType = 'world' | 'locations' | 'npcs';

const WorldDetail = () => {
  const { api } = useApi();
  const params = useParams();
  const router = useRouter();
  const [world, setWorld] = useState<World | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [npcs, setNPCs] = useState<NPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingLocationImage, setGeneratingLocationImage] = useState<
    string | null
  >(null);
  const [generatingNPCImage, setGeneratingNPCImage] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<TabType>('world');

  const worldId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      if (!worldId) return;

      try {
        setLoading(true);

        // Fetch world data
        const worldResponse = await api.getWorld(worldId);
        if (worldResponse.success && worldResponse.data) {
          setWorld(worldResponse.data.world);
        } else {
          setError(worldResponse.error || 'Failed to fetch world');
          return;
        }

        // Fetch locations
        const locationsResponse = await api.getLocations(worldId);
        if (locationsResponse.success && locationsResponse.data) {
          setLocations(locationsResponse.data.locations || []);
        }

        // Fetch NPCs
        const npcsResponse = await api.getNPCs(worldId);
        if (npcsResponse.success && npcsResponse.data) {
          setNPCs(npcsResponse.data.npcs || []);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [worldId]);

  const handleGenerateImage = async () => {
    if (!world) return;

    setGeneratingImage(true);
    try {
      const response = await api.generateWorldImage(
        world.id,
        world.description
      );

      if (response.success && response.data) {
        setWorld(prev =>
          prev ? { ...prev, image: response.data.imageUrl } : null
        );
      } else {
        setError(response.error || 'Failed to generate image');
      }
    } catch (err) {
      setError('Failed to generate image');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleGenerateLocationImage = async (location: Location) => {
    setGeneratingLocationImage(location.id);
    try {
      const response = await api.generateLocationImage(
        location.id,
        location.description
      );

      if (response.success && response.data) {
        setLocations(prev =>
          prev.map(loc =>
            loc.id === location.id
              ? { ...loc, image: response.data.imageUrl }
              : loc
          )
        );
      } else {
        setError(response.error || 'Failed to generate location image');
      }
    } catch (err) {
      setError('Failed to generate location image');
    } finally {
      setGeneratingLocationImage(null);
    }
  };

  const handleGenerateNPCImage = async (npc: NPC) => {
    setGeneratingNPCImage(npc.id);
    try {
      const response = await api.generateNPCImage(npc.id, npc.description);

      if (response.success && response.data) {
        setNPCs(prev =>
          prev.map(n =>
            n.id === npc.id ? { ...n, image: response.data.imageUrl } : n
          )
        );
      } else {
        setError(response.error || 'Failed to generate NPC image');
      }
    } catch (err) {
      setError('Failed to generate NPC image');
    } finally {
      setGeneratingNPCImage(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading world...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <Link
            href="/world"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Worlds
          </Link>
        </div>
      </div>
    );
  }

  if (!world) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-white text-xl mb-4">World not found</div>
          <Link
            href="/world"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Worlds
          </Link>
        </div>
      </div>
    );
  }

  const renderWorldTab = () => (
    <div className="space-y-8">
      {/* World Image */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">World Image</h2>
          <Button_GenerateImage
            onClick={handleGenerateImage}
            generating={generatingImage}
          />
        </div>

        <Image_Generated
          image={world.image}
          altText={`${world.name} world image`}
          width="w-64"
          height="h-64"
        />
      </div>

      {/* World Story */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">World Story</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
            {world.story}
          </p>
        </div>
      </div>
    </div>
  );

  const renderLocationsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Locations</h2>
        <span className="text-gray-400">{locations.length} locations</span>
      </div>

      {locations.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-lg">
            No locations found for this world.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map(location => (
            <div
              key={location.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">
                  {location.name}
                </h3>
                <Button_GenerateImage
                  onClick={() => handleGenerateLocationImage(location)}
                  generating={generatingLocationImage === location.id}
                  disabled={generatingLocationImage !== null}
                />
              </div>

              <div className="mb-4">
                <Image_Generated
                  image={location.image}
                  altText={`${location.name} location image`}
                  width="w-64"
                  height="h-64"
                />
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {location.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderNPCsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">NPCs</h2>
        <span className="text-gray-400">{npcs.length} NPCs</span>
      </div>

      {npcs.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-lg">No NPCs found for this world.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {npcs.map(npc => (
            <div
              key={npc.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{npc.name}</h3>
                <Button_GenerateImage
                  onClick={() => handleGenerateNPCImage(npc)}
                  generating={generatingNPCImage === npc.id}
                  disabled={generatingNPCImage !== null}
                />
              </div>

              <div className="mb-4">
                <Image_Generated
                  image={npc.image}
                  altText={`${npc.name} NPC image`}
                  width="w-64"
                  height="h-64"
                />
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {npc.description}
              </p>

              {npc.voice && (
                <div className="text-xs text-gray-400">Voice: {npc.voice}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* World Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {world.name}
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                <ReactMarkdown>{world.description}</ReactMarkdown>
              </p>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-full text-2xl font-bold">
                Level {world.level}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <div className="flex space-x-1 mb-8">
            {[
              { id: 'world' as TabType, label: 'World', count: null },
              {
                id: 'locations' as TabType,
                label: 'Locations',
                count: locations.length,
              },
              { id: 'npcs' as TabType, label: 'NPCs', count: npcs.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'world' && renderWorldTab()}
          {activeTab === 'locations' && renderLocationsTab()}
          {activeTab === 'npcs' && renderNPCsTab()}
        </div>
      </div>
    </div>
  );
};

export default WorldDetail;
