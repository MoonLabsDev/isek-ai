export interface ChatMessageData {
  type: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export interface ChatMessageProps {
  message: ChatMessageData;
  onTTS?: () => void;
}

export const ChatMessage = ({ message, onTTS }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          message.type === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-800'
        }`}
      >
        <div className="flex items-center">
          {message.content}
          {message.isLoading && (
            <span className="ml-2 inline-flex">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </span>
          )}
        </div>
        {message.type === 'assistant' && !message.isLoading && (
          <div className="mt-2 flex justify-end space-x-2 border-t pt-2">
            <button
              onClick={onTTS}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
              title="Text to Speech"
            >
              🔊
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
