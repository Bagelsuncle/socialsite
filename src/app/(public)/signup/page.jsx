// src/app/signup/page.jsx
import SignupForm from "@/app/components/auth/SignupForm";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Sign Up",
  description: "Create your account",
};

export default function SignupPage() {
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-gray-600 hover:text-gray-500"
            >
              Log in
            </Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
