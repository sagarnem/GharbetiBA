'use client';
import { useAuth, AuthProvider } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Search, PlusCircle, User, LogOut, Home, Heart } from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  console.log('User:', user);
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="p-4 flex items-center justify-between">
        {/* Left - Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-1">
          <Home className="h-5 w-5" />
          GharbetiBa
        </Link>

        {/* Middle - Search (hide on small screens) */}
        {/* <div className="hidden md:block flex-1 mx-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search properties..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div> */}

        {/* Right - Menu or Nav */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              about us
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              contact
            </Link>
            <Link href="/how-gba-works" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              How <span className='underline text-orange-400'>GBA</span> Works
            </Link>
            <Link href="/wishlist" className="text-gray-600 hover:text-blue-600">
              <Heart className="h-5 w-5" />
            </Link>

            {user ? (
              <>
                <Link
                  href="/post-ad"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Post Your Ad</span>
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <span className="text-gray-800 font-medium hidden sm:inline">
                      {user?.first_name || user?.email.split('@')[0]}
                    </span>
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-blue-500">
                      <Image
                        src={user?.avatar || '/default-avatar.png'}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        View Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-blue-600 px-3 py-1.5 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-2 bg-white">
          <Link href="/about" className="block text-gray-700 hover:text-blue-600">About Us</Link>
          <Link href="/how-it-works" className="block text-gray-700 hover:text-blue-600">How It Works</Link>
          <Link href="/wishlist" className="block text-gray-700 hover:text-blue-600">Wishlist</Link>

          {user ? (
            <>
              <Link href="/post-ad" className="block text-blue-600 font-semibold">Post Your Ad</Link>
              <Link href="/profile" className="block text-gray-700">Profile</Link>
              <button onClick={logout} className="block text-left w-full text-red-600">Log Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block text-gray-700">Sign In</Link>
              <Link href="/auth/register" className="block text-gray-700">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
