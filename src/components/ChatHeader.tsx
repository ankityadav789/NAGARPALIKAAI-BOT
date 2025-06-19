import React from 'react';
import { Building2, Clock, CheckCircle, LogOut, Pin, PinOff, User, Settings } from 'lucide-react';
import { User as UserType } from '../types/auth';

interface ChatHeaderProps {
  onlineStatus: boolean;
  lastSeen?: Date;
  user: UserType;
  onLogout: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
  onOpenProfile?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onlineStatus, 
  lastSeen, 
  user, 
  onLogout,
  isPinned = false,
  onTogglePin,
  onOpenProfile
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Building2 size={20} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg">Nagar Palika Chatbot</h1>
              {isPinned && (
                <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
                  <Pin size={12} />
                  <span className="text-xs font-medium">PINNED</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-green-100">
              {onlineStatus ? (
                <>
                  <CheckCircle size={12} />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <Clock size={12} />
                  <span>Last seen: {lastSeen?.toLocaleTimeString() || 'Recently'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-2 transition-colors duration-200 group"
              title="Edit Profile"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {getInitials(user.name)}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-green-100">{user.email}</p>
              </div>
              <Settings size={14} className="text-green-100 group-hover:text-white transition-colors" />
            </button>
          </div>
          
          {onTogglePin && (
            <button
              onClick={onTogglePin}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
              title={isPinned ? "Unpin Chat" : "Pin Chat"}
            >
              {isPinned ? (
                <PinOff size={18} className="group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <Pin size={18} className="group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>
          )}
          
          <button
            onClick={onLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
            title="Logout"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};