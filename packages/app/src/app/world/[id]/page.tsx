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

const WorldDetail = () => {
  const { api } = useApi();
  const params = useParams();
  const router = useRouter();
  const [world, setWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);

  const worldId = params.id as string;

  useEffect(() => {
    const fetchWorld = async () => {
      if (!worldId) return;

      try {
        const response = await api.getWorld(worldId);

        if (response.success && response.data) {
          setWorld(response.data.world);
        } else {
          setError(response.error || 'Failed to fetch world');
        }
      } catch (err) {
        setError('Failed to fetch world data');
      } finally {
        setLoading(false);
      }
    };

    fetchWorld();
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
        // Update the world state with the new image
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

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
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

        {/* World Image */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
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
          />
        </div>

        {/* World Story */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            <ReactMarkdown>World Story</ReactMarkdown>
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {world.story}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldDetail;
