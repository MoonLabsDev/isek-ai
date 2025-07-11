'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ChatMessage, ChatMessageData, QueryInputArea } from '@/components';
import { useWebSocketClient } from '@/contexts/WebSocketContext';
import { WebSocketChatTypes } from '@/utils/WebSocketClient';

export interface ChatWindowFunctions {
  executeQuery: (query: string) => Promise<void>;
  requestTTS: (text: string) => Promise<void>;
}

export interface ChatWindowProps {
  executeTitle?: string;
  executeEmoji?: string;
  onExecute: (functions: ChatWindowFunctions, input: string) => Promise<void>;
}

export const ChatWindow = ({
  executeTitle,
  executeEmoji,
  onExecute,
}: ChatWindowProps) => {
  // hooks
  const { wsClient, functions } = useWebSocketClient();

  // state
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [query, setQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // functions
  const addMessage = (message: ChatMessageData) => {
    setMessages(prev => [...prev, message]);
  };
  const formatMessage = async (message: string) => {
    return message.replace(/\r\n/g, '\n').replace(/\n/g, '<br>');
  };

  // scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // socket client
  const handle_jobStart = (type: WebSocketChatTypes, message: string) => {
    // add new loading message
    addMessage({ type, content: message, isLoading: true });
  };
  const handle_jobEnd = () => {
    // remove loading message if exists
    setMessages(prev => prev.filter(m => !m.isLoading));
  };
  const handle_chat = async (from: WebSocketChatTypes, message: string) => {
    // format message
    const formattedMessage =
      from === 'user' ? message : await formatMessage(message);

    // add new message
    addMessage({ type: from, content: formattedMessage });
  };
  const handle_tts = (audioBuffer: Buffer) => {
    const audioBlob = new Blob([audioBuffer]);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();

    // cleanup
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  };
  const handle_status = (msg: string) => {
    console.log(msg);
  };
  useEffect(() => {
    if (wsClient === null) return;

    // add listeners
    wsClient.on('onChat', handle_chat);
    wsClient.on('onTTS', handle_tts);
    wsClient.on('onStatus', handle_status);
    wsClient.on('onJobStart', handle_jobStart);
    wsClient.on('onJobEnd', handle_jobEnd);
    wsClient.start();

    // remove listeners
    return () => {
      wsClient.off('onChat');
      wsClient.off('onTTS');
      wsClient.off('onStatus');
      wsClient.off('onJobStart');
      wsClient.off('onJobEnd');
      wsClient.stop();
    };
  }, [wsClient]);

  // handler
  const handle_executeQuery = useCallback(
    async (query: string) => {
      setQuery('');
      setIsProcessing(true);
      await functions.executeQuery(query);
      setIsProcessing(false);
    },
    [functions]
  );
  const handle_transcribe = useCallback(
    async (audioBlob: Blob) => {
      setIsProcessing(true);
      await functions.transcribe(audioBlob);
      setIsProcessing(false);
    },
    [functions]
  );
  const handle_requestTTS = useCallback(
    async (message: string) => {
      setIsProcessing(true);
      await functions.requestTTS(message);
      setIsProcessing(false);
    },
    [functions]
  );

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            onTTS={() => handle_requestTTS(message.content)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area Component */}
      <QueryInputArea
        isProcessing={isProcessing}
        query={query}
        executeTitle={executeTitle}
        executeEmoji={executeEmoji}
        onChangeQuery={setQuery}
        onExecuteQuery={() =>
          onExecute(
            {
              executeQuery: handle_executeQuery,
              requestTTS: handle_requestTTS,
            },
            query
          )
        }
        onTranscribe={handle_transcribe}
      />
    </main>
  );
};
