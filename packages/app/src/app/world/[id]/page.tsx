'use client';

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
            <button
              onClick={handleGenerateImage}
              disabled={generatingImage}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingImage ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Generate Image
                </>
              )}
            </button>
          </div>

          {world.image ? (
            <div className="relative">
              <img
                src={`data:image/png;base64,${world.image}`}
                alt={`${world.name} world image`}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600">
              <div className="text-center text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg">No image generated yet</p>
                <p className="text-sm">
                  Click "Generate Image" to create a visual representation of
                  this world
                </p>
              </div>
            </div>
          )}
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
