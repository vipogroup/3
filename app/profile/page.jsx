"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/app/components/layout/MainLayout";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : user ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  <div className="mt-1 text-gray-900">{user.fullName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone</label>
                  <div className="mt-1 text-gray-900">{user.phone}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Role</label>
                  <div className="mt-1 text-gray-900 capitalize">{user.role}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
              <p className="text-gray-600">Account settings will be implemented in Stage 5.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-red-500">Failed to load profile information.</p>
        </div>
      )}
    </MainLayout>
  );
}
