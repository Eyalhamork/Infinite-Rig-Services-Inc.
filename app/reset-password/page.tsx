'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
            });

            if (error) {
                toast.error('Failed to send reset email', {
                    description: error.message,
                    icon: <XCircle className="w-5 h-5 text-red-500" />,
                });
            } else {
                setEmailSent(true);
                toast.success('Reset email sent!', {
                    description: 'Check your inbox for the password reset link.',
                    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                });
            }
        } catch (err) {
            console.error('Reset password error:', err);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] via-white to-[#F4F4F4] flex flex-col px-4 py-6">
                <div className="max-w-6xl mx-auto w-full mb-6">
                    <Link
                        href="/login"
                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#FF6B35] transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Login</span>
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>

                            <h1 className="text-2xl font-bold text-[#1A1A2E] mb-4">
                                Check Your Email
                            </h1>

                            <p className="text-gray-600 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>.
                                Click the link in the email to reset your password.
                            </p>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                            </div>

                            <button
                                onClick={() => setEmailSent(false)}
                                className="text-[#FF6B35] hover:text-[#ff5722] font-medium transition-colors"
                            >
                                Try a different email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] via-white to-[#F4F4F4] flex flex-col px-4 py-6">
            {/* Back to Login Link */}
            <div className="max-w-6xl mx-auto w-full mb-6">
                <Link
                    href="/login"
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#FF6B35] transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Login</span>
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">
                                Reset Password
                            </h1>
                            <p className="text-gray-600">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
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
                                        <span>Send Reset Link</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="text-center text-gray-600 mt-8">
                            Remember your password?{' '}
                            <Link
                                href="/login"
                                className="text-[#FF6B35] hover:text-[#ff5722] font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
