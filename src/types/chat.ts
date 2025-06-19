export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'welcome' | 'menu' | 'complaint' | 'status' | 'category-selection' | 'location-request' | 'complaint-form';
  metadata?: {
    category?: IssueCategory;
    location?: string;
    images?: string[];
  };
}

export interface Complaint {
  id: string;
  category: string;
  description: string;
  location: string;
  images?: string[];
  status: 'pending' | 'in-progress' | 'resolved';
  timestamp: Date;
}

export type IssueCategory = 'sanitation' | 'road' | 'water' | 'other';

export interface ComplaintSession {
  step: 'category' | 'location' | 'description' | 'completed';
  category?: IssueCategory;
  location?: string;
  description?: string;
  images?: File[];
}