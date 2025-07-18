'use client';
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import "./globals.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (page: 'music' | 'teaching' | 'code') => {
    router.push(`/${page}`);
  };

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            {/* Hub section - always visible */}
            <div className="mb-16">
              <div className="flex flex-col items-center space-y-8">
                {/* Main node */}
                <div className="w-full max-w-md">
                  <div
                    className="border-2 border-gray-800 rounded-lg px-6 py-4 bg-white text-2xl font-bold w-full text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => router.push("/")}
                  >
                    Jimmy Nicholas
                  </div>
                </div>

                {/* Child nodes */}
                <div className="flex space-x-8 w-full max-w-md">
                  <div
                    className={`border-2 border-gray-800 rounded-lg px-6 py-4 bg-white text-lg flex-1 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                      pathname === "/music" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleNavigation('music')}
                  >
                    music
                  </div>
                  <div
                    className={`border-2 border-gray-800 rounded-lg px-6 py-4 bg-white text-lg flex-1 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                      pathname === "/teaching" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleNavigation('teaching')}
                  >
                    teaching
                  </div>
                  <div
                    className={`border-2 border-gray-800 rounded-lg px-6 py-4 bg-white text-lg flex-1 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                      pathname === "/code" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleNavigation('code')}
                  >
                    code
                  </div>
                </div>
              </div>
            </div>

            {/* Page content */}
            <div className="mb-16">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;