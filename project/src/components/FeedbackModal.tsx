import React, { useState } from 'react';
import { X, Star, Send, MessageSquare, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: { rating: number; message: string; category: string; isResolved?: boolean }) => void;
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
  const [isResolved, setIsResolved] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    if (isResolved === null) {
      alert('Please let us know if your problem was resolved');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    onSubmitFeedback({ rating, message, category, isResolved });
    
    // Reset form
    setRating(0);
    setHoveredRating(0);
    setMessage('');
    setCategory('general');
    setIsResolved(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleWhatsAppComplaint = () => {
    const phoneNumber = '918808201876';
    const complaintMessage = encodeURIComponent(
      `Hello Nagar Palika,\n\n❌ My problem is NOT resolved yet!\n\n` +
      `Please solve it rapidly as much as possible.\n\n` +
      `Additional Details:\n${message || 'No additional details provided'}\n\n` +
      `I need urgent assistance with this matter. Thank you!`
    );
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${complaintMessage}`;
    window.open(whatsappUrl, '_blank');
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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
          {/* Problem Resolution Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Was your problem resolved?</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsResolved(true)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                  isResolved === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300 text-gray-600'
                }`}
              >
                <CheckCircle size={24} className={isResolved === true ? 'text-green-600' : 'text-gray-400'} />
                <span className="font-semibold">Yes, Resolved</span>
                <span className="text-xs text-center">Problem was fixed successfully</span>
              </button>
              
              <button
                type="button"
                onClick={() => setIsResolved(false)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                  isResolved === false
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-red-300 text-gray-600'
                }`}
              >
                <AlertCircle size={24} className={isResolved === false ? 'text-red-600' : 'text-gray-400'} />
                <span className="font-semibold">No, Not Resolved</span>
                <span className="text-xs text-center">Still facing the issue</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Complaint Option for Unresolved Issues */}
          {isResolved === false && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle size={20} className="text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Problem Not Resolved?</h4>
                  <p className="text-sm text-red-700">We're sorry to hear that. Get immediate assistance via WhatsApp.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleWhatsAppComplaint}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                <span>Complain on WhatsApp - Urgent Help</span>
              </button>
            </div>
          )}

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
              Your Feedback {isResolved === false ? '(Required for unresolved issues)' : '(Optional)'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isResolved === false 
                  ? "Please describe what's still not working and what you need help with..."
                  : "Tell us more about your experience..."
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              required={isResolved === false}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || isResolved === null || (isResolved === false && !message.trim())}
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