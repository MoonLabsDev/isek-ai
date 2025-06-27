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

    // World endpoints
    getWorlds: () => Promise<ApiResponse>;
    getWorld: (id: string) => Promise<ApiResponse>;

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

  // World endpoints
  const getWorlds = useCallback(async (): Promise<ApiResponse> => {
    return fetchApi('/api/v1/world/list');
  }, [fetchApi]);

  const getWorld = useCallback(
    async (id: string): Promise<ApiResponse> => {
      return fetchApi(`/api/v1/world/${id}`);
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
          getWorlds,
          getWorld,
          fetch: fetchApi,
        },
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
