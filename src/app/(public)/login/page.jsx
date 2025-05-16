// src/app/login/page.jsx
import LoginForm from "@/app/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Link href="/" className="mb-2">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="rounded-full bg-gradient-to-br from-gray-600 to-gray-400 p-1 shadow-md"
              priority
            />
          </Link>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Log in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/signup"
              className="font-medium text-gray-600 hover:text-gray-500"
            >
              create a new account
            </a>
          </p>
        </div>
        <Suspense fallback={<div className="text-center">Loading form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
