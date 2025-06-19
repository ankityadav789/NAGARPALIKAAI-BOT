import { useState, useCallback } from 'react';
import { Message, Complaint, IssueCategory, ComplaintSession, ResolutionSession } from '../types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Welcome to Nagar Palika AI Assistant!\n\nI\'m here to help you with municipal services and report issues. You can:\n\n🔹 Report new complaints\n🔹 Check complaint status\n🔹 Get information about services\n🔹 Share feedback about our services\n🔹 View your complaint history\n\nTo get started, please select an issue category from the quick actions below, or type "help" for more options.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [complaintSession, setComplaintSession] = useState<ComplaintSession | null>(null);
  const [resolutionSession, setResolutionSession] = useState<ResolutionSession | null>(null);
  const [lastComplaint, setLastComplaint] = useState<Complaint | null>(null);

  const generateComplaintId = useCallback(() => {
    return `NP${Date.now().toString().slice(-6)}`;
  }, []);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot', type?: Message['type'], metadata?: Message['metadata']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type,
      metadata
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const simulateTyping = useCallback((duration: number = 1000) => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve(true);
      }, duration);
    });
  }, []);

  const processUserMessage = useCallback(async (userMessage: string, file?: File) => {
    // Add user message
    addMessage(userMessage, 'user');
    
    // Simulate typing
    await simulateTyping(1500);
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Handle resolution session flow
    if (resolutionSession) {
      if (resolutionSession.step === 'check') {
        const isResolved = lowerMessage.includes('yes') || lowerMessage.includes('resolved') || lowerMessage.includes('fixed') || lowerMessage.includes('solved');
        const isNotResolved = lowerMessage.includes('no') || lowerMessage.includes('not') || lowerMessage.includes('still') || lowerMessage.includes('problem');
        
        if (isResolved) {
          // Mark complaint as resolved with positive feedback
          setComplaints(prev => prev.map(complaint => 
            complaint.id === resolutionSession.complaintId 
              ? {
                  ...complaint,
                  status: 'resolved' as const,
                  resolutionFeedback: {
                    isResolved: true,
                    feedbackDate: new Date(),
                    userMessage: userMessage
                  }
                }
              : complaint
          ));
          
          addMessage(
            '🎉 **Great News!**\n\nThank you for confirming that your complaint has been resolved! We\'re glad we could help solve your issue.\n\n✅ **Status Updated:** Your complaint is now marked as RESOLVED\n⭐ **Feedback:** We appreciate your confirmation\n\n📊 **Help Us Improve:**\nYour feedback helps us serve citizens better. Consider sharing your experience using the Feedback button.\n\n🙏 Thank you for using Nagar Palika services!',
            'bot'
          );
          
          setResolutionSession(null);
          return;
        } else if (isNotResolved) {
          // Mark complaint as unresolved and offer WhatsApp option
          const complaint = complaints.find(c => c.id === resolutionSession.complaintId);
          
          setComplaints(prev => prev.map(c => 
            c.id === resolutionSession.complaintId 
              ? {
                  ...c,
                  status: 'unresolved' as const,
                  resolutionFeedback: {
                    isResolved: false,
                    feedbackDate: new Date(),
                    userMessage: userMessage
                  }
                }
              : c
          ));
          
          if (complaint) {
            setLastComplaint({
              ...complaint,
              status: 'unresolved',
              resolutionFeedback: {
                isResolved: false,
                feedbackDate: new Date(),
                userMessage: userMessage
              }
            });
          }
          
          addMessage(
            '😔 **We\'re Sorry to Hear That**\n\nWe understand your complaint is still not resolved. This is not the service standard we aim for.\n\n🚨 **Status Updated:** Your complaint is now marked as UNRESOLVED\n📝 **Your Feedback:** Recorded for priority action\n\n📞 **Immediate Action:**\nClick the WhatsApp button below to directly contact our support team with your complaint details. They will prioritize your case and provide immediate assistance.\n\n⚡ **Priority Support:** Unresolved complaints get highest priority\n🔄 **Follow-up:** We\'ll ensure regular updates until resolution\n\nWe apologize for the inconvenience and will work to resolve this quickly.',
            'bot'
          );
          
          setResolutionSession(null);
          return;
        } else {
          // Ask for clarification
          addMessage(
            '🤔 **Please Clarify**\n\nI need a clear answer to help you better. Please respond with:\n\n✅ **"Yes"** - if your problem has been resolved\n❌ **"No"** - if your problem is still not resolved\n\nThis helps us track our service quality and take appropriate action.',
            'bot',
            'resolution-check'
          );
          return;
        }
      }
    }
    
    // Handle complaint session flow
    if (complaintSession) {
      if (complaintSession.step === 'location') {
        // User provided location
        const updatedSession = { ...complaintSession, location: userMessage, step: 'description' as const };
        setComplaintSession(updatedSession);
        
        const categoryEmojis = {
          sanitation: '🧹',
          road: '🛣️',
          water: '💧',
          other: '📝'
        };
        
        addMessage(
          `📍 Location recorded: ${userMessage}\n\n${categoryEmojis[complaintSession.category!]} Now, please describe your ${complaintSession.category} issue in detail.\n\n📸 You can also attach images to help us understand the problem better.\n\n💡 Tip: Be specific about the problem, when it started, and how it affects you.`,
          'bot',
          'complaint-form'
        );
        return;
      } else if (complaintSession.step === 'description') {
        // User provided description - complete the complaint
        const images = file ? [file] : complaintSession.images || [];
        await handleComplaintSubmission(complaintSession.category!, complaintSession.location!, userMessage, images);
        setComplaintSession(null);
        return;
      }
    }
    
    // Status check
    if (lowerMessage.includes('status') || (lowerMessage.includes('complaint') && lowerMessage.includes('id'))) {
      const statusResponse = complaints.length > 0 
        ? `📋 Your Recent Complaints:\n\n${complaints.slice(-3).map(c => 
            `🆔 ${c.id}\n📝 ${c.category} - ${c.description.substring(0, 50)}...\n📍 Location: ${c.location}\n📊 Status: ${c.status.toUpperCase().replace('-', ' ')}\n⏰ ${c.timestamp.toLocaleDateString()}`
          ).join('\n\n')}\n\n💬 Need help with any complaint? Just mention the complaint ID!\n\n👁️ You can also click "My Complaints" in quick actions to view all complaints.`
        : '📋 No complaints found in our system.\n\nWould you like to report a new issue? Please select a category from the quick actions below.';
      
      addMessage(statusResponse, 'bot', 'status');
      return;
    }
    
    // Help command
    if (lowerMessage.includes('help') || lowerMessage.includes('menu')) {
      addMessage(
        '🔧 Here\'s how I can help you:\n\n📝 **Report Issues:**\n• Select category from quick actions\n• Provide location details\n• Describe the problem\n• Attach photos (optional)\n\n📊 **Check Status:**\n• Type "status" to see your complaints\n• Click "My Complaints" for detailed view\n• Mention complaint ID for specific updates\n\n💬 **Share Feedback:**\n• Click "Feedback" to rate our service\n• Help us improve with your suggestions\n\n📞 **Get Support:**\n• Use WhatsApp button for direct contact\n• Available 24/7 for urgent issues\n\nWhat would you like to do?',
        'bot',
        'menu'
      );
      return;
    }
    
    // Default response for unstructured input
    addMessage(
      '🤔 I\'d be happy to help you report an issue!\n\nTo ensure I can assist you properly, please:\n\n1️⃣ Select an issue category from the quick actions below\n2️⃣ Or type "help" to see all available options\n3️⃣ Use "My Complaints" to view your complaint history\n4️⃣ Click "Feedback" to share your experience\n\nThis helps me guide you through the proper complaint process.',
      'bot'
    );
  }, [addMessage, simulateTyping, complaints, complaintSession, resolutionSession]);

  const handleComplaintSubmission = useCallback(async (category: IssueCategory, location: string, description: string, images: File[]) => {
    const complaintId = generateComplaintId();
    
    // Convert files to base64 for storage (in a real app, you'd upload to a server)
    const imageUrls: string[] = [];
    for (const file of images) {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      imageUrls.push(base64);
    }
    
    const newComplaint: Complaint = {
      id: complaintId,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      description,
      location,
      images: imageUrls,
      status: 'pending',
      timestamp: new Date()
    };
    
    setComplaints(prev => [...prev, newComplaint]);
    setLastComplaint(newComplaint);
    
    const categoryEmojis = {
      sanitation: '🧹',
      road: '🛣️',
      water: '💧',
      other: '📝'
    };
    
    const responseText = `✅ **Complaint Successfully Registered!**\n\n🆔 **Complaint ID:** ${complaintId}\n${categoryEmojis[category]} **Category:** ${newComplaint.category}\n📍 **Location:** ${location}\n📝 **Description:** ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}\n${images.length > 0 ? `📸 **Images:** ${images.length} attached\n` : ''}📊 **Status:** PENDING\n\n⏰ **Expected Resolution:** 3-5 working days\n📱 **Updates:** You'll receive notifications via SMS/WhatsApp\n\n🔍 **Track Status:** Click "My Complaints" to view all your complaints\n💬 **Need Help:** Use WhatsApp button to share complaint details\n⭐ **Feedback:** Share your experience using the Feedback button`;
    
    addMessage(responseText, 'bot', 'complaint');
  }, [generateComplaintId, addMessage]);

  const handleQuickAction = useCallback(async (category: IssueCategory) => {
    // Start complaint session
    setComplaintSession({ step: 'location', category });
    
    // Simulate typing
    await simulateTyping(1000);
    
    const categoryInfo = {
      sanitation: {
        emoji: '🧹',
        name: 'Sanitation Issue',
        examples: 'garbage collection, waste management, cleanliness'
      },
      road: {
        emoji: '🛣️',
        name: 'Road Issue',
        examples: 'potholes, street damage, traffic signals'
      },
      water: {
        emoji: '💧',
        name: 'Water Supply Issue',
        examples: 'water shortage, pipe leaks, quality issues'
      },
      other: {
        emoji: '📝',
        name: 'Other Municipal Issue',
        examples: 'street lights, parks, general complaints'
      }
    };
    
    const info = categoryInfo[category];
    
    addMessage(
      `${info.emoji} **${info.name} Selected**\n\nGreat! I'll help you report this issue. Let's start with some basic information.\n\n📍 **Step 1: Location Details**\n\nPlease provide the exact location where the issue is occurring:\n\n• Street name and number\n• Landmark or nearby reference\n• Area/locality name\n• Any specific details to help locate the problem\n\n💡 **Examples for ${info.name.toLowerCase()}:** ${info.examples}\n\nPlease type your location details:`,
      'bot',
      'category-selection',
      { category }
    );
  }, [simulateTyping, addMessage]);

  const handleResolutionCheck = useCallback(async (complaintId: string) => {
    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint) return;
    
    setResolutionSession({ complaintId, step: 'check' });
    
    // Simulate typing
    await simulateTyping(1000);
    
    addMessage(
      `🔍 **Resolution Check for Complaint #${complaintId}**\n\n📝 **Issue:** ${complaint.category} - ${complaint.description.substring(0, 100)}${complaint.description.length > 100 ? '...' : ''}\n📍 **Location:** ${complaint.location}\n📅 **Reported:** ${complaint.timestamp.toLocaleDateString()}\n\n❓ **Has your problem been resolved?**\n\nPlease respond with:\n✅ **"Yes"** - if the problem has been fixed\n❌ **"No"** - if the problem still exists\n\nYour feedback helps us improve our services and take appropriate action.`,
      'bot',
      'resolution-check',
      { complaintId }
    );
  }, [complaints, simulateTyping, addMessage]);

  const handleWhatsAppRedirect = useCallback(() => {
    const phoneNumber = '918808201876';
    let message = '';
    
    if (lastComplaint) {
      if (lastComplaint.resolutionFeedback && !lastComplaint.resolutionFeedback.isResolved) {
        // Unresolved complaint message
        message = encodeURIComponent(
          `🚨 URGENT: Unresolved Complaint\n\n` +
          `Hello Nagar Palika Support Team,\n\n` +
          `My problem is NOT RESOLVED yet. Please solve it rapidly as much as possible.\n\n` +
          `📋 COMPLAINT DETAILS:\n` +
          `🆔 ID: ${lastComplaint.id}\n` +
          `📝 Category: ${lastComplaint.category}\n` +
          `📍 Location: ${lastComplaint.location}\n` +
          `📋 Description: ${lastComplaint.description}\n` +
          `📊 Status: ${lastComplaint.status.toUpperCase()}\n` +
          `📅 Reported: ${lastComplaint.timestamp.toLocaleDateString()}\n` +
          `📅 Feedback Date: ${lastComplaint.resolutionFeedback.feedbackDate.toLocaleDateString()}\n\n` +
          `💬 User Feedback: "${lastComplaint.resolutionFeedback.userMessage}"\n\n` +
          `⚡ PRIORITY REQUEST: This complaint needs immediate attention as it remains unresolved.\n\n` +
          `Please provide immediate assistance and regular updates until this issue is completely resolved.\n\n` +
          `Thank you for your urgent attention to this matter.`
        );
      } else {
        // Regular complaint message
        message = encodeURIComponent(
          `Hello Nagar Palika,\n\nComplaint Done!\n\nComplaint Details:\n` +
          `🆔 ID: ${lastComplaint.id}\n` +
          `📝 Category: ${lastComplaint.category}\n` +
          `📍 Location: ${lastComplaint.location}\n` +
          `📋 Description: ${lastComplaint.description}\n` +
          `📊 Status: ${lastComplaint.status.toUpperCase()}\n` +
          `📅 Date: ${lastComplaint.timestamp.toLocaleDateString()}\n\n` +
          `Please provide updates on this complaint. Thank you!`
        );
      }
    } else {
      // Default message if no complaint
      message = encodeURIComponent('Hello Nagar Palika, I want to connect regarding municipal services.');
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }, [lastComplaint]);

  return {
    messages,
    complaints,
    isTyping,
    complaintSession,
    resolutionSession,
    lastComplaint,
    processUserMessage,
    handleQuickAction,
    handleResolutionCheck,
    handleWhatsAppRedirect
  };
};