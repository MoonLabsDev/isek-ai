'use client';

import { useRef, useState } from 'react';

export interface QueryInputAreaProps {
  isProcessing: boolean;
  query: string;
  executeTitle?: string;
  executeEmoji?: string;
  onChangeQuery: (query: string) => void;
  onExecuteQuery: (query: string) => Promise<void>;
  onTranscribe?: (audioBlob: Blob) => Promise<void>;
}

export const QueryInputArea = ({
  isProcessing,
  query,
  executeTitle = 'Execute Query',
  executeEmoji = '🚀',
  onExecuteQuery,
  onChangeQuery,
  onTranscribe,
}: QueryInputAreaProps) => {
  // state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // functions
  const handle_startRecording = async () => {
    if (!onTranscribe) return;
    try {
      // check if we're on HTTPS
      if (
        window.location.protocol !== 'https:' &&
        !window.location.hostname.includes('localhost')
      ) {
        throw new Error('Audio recording requires HTTPS');
      }

      // get audio stream with mobile-friendly constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1,
        },
      });

      // create media recorder with mobile-friendly options
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
        audioBitsPerSecond: 16000,
      });

      // set Refs
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // set event listeners
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        try {
          // Convert to WAV format for compatibility
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/wav',
          });
          await onTranscribe(audioBlob);
        } catch (error) {
          console.error('🎙️ Error processing audio:', error);
        }
      };

      // start recording with a small timeslice for better mobile performance
      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error('🎙️ Error accessing microphone:', error);
    }
  };
  const handle_stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach(track => track.stop());
      setIsRecording(false);
    }
  };
  const handle_submit = async (e: React.FormEvent, query: string) => {
    e.preventDefault();
    const cleanedQuery = query.trim();
    if (cleanedQuery) await onExecuteQuery(cleanedQuery);
  };

  return (
    <div className="bg-white border-t p-4">
      {/* Text Input Component */}
      <form onSubmit={e => handle_submit(e, query)} className="flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={e => onChangeQuery(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          type="button"
          onClick={isRecording ? handle_stopRecording : handle_startRecording}
          disabled={isProcessing}
          className={`px-4 py-2 rounded-lg text-white font-medium transition-colors bg-blue-500 hover:bg-blue-600 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? '🔴' : '🎙️'}
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={executeTitle}
        >
          {executeEmoji}
        </button>
      </form>
    </div>
  );
};
