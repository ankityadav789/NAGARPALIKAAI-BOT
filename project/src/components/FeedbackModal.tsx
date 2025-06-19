import React, { useState } from 'react';
import { X, Star, Send, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: { rating: number; message: string; category: string }) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    onSubmitFeedback({ rating, message, category });
    
    // Reset form
    setRating(0);
    setHoveredRating(0);
    setMessage('');
    setCategory('general');
    setIsSubmitting(false);
    onClose();
  };

  const categories = [
    { value: 'general', label: 'General Experience' },
    { value: 'service', label: 'Service Quality' },
    { value: 'response', label: 'Response Time' },
    { value: 'interface', label: 'User Interface' },
    { value: 'suggestion', label: 'Suggestion' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Share Your Feedback</h2>
              <p className="text-green-100 text-sm">Help us improve our services</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating Section */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How was your experience?</h3>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {rating === 0 && 'Click to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Feedback Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MessageSquare size={16} className="inline mr-2" />
              Your Feedback (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};