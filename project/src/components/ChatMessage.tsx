import React from 'react';
import { Message } from '../types/chat';
import { Bot, User, Clock, CheckCircle, AlertCircle, FileText, MapPin, Camera, Shield, Building2 } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  const getMessageIcon = () => {
    if (!isBot) return <User size={16} />;
    
    switch (message.type) {
      case 'welcome':
        return <Building2 size={16} />;
      case 'menu':
        return <FileText size={16} />;
      case 'complaint':
        return <Shield size={16} />;
      case 'status':
        return <Clock size={16} />;
      case 'category-selection':
        return <FileText size={16} />;
      case 'location-request':
        return <MapPin size={16} />;
      case 'complaint-form':
        return <Camera size={16} />;
      default:
        return <Bot size={16} />;
    }
  };

  const getMessageStyles = () => {
    if (!isBot) {
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
    }
    
    switch (message.type) {
      case 'welcome':
        return 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 text-emerald-900 border-2 border-emerald-200 shadow-lg';
      case 'complaint':
        return 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 text-green-900 border-2 border-green-300 shadow-lg';
      case 'status':
        return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 text-blue-900 border-2 border-blue-300 shadow-lg';
      case 'category-selection':
        return 'bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 text-purple-900 border-2 border-purple-300 shadow-lg';
      case 'location-request':
        return 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 text-orange-900 border-2 border-orange-300 shadow-lg';
      case 'complaint-form':
        return 'bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 text-indigo-900 border-2 border-indigo-300 shadow-lg';
      default:
        return 'bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 text-gray-800 border-2 border-gray-200 shadow-md';
    }
  };

  const getStepIndicator = () => {
    if (!isBot || !message.type) return null;
    
    const stepInfo = {
      'category-selection': { step: 1, total: 3, label: 'Category Selected', color: 'text-purple-700' },
      'location-request': { step: 2, total: 3, label: 'Location Required', color: 'text-orange-700' },
      'complaint-form': { step: 3, total: 3, label: 'Describe Issue', color: 'text-indigo-700' }
    };
    
    const info = stepInfo[message.type as keyof typeof stepInfo];
    if (!info) return null;
    
    return (
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-current/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: info.total }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  i < info.step 
                    ? 'bg-current border-current shadow-sm' 
                    : 'bg-transparent border-current/40'
                }`}
              />
            ))}
          </div>
          <div className="h-4 w-px bg-current/30"></div>
          <span className={`text-sm font-bold ${info.color} tracking-wide`}>
            STEP {info.step} OF {info.total}
          </span>
        </div>
        <div className="text-xs font-semibold opacity-80 uppercase tracking-wider">
          {info.label}
        </div>
      </div>
    );
  };

  const getOfficialHeader = () => {
    if (!isBot || !message.type) return null;
    
    const headerInfo = {
      'welcome': { 
        title: 'MUNICIPAL CORPORATION', 
        subtitle: 'Digital Citizen Services Portal',
        icon: Building2
      },
      'complaint': { 
        title: 'COMPLAINT REGISTRATION', 
        subtitle: 'Official Acknowledgment',
        icon: Shield
      },
      'status': { 
        title: 'COMPLAINT STATUS', 
        subtitle: 'Service Tracking System',
        icon: Clock
      },
      'category-selection': { 
        title: 'SERVICE CATEGORY', 
        subtitle: 'Issue Classification',
        icon: FileText
      },
      'location-request': { 
        title: 'LOCATION VERIFICATION', 
        subtitle: 'Geographic Information Required',
        icon: MapPin
      },
      'complaint-form': { 
        title: 'COMPLAINT DETAILS', 
        subtitle: 'Issue Documentation',
        icon: Camera
      }
    };
    
    const info = headerInfo[message.type as keyof typeof headerInfo];
    if (!info) return null;
    
    const HeaderIcon = info.icon;
    
    return (
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-current/20">
        <div className="w-8 h-8 bg-current/10 rounded-lg flex items-center justify-center">
          <HeaderIcon size={18} className="text-current" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold tracking-widest opacity-90 uppercase">
            {info.title}
          </div>
          <div className="text-xs opacity-70 font-medium">
            {info.subtitle}
          </div>
        </div>
        <div className="text-xs opacity-60 font-mono">
          REF: {Date.now().toString().slice(-6)}
        </div>
      </div>
    );
  };
  
  return (
    <div className={`flex items-start gap-3 mb-6 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md border-2 ${
        isBot ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'
      }`}>
        {getMessageIcon()}
      </div>
      
      <div className={`max-w-xs lg:max-w-md px-5 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl ${
        isBot ? 'rounded-tl-md' : 'rounded-tr-md'
      } ${getMessageStyles()}`}>
        {getOfficialHeader()}
        {getStepIndicator()}
        
        <div className="text-sm leading-relaxed whitespace-pre-line font-medium">
          {message.text}
        </div>
        
        {/* Display images if any */}
        {message.metadata?.images && message.metadata.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {message.metadata.images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Complaint image ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border-2 border-current/20 shadow-sm"
              />
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-current/20">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60"></div>
            <p className="text-xs font-mono opacity-75">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </p>
          </div>
          
          {message.type === 'complaint' && (
            <div className="flex items-center gap-2 px-2 py-1 bg-green-200/50 rounded-full">
              <CheckCircle size={12} className="text-green-700" />
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
                REGISTERED
              </span>
            </div>
          )}
          
          {isBot && message.type !== 'complaint' && (
            <div className="flex items-center gap-1 text-xs opacity-60">
              <Shield size={10} />
              <span className="font-mono">OFFICIAL</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};