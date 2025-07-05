"use client";
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Head from 'next/head';
// import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { ResetPasswordConfirmFormData, ApiResponse } from '@/types/auth';

export default function OTPVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  // const [resendLoading, setResendLoading] = useState(false);
  const email = searchParams.get('email');
  const purpose = searchParams.get('purpose');

  const handleResendOTP = async () => {
  if (!email || !purpose) {
    toast.error('Missing email or purpose for resending OTP');
    return;
  }

  // setResendLoading(true);
  try {
    // Adjust endpoint & payload based on your backend API design
    // Example endpoint for resend OTP (adjust if needed):
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/request-reset/`,
      {
        email,
        purpose,
      }
    );
    toast.success('New OTP sent to your email');
  } catch (error) {
    // Handle error appropriately
    // You can customize the error message based on your API response 
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.error || 'Failed to resend OTP');
    }

  } finally {
    // setResendLoading(false);
  }
};

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordConfirmFormData>({
    defaultValues: {
      email: email || '',
    },
  });

  const newPassword = watch('new_password');

  if (!email || !purpose) {
    return <p className="text-red-500">Missing email or purpose in query params.</p>;
  }

  const onSubmit = async (data: ResetPasswordConfirmFormData) => {
    setLoading(true);
    try {
      const endpoint =
        purpose === 'register'
          ? '/user/verify-otp/'
          : '/user/confirm-reset/';

      const payload =
        purpose === 'reset-password'
          ? {
              email: data.email,
              code: data.code,
              new_password: data.new_password,
            }
          : {
              email: data.email,
              code: data.code,
            };

      await axios.post<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        payload
      );

      if (purpose === 'register') {
        toast.success('Email verified successfully! Please complete your profile.');
        router.push('/auth/profile');
      } else {
        toast.success('Password reset successful! You can now login with your new password.');
        router.push('/auth/login');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.error || 'OTP verification failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>OTP Verification | Property Management</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {purpose === 'register' ? 'Verify Your Email' : 'Reset Your Password'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We&aposve sent a 6-digit code to {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register('email')} />

            {/* OTP field */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  {...register('code', {
                    required: 'OTP is required',
                    minLength: { value: 6, message: 'OTP must be 6 digits' },
                    maxLength: { value: 6, message: 'OTP must be 6 digits' },
                  })}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.code ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              </div>
              {errors.code && (
                <p className="mt-2 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            {/* Password fields only for reset */}
            {purpose === 'reset-password' && (
              <>
                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="new_password"
                      type="password"
                      autoComplete="new-password"
                      {...register('new_password', {
                        required: 'New password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                      })}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.new_password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                  {errors.new_password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.new_password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirm_password"
                      type="password"
                      autoComplete="new-password"
                      {...register('confirm_password', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === newPassword || 'Passwords do not match',
                      })}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                  {errors.confirm_password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading
                  ? 'Verifying...'
                  : purpose === 'register'
                  ? 'Verify Email'
                  : 'Reset Password'}
              </button>
            </div>
          </form>

          {/* Resend OTP Placeholder */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick = {handleResendOTP}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
