'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Home, PlusCircle, Heart, User, Key, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const baseNavItems = [
  { label: 'Dashboard', href: '/user/post', icon: Home },
  { label: 'Add Your Property', href: '/user/create-post', icon: PlusCircle, roles: ['owner'] },
  { label: 'Property Listing', href: '/user/post', icon: List, roles: ['owner'] },
  { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { label: 'Profile', href: '/user/profile', icon: User },
  { label: 'Change Password', href: '/user/change-password', icon: Key },
];

export default function UserSidebar({ isOpen, toggleSidebar }: UserSidebarProps) {
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
      } catch (error) {
        setUserType(null);
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  const filteredNavItems = baseNavItems.filter(item => {
    if (!item.roles) return true;
    return userType && item.roles.includes(userType);
  });

  return (
    <aside
      className={`bg-white shadow-md h-full p-4 border-r transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end">
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-orange-600">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Title */}
      {isOpen && (
        <div className="text-2xl font-bold text-orange-600 mb-6 whitespace-nowrap">My Dashboard</div>
      )}

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {filteredNavItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-orange-100 ${
              pathname === href ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-gray-700'
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {isOpen && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-2 mt-4 text-red-600 hover:bg-red-100 rounded-md transition"
      >
        <LogOut className="w-5 h-5 mr-3" />
        {isOpen && <span>Log Out</span>}
      </button>
    </aside>
  );
}
