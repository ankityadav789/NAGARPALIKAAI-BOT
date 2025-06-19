import React, { useState } from 'react';
import { Trash2, Wrench, Droplets, FileText, MessageCircle, Sparkles, ArrowRight, ChevronUp, ChevronDown, MessageSquare, Eye } from 'lucide-react';
import { IssueCategory, Complaint } from '../types/chat';

interface QuickActionsProps {
  onSelectCategory: (category: IssueCategory) => void;
  onWhatsAppClick: () => void;
  onFeedbackClick: () => void;
  onViewComplaints: () => void;
  lastComplaint?: Complaint | null;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  onSelectCategory, 
  onWhatsAppClick,
  onFeedbackClick,
  onViewComplaints,
  lastComplaint
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const categories = [
    { 
      id: 'sanitation' as IssueCategory, 
      label: 'Sanitation', 
      icon: Trash2, 
      color: 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 hover:from-orange-200 hover:to-orange-300 border border-orange-200',
      description: 'Garbage, waste management',
      examples: 'Overflowing bins, missed collection'
    },
    { 
      id: 'road' as IssueCategory, 
      label: 'Road Issues', 
      icon: Wrench, 
      color: 'bg-gradient-to-br from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300 border border-red-200',
      description: 'Potholes, street damage',
      examples: 'Broken roads, traffic signals'
    },
    { 
      id: 'water' as IssueCategory, 
      label: 'Water Supply', 
      icon: Droplets, 
      color: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300 border border-blue-200',
      description: 'Supply issues, leaks',
      examples: 'No water, pipe bursts'
    },
    { 
      id: 'other' as IssueCategory, 
      label: 'Other Issues', 
      icon: FileText, 
      color: 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-200',
      description: 'General complaints',
      examples: 'Street lights, parks'
    },
  ];

  const handleCategorySelect = (category: IssueCategory) => {
    onSelectCategory(category);
    setIsVisible(false);
  };

  const handleWhatsAppClick = () => {
    onWhatsAppClick();
    setIsVisible(false);
  };

  const handleFeedbackClick = () => {
    onFeedbackClick();
    setIsVisible(false);
  };

  const handleViewComplaints = () => {
    onViewComplaints();
    setIsVisible(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const getWhatsAppButtonText = () => {
    if (lastComplaint) {
      return {
        title: "Share Complaint on WhatsApp",
        subtitle: `Send complaint ${lastComplaint.id} details`
      };
    }
    return {
      title: "Chat on WhatsApp",
      subtitle: "Direct support available 24/7"
    };
  };

  const whatsAppText = getWhatsAppButtonText();

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-green-600" />
        <h3 className="text-sm font-semibold text-gray-800">Quick Actions</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
        <button
          onClick={toggleVisibility}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          title={isVisible ? "Hide Quick Actions" : "Show Quick Actions"}
        >
          {isVisible ? (
            <ChevronUp size={16} className="text-gray-600" />
          ) : (
            <ChevronDown size={16} className="text-gray-600" />
          )}
        </button>
      </div>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`group relative flex flex-col items-start gap-3 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${category.color}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon size={20} className="group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                  <span className="text-sm font-semibold">{category.label}</span>
                  <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                
                <div className="text-left w-full">
                  <p className="text-xs opacity-75 mb-1">{category.description}</p>
                  <p className="text-xs opacity-60 italic">e.g., {category.examples}</p>
                </div>
                
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleFeedbackClick}
            className="group relative flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
          >
            <MessageSquare size={20} className="group-hover:scale-110 transition-transform duration-200" />
            <div className="text-center">
              <span className="text-sm font-semibold block">Feedback</span>
              <span className="text-xs text-white/80">Share your experience</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>

          <button
            onClick={handleViewComplaints}
            className="group relative flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
          >
            <Eye size={20} className="group-hover:scale-110 transition-transform duration-200" />
            <div className="text-center">
              <span className="text-sm font-semibold block">My Complaints</span>
              <span className="text-xs text-white/80">View complaint history</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>

        <button
          onClick={handleWhatsAppClick}
          className={`w-full group relative flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
            lastComplaint 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          } text-white`}
        >
          <MessageCircle size={20} className="group-hover:scale-110 transition-transform duration-200" />
          <div className="text-center">
            <span className="text-sm font-semibold block">{whatsAppText.title}</span>
            <span className="text-xs text-white/80">{whatsAppText.subtitle}</span>
          </div>
          <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>
      </div>
    </div>
  );
};