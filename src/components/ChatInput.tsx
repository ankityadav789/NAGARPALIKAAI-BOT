import React, { useState } from 'react';
import { Send, Paperclip, X, Image } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled, 
  placeholder = "Type your message here..." 
}) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSendMessage(message.trim(), selectedFile || undefined);
      setMessage('');
      clearFile();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file only.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB.');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      {selectedFile && (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            {previewUrl && (
              <div className="flex-shrink-0">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Image size={16} className="text-green-600" />
                <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
              </div>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Image
              </p>
            </div>
            <button
              onClick={clearFile}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <div className="flex items-end bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-green-300 focus-within:ring-2 focus-within:ring-green-100 transition-all duration-200">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              className="flex-1 p-4 bg-transparent resize-none outline-none text-sm max-h-32 min-h-[3rem] placeholder-gray-500"
              rows={1}
              disabled={disabled}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              style={{
                height: 'auto',
                minHeight: '3rem'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            <label className="p-3 cursor-pointer text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 group">
              <Paperclip size={18} className="group-hover:scale-110 transition-transform duration-200" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
              />
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={disabled || (!message.trim() && !selectedFile)}
          className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none group"
        >
          <Send size={18} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>
      </form>
      
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>Max file size: 5MB</span>
      </div>
    </div>
  );
};