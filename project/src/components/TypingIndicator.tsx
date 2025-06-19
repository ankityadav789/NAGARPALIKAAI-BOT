import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
        <Bot size={16} />
      </div>
      <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">AI is typing...</span>
        </div>
      </div>
    </div>
  );
};