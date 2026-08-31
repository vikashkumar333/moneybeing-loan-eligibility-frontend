export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message?: string;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
}

export interface CurrentUserResponse {
  status: string;
  data: User;
}
