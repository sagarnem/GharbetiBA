"use client";
import { ReactNode, useState } from "react";
import UserSidebar from "@/app/components/dashboard/sidebar";
// import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar initially open
  // const pathname = usePathname(); // To get the current path

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <UserSidebar />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Content Area */}
        <main className="p-6 overflow-auto h-full">
          {children} {/* Render the content of the active route */}
        </main>
      </div>
    </div>
  );
}
