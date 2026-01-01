"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "magic">(
    "password"
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const supabase = createClient();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Login failed", {
          description: error.message,
          icon: <XCircle className="w-5 h-5 text-red-500" />,
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Fetch user role to determine redirect
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", data.user.id)
          .single();

        // Log any profile fetch errors for debugging
        if (profileError) {
          console.error("Error fetching profile for redirect:", profileError);
        }

        // Determine user role with multiple fallbacks
        let userRole = "client"; // Default
        if (profile?.role) {
          userRole = profile.role;
        } else if (data.user.user_metadata?.role) {
          // Fallback to user metadata if profile query fails
          userRole = data.user.user_metadata.role;
        }

        const userName = profile?.full_name || data.user.user_metadata?.full_name || "User";

        // Check if user is staff/admin (not a client)
        const isStaff = ["super_admin", "management", "editor", "support"].includes(userRole);

        toast.success(`Welcome back, ${userName}!`, {
          description: `Redirecting to your ${isStaff ? "dashboard" : "portal"}...`,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        });

        // Small delay for the toast to show
        setTimeout(() => {
          if (redirectPath) {
            router.push(redirectPath);
          } else if (isStaff) {
            router.push("/dashboard");
          } else {
            router.push("/portal");
          }
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later.",
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      });
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, check if the email exists in our system
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (checkError) {
        console.error("Error checking email:", checkError);
      }

      // If no user found, prompt them to sign up
      if (!existingUser) {
        toast.error("No account found", {
          description: (
            <span>
              No account exists with this email.{" "}
              <a href="/signup" className="underline font-medium">Sign up here</a> to create one.
            </span>
          ),
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          duration: 6000,
        });
        setIsLoading(false);
        return;
      }

      // User exists, send magic link with shouldCreateUser: false as extra safety
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: false,
        },
      });

      if (error) {
        toast.error("Failed to send magic link", {
          description: error.message,
          icon: <XCircle className="w-5 h-5 text-red-500" />,
        });
      } else {
        toast.success("Magic link sent!", {
          description: `Check your email at ${email} for the login link.`,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          duration: 5000,
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later.",
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = loginMethod === "password" ? handlePasswordLogin : handleMagicLink;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] via-white to-[#F4F4F4] flex flex-col px-4 py-6">
      {/* Back to Home Link */}
      <div className="max-w-6xl mx-auto w-full mb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#FF6B35] transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col justify-center px-12">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-[#1A1A2E] mb-4">
                Welcome Back
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Access your Infinite Rig Services account to manage projects,
                applications, and collaborate with our team.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#FF6B35] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A2E] mb-1">
                    Secure Access
                  </h3>
                  <p className="text-gray-600">
                    Your data is protected with enterprise-grade security
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#004E89] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A2E] mb-1">
                    Fast & Reliable
                  </h3>
                  <p className="text-gray-600">
                    Access your dashboard instantly from anywhere
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Logo - Mobile */}
            <div className="lg:hidden text-center mb-8">
              <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2">
                Infinite Rig Services
              </h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Login Method Toggle */}
            <div className="flex space-x-2 mb-8 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLoginMethod("password")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${loginMethod === "password"
                  ? "bg-white text-[#FF6B35] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("magic")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${loginMethod === "magic"
                  ? "bg-white text-[#FF6B35] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Magic Link
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#1A1A2E] mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field - Only show for password method */}
              {loginMethod === "password" && (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#1A1A2E] mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-12 pl-12 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              {loginMethod === "password" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    href="/reset-password"
                    className="text-sm text-[#FF6B35] hover:text-[#ff5722] font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Magic Link Description */}
              {loginMethod === "magic" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    We'll send you a magic link to sign in without a password.
                    Check your email after clicking the button below.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#FF6B35] hover:bg-[#ff5722] text-white font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>
                      {loginMethod === "password" ? "Sign In" : "Send Magic Link"}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>



            {/* Sign Up Link */}
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-[#FF6B35] hover:text-[#ff5722] font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
