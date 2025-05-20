"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/outline';
import { OTPVerifyFormData, ApiResponse } from '@/types/auth';

export default function OTPVerification() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { email, purpose } = router.query;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPVerifyFormData>({
    defaultValues: {
      email: email as string,
    },
  });

  const onSubmit = async (data: OTPVerifyFormData) => {
    setLoading(true);
    try {
      const endpoint =
        purpose === 'register'
          ? '/verify-otp/'
          : '/confirm-reset/';
      const response = await axios.post<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        data
      );

      toast.success(
        purpose === 'register'
          ? 'Email verified successfully! You can now login.'
          : 'Password reset successful! You can now login with your new password.'
      );
      router.push('/login');
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
          We've sent a 6-digit code to {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register('email')} />

            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
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
                  pattern="[0-9]*"
                  maxLength={6}
                  {...register('code', {
                    required: 'OTP is required',
                    minLength: {
                      value: 6,
                      message: 'OTP must be 6 digits',
                    },
                    maxLength: {
                      value: 6,
                      message: 'OTP must be 6 digits',
                    },
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Didn't receive code?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  // Implement resend OTP logic here
                  toast.info('New OTP sent to your email');
                }}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}