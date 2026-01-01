import Link from 'next/link';
import { QrCode, Shield, CheckCircle } from 'lucide-react';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#004E89] mb-4">
            Employee ID Verification System
          </h1>
          <p className="text-xl text-gray-600">
            Secure and instant verification of Infinite Rig Services employees
          </p>
        </div>

        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-[#FF6B35]" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">
                How It Works
              </h2>
              <p className="text-gray-600">
                Our employee ID cards feature secure QR codes that instantly verify employment status and credentials. Simply scan the QR code to access real-time verification.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#004E89]/10 flex items-center justify-center">
                <QrCode className="h-8 w-8 text-[#004E89]" />
              </div>
              <h3 className="font-semibold text-lg text-[#1A1A2E] mb-2">
                Scan QR Code
              </h3>
              <p className="text-sm text-gray-600">
                Use your phone camera to scan the QR code on the employee ID card
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#004E89]/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-[#004E89]" />
              </div>
              <h3 className="font-semibold text-lg text-[#1A1A2E] mb-2">
                Instant Verification
              </h3>
              <p className="text-sm text-gray-600">
                Get immediate access to verified employee information and status
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#004E89]/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-[#004E89]" />
              </div>
              <h3 className="font-semibold text-lg text-[#1A1A2E] mb-2">
                Secure & Current
              </h3>
              <p className="text-sm text-gray-600">
                All information is securely stored and updated in real-time
              </p>
            </div>
          </div>
        </div>

        {/* What You'll See */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">
            Verification Details
          </h2>
          <p className="text-gray-600 mb-6">
            When you scan a valid employee ID, you'll see:
          </p>
          <ul className="space-y-3">
            {[
              'Employee photo and full name',
              'Position and department',
              'Employment status (Active/Inactive)',
              'Employee ID number',
              'Card issue and expiry dates',
              'Verification timestamp',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Security Notice */}
        <div className="bg-[#004E89]/5 border border-[#004E89]/20 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-[#004E89] mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </h3>
          <p className="text-sm text-gray-700">
            This verification system is designed to protect employee privacy while providing necessary verification for authorized purposes. All verification activities are logged for security. Misuse of this system or employee information may result in legal action.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-block bg-[#FF6B35] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#FF6B35]/90 transition-colors"
          >
            Return to Homepage
          </Link>
          
          <div className="text-sm text-gray-500">
            <p className="font-semibold text-[#004E89]">
              Infinite Rig Services, Inc.
            </p>
            <p>Crown Prince Plaza, Congo Town, Monrovia, Liberia</p>
            <p className="mt-1">infiniterigservices.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
