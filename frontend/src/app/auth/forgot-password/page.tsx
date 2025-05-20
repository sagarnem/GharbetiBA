"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Link from 'next/link';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { ResetPasswordRequestFormData, ApiResponse } from '../../../types/auth';

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequestFormData>();

  const onSubmit = async (data: ResetPasswordRequestFormData) => {
    setLoading(true);
    try {
      await axios.post<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/request-reset/`,
        data
      );
      toast.success('OTP sent to your email for password reset');
      router.push({
        pathname: '/auth/verify-otp',
        query: { email: data.email, purpose: 'reset' },
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.error || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Forgot Password | Property Management</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/login">
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your account
            </span>
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { required: 'Email is required' })}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
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
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}