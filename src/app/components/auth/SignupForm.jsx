// src/app/components/auth/SignupForm.jsx
"use client";
import { useState } from "react";
import { ArrowRight, Mail, Lock, User, AtSign } from "lucide-react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameChecking, setUsernameChecking] = useState(false);

  const checkUsername = async (username) => {
    if (username.length < 3) return;

    setUsernameChecking(true);
    try {
      const response = await fetch(
        `/api/auth/check-username?username=${username}`
      );
      const data = await response.json();
      setUsernameAvailable(!data.exists);
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check username availability when username field changes
    if (name === "username" && value.length > 2) {
      // Debounce the API call
      const timeoutId = setTimeout(() => checkUsername(value), 500);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!usernameAvailable) {
      setError("Username is already taken");
      return;
    }

    setLoading(true);

    try {
      // Register the user through our API
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!registerResponse.ok) {
        const data = await registerResponse.json();
        throw new Error(data.error || "Registration failed");
      }

      // If registration is successful, sign in the user
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(
          signInResult.error || "Login failed after registration"
        );
      }

      // Registration and login successful, redirect to home
      router.push("/");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white py-8 px-4 shadow-md rounded-xl sm:px-10 border border-gray-100">
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="pl-10 focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 border"
              placeholder="John Smith"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AtSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              required
              value={formData.username}
              onChange={handleChange}
              className={`pl-10 focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm rounded-md py-3 border ${
                formData.username.length > 2
                  ? usernameAvailable
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="johnsmith"
            />
          </div>
          {formData.username.length > 2 && (
            <p
              className={`mt-1 text-xs ${
                usernameChecking
                  ? "text-gray-500"
                  : usernameAvailable
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {usernameChecking
                ? "Checking username..."
                : usernameAvailable
                ? "Username is available"
                : "Username is already taken"}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.username || "username"}
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="pl-10 focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 border"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="pl-10 focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 border"
              placeholder="••••••••"
              minLength={8}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 8 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`pl-10 focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm rounded-md py-3 border ${
                formData.confirmPassword
                  ? formData.password === formData.confirmPassword
                    ? "border-green-300"
                    : "border-red-300"
                  : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
          </div>
          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">Passwords don't match</p>
            )}
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-medium text-gray-600 hover:text-gray-500"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-gray-600 hover:text-gray-500"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Create account <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
