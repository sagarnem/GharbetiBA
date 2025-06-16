'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Home, PlusCircle, Heart, User, Key, List } from 'lucide-react';
import { useEffect, useState } from 'react';

const baseNavItems = [
  { label: 'Dashboard', href: '#', icon: Home },
  { label: 'Add Your Property', href: '/user/create-post', icon: PlusCircle, roles: ['owner'] },
  { label: 'Property Listing', href: '/user/post', icon: List, roles: ['owner'] },
  { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { label: 'Profile', href: '/user/profile', icon: User },
  { label: 'Change Password', href: '/user/change-password', icon: Key },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);

  const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  router.push('/auth/login');
};

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserType(parsedUser?.role);
      } catch (e) {
        console.error('Invalid user object in localStorage');
      }
    }
  }, []);

  const filteredNavItems = baseNavItems.filter(item => {
    if (!item.roles) return true; // visible to all
    return userType && item.roles.includes(userType);
  });

  return (
    <aside className="w-full md:w-64 bg-white shadow-md h-full md:min-h-screen p-4 space-y-6 border-r">
      <div className="text-2xl font-bold text-orange-600">My Dashboard</div>

      <nav className="space-y-1">
        {filteredNavItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-orange-100 ${
              pathname === href ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-gray-700'
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-2 mt-8 text-red-600 hover:bg-red-100 rounded-md transition"
      >
        <LogOut className="w-5 h-5 mr-3" />
        Log Out
      </button>
    </aside>
  );
}
