export interface User {
  _id: string;
  mobile: string;
  name?: string;
  businessName?: string;
  location?: string;
  businessType?: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  trialEnd?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}