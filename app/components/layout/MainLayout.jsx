"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // If no user is found, we're not showing an error here
    // The middleware should handle redirects for protected routes
    return <div className="p-4">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {pathname === "/dashboard"
              ? "Dashboard"
              : pathname === "/products"
              ? "Products"
              : pathname === "/agents"
              ? "Agents"
              : pathname === "/sales"
              ? "Sales"
              : pathname === "/reports"
              ? "Reports"
              : pathname === "/profile"
              ? "Profile"
              : ""}
          </h2>
          <div className="flex items-center">
            <span className="mr-4 text-gray-600">
              {user.fullName} ({user.role})
            </span>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
