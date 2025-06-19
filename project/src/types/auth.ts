export interface User {
  id: string;
  email: string;
  name: string;
  loginTime: Date;
  profilePicture?: string;
  phone?: string;
  address?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}