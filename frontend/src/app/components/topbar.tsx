'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
export default function Topbar() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        PropertyBook
      </Link>
      <input
        type="text"
        placeholder="Search..."
        className="border rounded-lg px-3 py-1 w-1/2"
      />
      <div className="flex items-center gap-2">
        <span className="text-gray-800 font-medium">
          {user?.first_name || user?.email}
        </span>
        <Image
  src={user?.avatar || '/default-avatar.png'}
  alt="User Avatar"
  width={32}
  height={32}
  className="rounded-full"
/>
      </div>
    </div>
  );
}
