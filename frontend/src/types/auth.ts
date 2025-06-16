export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  role: 'owner' | 'tenant' | 'superuser';
}

export interface OTPVerifyFormData {
  email: string;
  code: string;
}

export interface ResetPasswordRequestFormData {
  email: string;
}

export interface ResetPasswordConfirmFormData {
  email: string;
  code: string;
  new_password: string;
  confirm_password?: string;
}

export interface ChangePasswordFormData {
  old_password: string;
  new_password: string;
}

export interface ApiResponse {
  message?: string;
  error?: string;
  access?: string;
  refresh?: string;
  user:[];
}

export interface UserProfile {
  id?: number;
  full_name: string;
  phone_number_1: string;
  phone_number_2: string;
  date_of_birth: string | null;
  location: string;
  photo?: File | string | null;
  bio: string;
}
