// src/app/components/auth/LogoutButton.jsx
"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useState } from "react";

const LogoutButton = ({
  variant = "primary",
  size = "default",
  className = "",
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/" });
  };

  // Determine button style based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "secondary":
        return "text-gray-600 border-2 border-gray-600 hover:bg-gray-50";
      case "ghost":
        return "text-gray-700 hover:text-gray-600 hover:bg-gray-50";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  // Determine button size based on prop
  const getButtonSize = () => {
    switch (size) {
      case "small":
        return "py-2 px-4 text-sm";
      case "large":
        return "py-5 px-10 text-lg";
      default:
        return "py-4 px-8";
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`cursor-pointer rounded-full shadow-md transition duration-300 flex items-center justify-center font-medium ${getButtonStyle()} ${getButtonSize()} ${
        isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isLoggingOut ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          <span>Logout</span>
          <LogOut className="ml-2 h-5 w-5" />
        </>
      )}
    </button>
  );
};

export default LogoutButton;
