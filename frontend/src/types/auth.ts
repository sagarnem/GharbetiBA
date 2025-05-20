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
}