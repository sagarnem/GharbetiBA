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
    <div className="flex    bg-gray-100">
      {/* Sidebar */}

      <div className="max-h-[calc(100vh-4rem)] sticky top-[4rem] left-0">
        <UserSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      {/* Main Content Area */}
   
        {/* Content Area */}
        <main className="  flex flex-col flex-1 transition-all duration-300 ">
          {children} {/* Render the content of the active route */}
        </main>
    </div>
  );
}
