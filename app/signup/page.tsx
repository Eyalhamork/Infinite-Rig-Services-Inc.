'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Building, Phone, ArrowRight, ArrowLeft, Check, User, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import VerificationModal from '@/components/ui/VerificationModal';

export default function SignupPage() {
  const [showEmailModal, setShowEmailModal] = useState(false);

  const [formData, setFormData] = useState({
    contactName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateForm = () => {
    if (!formData.contactName.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.companyName.trim()) {
      toast.error('Please enter your company name');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.contactName,
            company_name: formData.companyName,
            phone: formData.phone,
            role: 'client', // Store role in metadata as backup
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast.error('Signup failed', {
          description: authError.message,
          icon: <XCircle className="w-5 h-5 text-red-500" />,
        });
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error('Signup failed', {
          description: 'No user was created',
          icon: <XCircle className="w-5 h-5 text-red-500" />,
        });
        setIsLoading(false);
        return;
      }

      const userId = authData.user.id;

      // Step 2 & 3: Profile and Client records are now created automatically via Database Trigger
      // This ensures security and prevents role manipulation.


      // Check if email confirmation is required
      if (authData.user.identities?.length === 0) {
        // User already exists
        toast.error('Account already exists', {
          description: 'Please sign in instead.',
          icon: <XCircle className="w-5 h-5 text-red-500" />,
        });
        setTimeout(() => router.push('/login'), 2000);
      } else if (!authData.session) {
        // Email confirmation required - SHOW MODAL
        setShowEmailModal(true);
      } else {
        // Auto-confirmed (development mode)
        toast.success('Welcome to Infinite Rig Services!', {
          description: 'Your account has been created. Redirecting...',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        });
        setTimeout(() => router.push('/portal'), 1500);
      }

    } catch (err) {
      console.error('Signup error:', err);
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] via-white to-[#F4F4F4] py-6 px-4">
      <VerificationModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Check Your Email"
        type="email"
        message={`We've sent a verification link to ${formData.email}. Please verify your email to access the client portal.`}
        actionLabel="Go to Login"
        onAction={() => router.push('/login')}
      />

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

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-4">
            Partner With Us
          </h1>
          <p className="text-xl text-gray-600">
            Register as a client to access exclusive services and manage your projects
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Benefits */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">
                Why Partner With Us?
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] mb-1">Dedicated Account Management</h3>
                    <p className="text-gray-600 text-sm">Get a dedicated team to handle all your offshore service needs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#004E89]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#004E89]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] mb-1">Project Dashboard</h3>
                    <p className="text-gray-600 text-sm">Track project progress, invoices, and communications in real-time</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#B8860B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#B8860B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] mb-1">Priority Support</h3>
                    <p className="text-gray-600 text-sm">24/7 priority access to our support and operations team</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] mb-1">Custom Reporting</h3>
                    <p className="text-gray-600 text-sm">Access detailed reports and analytics for your operations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-gradient-to-br from-[#004E89] to-[#1A1A2E] rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  OP
                </div>
                <div>
                  <p className="font-semibold">Orion Petroleum</p>
                  <p className="text-sm text-gray-300">Operations Manager</p>
                </div>
              </div>
              <p className="text-gray-200 italic">
                "Infinite Rig Services has been an invaluable partner for our offshore operations. Their platform makes project management seamless and their team is always responsive."
              </p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-[#004E89]/10 rounded-full px-4 py-2 mb-4">
                <Building className="w-5 h-5 text-[#004E89]" />
                <span className="text-sm font-medium text-[#004E89]">Client Registration</span>
              </div>
              <p className="text-gray-600 text-sm">
                Create your account to access our client portal and start managing your projects.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Person Name */}
              <div>
                <label htmlFor="contactName" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Contact Person Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors"
                    placeholder="Your Company Name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Business Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors"
                    placeholder="+231 88 191 5322"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 pl-12 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 pl-12 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms-of-service" className="text-[#FF6B35] hover:text-[#ff5722] font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="text-[#FF6B35] hover:text-[#ff5722] font-medium">
                    Privacy Policy
                  </Link>
                </label>
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
                    <span>Create Client Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-8">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-[#FF6B35] hover:text-[#ff5722] font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>

            {/* Job Applicant Note */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Looking for a job?</strong> Visit our{' '}
                <Link href="/careers" className="text-[#FF6B35] hover:underline font-medium">
                  Careers page
                </Link>{' '}
                to apply. No account needed – we'll contact you via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
