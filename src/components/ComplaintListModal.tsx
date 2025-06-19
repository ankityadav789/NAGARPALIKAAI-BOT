import React from 'react';
import { X, Clock, CheckCircle, AlertCircle, Calendar, MapPin, FileText, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Complaint } from '../types/chat';

interface ComplaintListModalProps {
  complaints: Complaint[];
  isOpen: boolean;
  onClose: () => void;
  onResolutionCheck: (complaintId: string) => void;
}

export const ComplaintListModal: React.FC<ComplaintListModalProps> = ({
  complaints,
  isOpen,
  onClose,
  onResolutionCheck
}) => {
  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-orange-500" />;
      case 'in-progress':
        return <AlertCircle size={16} className="text-blue-500" />;
      case 'resolved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'unresolved':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unresolved':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canCheckResolution = (complaint: Complaint) => {
    return complaint.status === 'resolved' && !complaint.resolutionFeedback;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">My Complaints</h2>
              <p className="text-green-100 text-sm">
                {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {complaints.length === 0 ? (
            <div className="p-8 text-center">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Complaints Found</h3>
              <p className="text-gray-500">You haven't submitted any complaints yet.</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText size={18} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">#{complaint.id}</h3>
                        <p className="text-sm text-gray-600 capitalize">{complaint.category}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1 ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      {complaint.status.toUpperCase().replace('-', ' ')}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{complaint.location}</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <FileText size={14} className="text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-700 line-clamp-2">{complaint.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <p className="text-xs text-gray-500">
                        Submitted on {complaint.timestamp.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    {complaint.images && complaint.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {complaint.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Complaint image ${index + 1}`}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                        {complaint.images.length > 3 && (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{complaint.images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Resolution Feedback Display */}
                    {complaint.resolutionFeedback && (
                      <div className={`mt-3 p-3 rounded-lg border-2 ${
                        complaint.resolutionFeedback.isResolved 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {complaint.resolutionFeedback.isResolved ? (
                            <ThumbsUp size={16} className="text-green-600" />
                          ) : (
                            <ThumbsDown size={16} className="text-red-600" />
                          )}
                          <span className={`text-sm font-semibold ${
                            complaint.resolutionFeedback.isResolved ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {complaint.resolutionFeedback.isResolved ? 'Problem Resolved' : 'Problem Not Resolved'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Feedback given on {complaint.resolutionFeedback.feedbackDate.toLocaleDateString()}
                        </p>
                        {complaint.resolutionFeedback.userMessage && (
                          <p className="text-sm text-gray-700 mt-2 italic">
                            "{complaint.resolutionFeedback.userMessage}"
                          </p>
                        )}
                      </div>
                    )}

                    {/* Resolution Check Button */}
                    {canCheckResolution(complaint) && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => onResolutionCheck(complaint.id)}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <MessageCircle size={16} />
                          Check if Problem is Resolved
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};