'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { WebSocketClient, getWebSocketClient } from '@/utils/WebSocketClient';

interface WebSocketClientContextType {
  wsClient: WebSocketClient | null;
  functions: {
    executeQuery: (query: string) => Promise<void>;
    transcribe: (audioBlob: Blob) => Promise<void>;
    requestTTS: (text: string) => Promise<void>;
  };
}

const WebSocketClientContext = createContext<WebSocketClientContextType | null>(
  null
);

export const useWebSocketClient = () => {
  const context = useContext(WebSocketClientContext);
  if (!context) {
    throw new Error(
      'useWebSocketClient must be used within a WebSocketClientProvider'
    );
  }
  return context;
};

interface WebSocketClientProviderProps {
  children: React.ReactNode;
}

export const WebSocketClientProvider = ({
  children,
}: WebSocketClientProviderProps) => {
  // state
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);

  // create socket client
  useEffect(() => {
    setWsClient(
      getWebSocketClient(
        location.hostname.includes('localhost'),
        location.protocol === 'https:'
      )
    );
  }, []);

  // handlers
  const executeQuery = useCallback(
    async (query: string) => {
      try {
        // execute query
        await wsClient!.query(query);
      } catch (error) {
        console.error('Error executing command:', error);
      }
    },
    [wsClient]
  );

  const transcribe = useCallback(
    async (audioBlob: Blob) => {
      try {
        // transcribe
        await wsClient!.transcribe(audioBlob);
      } catch (error) {
        console.error('Error transcribing:', error);
      }
    },
    [wsClient]
  );

  const requestTTS = useCallback(
    async (text: string) => {
      try {
        // request TTS
        await wsClient!.tts(text);
      } catch (error) {
        console.error('Error requesting TTS:', error);
      }
    },
    [wsClient]
  );

  return (
    <WebSocketClientContext.Provider
      value={{
        wsClient,
        functions: {
          executeQuery,
          transcribe,
          requestTTS,
        },
      }}
    >
      {children}
    </WebSocketClientContext.Provider>
  );
};
