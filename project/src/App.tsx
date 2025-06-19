import React, { useEffect, useRef, useState } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { QuickActions } from './components/QuickActions';
import { TypingIndicator } from './components/TypingIndicator';
import { LoginPage } from './components/LoginPage';
import { ProfileModal } from './components/ProfileModal';
import { ComplaintListModal } from './components/ComplaintListModal';
import { FeedbackModal } from './components/FeedbackModal';
import { useChat } from './hooks/useChat';
import { useAuth } from './hooks/useAuth';

function App() {
  const {
    messages,
    isTyping,
    lastComplaint,
    complaints,
    processUserMessage,
    handleQuickAction,
    handleWhatsAppRedirect
  } = useChat();
  
  const {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateProfile,
    checkAuthStatus
  } = useAuth();
  
  const [isPinned, setIsPinned] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
    // In a real app, you might want to persist this state
    localStorage.setItem('chatPinned', (!isPinned).toString());
  };

  const handleFeedbackSubmit = (feedback: { rating: number; message: string; category: string }) => {
    // In a real app, you would send this to your backend
    console.log('Feedback submitted:', feedback);
    
    // Show a success message
    alert(`Thank you for your ${feedback.rating}-star feedback! We appreciate your input.`);
  };

  useEffect(() => {
    checkAuthStatus();
    // Check if chat was previously pinned
    const pinned = localStorage.getItem('chatPinned') === 'true';
    setIsPinned(pinned);
  }, [checkAuthStatus]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} isLoading={isLoading} />;
  }

  // Show main chat interface if authenticated
  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50 ${
      isPinned ? 'fixed top-0 left-0 right-0 z-50' : ''
    }`}>
      {/* Chat Header */}
      <ChatHeader 
        onlineStatus={true} 
        user={user!}
        onLogout={logout}
        isPinned={isPinned}
        onTogglePin={handleTogglePin}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 m-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                🏛️
              </div>
              <div>
                <h2 className="text-xl font-bold">Welcome back, {user?.name.split(' ')[0]}!</h2>
                <p className="text-green-100 text-sm">Municipal AI Assistant - Serving citizens 24/7</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-green-100">Available</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl font-bold">AI</div>
                <div className="text-xs text-green-100">Powered</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl font-bold">Fast</div>
                <div className="text-xs text-green-100">Response</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl font-bold">Secure</div>
                <div className="text-xs text-green-100">& Private</div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="px-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="transform transition-all duration-300 ease-out animate-fade-in"
              >
                <ChatMessage message={message} />
              </div>
            ))}
            
            {isTyping && (
              <div className="transform transition-all duration-300 ease-out">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <QuickActions 
            onSelectCategory={handleQuickAction}
            onWhatsAppClick={handleWhatsAppRedirect}
            onFeedbackClick={() => setIsFeedbackModalOpen(true)}
            onViewComplaints={() => setIsComplaintModalOpen(true)}
            lastComplaint={lastComplaint}
          />
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            onSendMessage={processUserMessage}
            disabled={isTyping}
          />
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        user={user}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateProfile={updateProfile}
      />

      <ComplaintListModal
        complaints={complaints}
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmitFeedback={handleFeedbackSubmit}
      />
    </div>
  );
}

export default App;