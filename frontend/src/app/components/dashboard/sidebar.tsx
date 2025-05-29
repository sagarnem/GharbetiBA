'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Home, PlusCircle, Heart, User, Key } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Add Your Property', href: '/user/post', icon: PlusCircle },
  { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { label: 'Profile', href: '/user/profile', icon: User },
  { label: 'Change Password', href: '/user/change-password', icon: Key },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear tokens or call your logout function
    localStorage.removeItem('user'); // or call your API
    // router.push('/login');
  };

  return (
    <aside className="w-full md:w-64 bg-white shadow-md h-full md:min-h-screen p-4 space-y-6 border-r">
      <div className="text-2xl font-bold text-orange-600">My Dashboard</div>

      <nav className="space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
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
