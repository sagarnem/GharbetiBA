"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Menu, X, PlusCircle, User, LogOut, Home, Heart } from "lucide-react";

export default function Topbar() {
  const { user, loading, logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (loading) return null;
  const baseURL = "http://localhost:8000";
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 font-bold text-lg"
          >
            <Home className="w-5 h-5" />
            GharbetiBa
          </Link>

          {/* Right: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/how-gba-works">
              How <span className="underline text-orange-400">GBA</span> Works
            </NavLink>
            <Link
              href="/wishlist"
              className="text-gray-600 hover:text-blue-600"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {user ? (
              <>
                <Link
                  href="/user/create-post"
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Post Your Ad</span>
                </Link>

                  {/* User dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 focus:outline-none"
                      aria-haspopup="true"
                      aria-expanded={isDropdownOpen}
                    >
                      <span className="text-sm text-gray-800 font-bold hidden sm:inline">
                         {user?.full_name || user?.email.split('@')[0]}

                      </span>
                      <Image
                        src={
                          user?.avatar
                            ? `${baseURL}${user.avatar}`
                            : "/avatar.svg"
                        }
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-2 border-orange-500 object-cover"
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md animate-fade-in z-50">
                        <Link
                          href="/user/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          View Profile
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              
            ) : (
              <div className="flex items-center gap-2">
                <NavLink href="/auth/login">Sign In</NavLink>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2 animate-slide-down">
          <MobileNavLink href="/about">About Us</MobileNavLink>
          <MobileNavLink href="/how-gba-works">How GBA Works</MobileNavLink>
          <MobileNavLink href="/wishlist">Wishlist</MobileNavLink>

          {user ? (
            <>
              <MobileNavLink href="/user/create-post" className="text-blue-600 font-semibold">
                Post Your Ad
              </MobileNavLink>
              <MobileNavLink href="/profile">Profile</MobileNavLink>
              <button
                onClick={logout}
                className="w-full text-left text-red-600 hover:underline text-sm"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <MobileNavLink href="/auth/login">Sign In</MobileNavLink>
              <MobileNavLink href="/auth/register">Sign Up</MobileNavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}

// Reusable NavLink for cleaner structure
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-600 hover:text-blue-600 font-medium transition"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`block text-sm text-gray-700 hover:text-blue-600 transition ${className}`}
    >
      {children}
    </Link>
  );
}
