"use client";
import { Home, Search, Heart, User } from "lucide-react";
import Link from "next/link";

const MobileFooterNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow md:hidden">
      <div className="flex justify-around items-center h-14 px-4 text-gray-600">
        <Link href="/" className="flex flex-col items-center text-xs hover:text-orange-500">
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link href="/search" className="flex flex-col items-center text-xs hover:text-orange-500">
          <Search size={20} />
          <span>Search</span>
        </Link>

        <Link href="/wishlist" className="flex flex-col items-center text-xs hover:text-orange-500">
          <Heart size={20} />
          <span>Wishlist</span>
        </Link>

        <Link href="/profile" className="flex flex-col items-center text-xs hover:text-orange-500">
          <User size={20} />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileFooterNav;
