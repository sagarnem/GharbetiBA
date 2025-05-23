"use client";
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { ChangePasswordFormData, ApiResponse } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { useWatch } from 'react-hook-form';

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ChangePasswordFormData & { confirm_password: string }>();

  const newPassword = useWatch({ control, name: 'new_password' });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setLoading(true);
    try {
      await axios.post<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/user/change-password/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      toast.success('Password changed successfully! Please login again.');
      logout();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.error || 'Failed to change password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Change Password | Property Management</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Change your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="old_password"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="old_password"
                  type="password"
                  autoComplete="current-password"
                  {...register('old_password', {
                    required: 'Current password is required',
                  })}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.old_password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              </div>
              {errors.old_password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.old_password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-gray-700"
              >
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
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.new_password ? 'border-red-300' : 'border-gray-300'
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
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
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
                    required: 'Please confirm your new password',
                    validate: (value) =>
                      value === newPassword || 'Passwords do not match',
                  })}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              </div>
              {errors.confirm_password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>


            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}