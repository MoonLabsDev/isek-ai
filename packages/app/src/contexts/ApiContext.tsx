'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ApiContextType {
  loading: boolean;
  error: string | null;
  api: {
    // Character endpoints
    getCharacter: (id: string) => Promise<ApiResponse>;
    getCharacters: () => Promise<ApiResponse>;
    createCharacter: (characterData: any) => Promise<ApiResponse>;
    joinWorld: (characterId: string, worldId: string) => Promise<ApiResponse>;

    // World endpoints
    createWorld: (worldData: any) => Promise<ApiResponse>;
    getWorlds: () => Promise<ApiResponse>;
    getWorld: (id: string) => Promise<ApiResponse>;
    generateWorldImage: (
      worldId: string,
      prompt: string
    ) => Promise<ApiResponse>;

    // Location endpoints
    getLocations: (worldId: string) => Promise<ApiResponse>;
    generateLocationImage: (
      locationId: string,
      prompt: string
    ) => Promise<ApiResponse>;

    // NPC endpoints
    getNPCs: (worldId: string) => Promise<ApiResponse>;
    generateNPCImage: (npcId: string, prompt: string) => Promise<ApiResponse>;

    // Generic fetch method
    fetch: <T = any>(
      endpoint: string,
      options?: RequestInit
    ) => Promise<ApiResponse<T>>;
  };
}

const ApiContext = createContext<ApiContextType | null>(null);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Base URL configuration
  const baseUrl = 'http://localhost:3001';

  // Generic fetch method
  const fetchApi = useCallback(
    async <T = any,>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const url = `${baseUrl}${endpoint}`;
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || `HTTP error! status: ${response.status}`
          );
        }

        return {
          success: true,
          data,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Character endpoints
  const getCharacter = useCallback(
    async (id: string): Promise<ApiResponse> => {
      return fetchApi(`/api/v1/character/sheet/${id}`);
    },
    [fetchApi]
  );

  const getCharacters = useCallback(async (): Promise<ApiResponse> => {
    return fetchApi('/api/v1/character/list');
  }, [fetchApi]);

  const createCharacter = useCallback(
    async (characterData: any): Promise<ApiResponse> => {
      return fetchApi('/api/v1/character/create', {
        method: 'POST',
        body: JSON.stringify(characterData),
      });
    },
    [fetchApi]
  );

  const joinWorld = useCallback(
    async (characterId: string, worldId: string): Promise<ApiResponse> => {
      return fetchApi('/api/v1/character/join-world', {
        method: 'POST',
        body: JSON.stringify({ characterId, worldId }),
      });
    },
    [fetchApi]
  );

  // World endpoints
  const getWorlds = useCallback(async (): Promise<ApiResponse> => {
    return fetchApi('/api/v1/world/list');
  }, [fetchApi]);
  const getWorld = useCallback(
    async (id: string): Promise<ApiResponse> => {
      return fetchApi(`/api/v1/world/single/${id}`);
    },
    [fetchApi]
  );
  const createWorld = useCallback(
    async (worldData: any): Promise<ApiResponse> => {
      return fetchApi('/api/v1/world/create', {
        method: 'POST',
        body: JSON.stringify(worldData),
      });
    },
    [fetchApi]
  );

  const generateWorldImage = useCallback(
    async (worldId: string, prompt: string): Promise<ApiResponse> => {
      return fetchApi(`/api/v1/world/${worldId}/generate-image`, {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
    },
    [fetchApi]
  );

  // Location endpoints
  const getLocations = useCallback(
    async (worldId: string): Promise<ApiResponse> => {
      return fetchApi(`/api/v1/location/list/${worldId}`);
    },
    [fetchApi]
  );

  const generateLocationImage = useCallback(
    async (locationId: string, prompt: string): Promise<ApiResponse> => {
      return fetchApi(`/api/v1/location/${locationId}/generate-image`, {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
    },
    [fetchApi]
  );

  // NPC endpoints
  const getNPCs = useCallback(
    async (worldId: string): Promise<ApiResponse> => {
      return fetchApi(`/api/v1/npc/list/${worldId}`);
    },
    [fetchApi]
  );

  const generateNPCImage = useCallback(
    async (npcId: string, prompt: string): Promise<ApiResponse> => {
      return fetchApi(`/api/v1/npc/${npcId}/generate-image`, {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
    },
    [fetchApi]
  );

  return (
    <ApiContext.Provider
      value={{
        loading,
        error,
        api: {
          getCharacter,
          getCharacters,
          createCharacter,
          joinWorld,
          getWorlds,
          getWorld,
          createWorld,
          generateWorldImage,
          getLocations,
          generateLocationImage,
          getNPCs,
          generateNPCImage,
          fetch: fetchApi,
        },
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
