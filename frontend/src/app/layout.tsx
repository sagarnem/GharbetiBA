import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "./components/topbar";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gharbheti BA | Property Management",
  description: "Find your dream home with Gharbheti BA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <AuthProvider>

        
          <header className="top-0 sticky z-30">
            <Topbar />
          </header>

          <div className="min-h-[80vh] bg-gradient-to-b from-blue-100/95 to-orange-100 ">
            {children}
          </div>

          <footer className="bg-gray-800 text-white py-4 px-10 text-center ">
            <p>&copy; 2025 RoomFinder Nepal. All rights reserved.</p>
            <p className="text-sm mt-1">
              Contact: info@gharbetiba.mantracodex.com
            </p>
          </footer>
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
        </GoogleOAuthProvider>

      </body>
    </html>
  );
}
