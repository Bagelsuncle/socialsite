// src/app/profile/page.jsx
"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import LogoutButton from "../components/auth/LogoutButton";
import ProfileInfo from "../components/profile/ProfileInfo";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch additional user data if session is authenticated
    if (status === "authenticated" && session?.user) {
      fetchUserData();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/profile`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state when session is loading or when fetching user data
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LogoutButton
        variant="ghost"
        size="small"
        className="absolute top-4 right-4"
      />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image */}
            <div className="w-32 h-32 relative rounded-full bg-gradient-to-br from-gray-600 to-gray-400 flex items-center justify-center shadow-md">
              <span className="text-white text-5xl font-bold">
                {session?.user?.name?.charAt(0) || "?"}
              </span>
            </div>
            <ProfileInfo
              session={session}
              userData={userData}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
