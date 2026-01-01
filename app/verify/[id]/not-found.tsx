import Link from 'next/link';
import { Building2, UserX, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function EmployeeNotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f2744] to-[#0a1628]">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8B5E] flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-lg">Infinite Rig Services</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 py-20">
                <div className="text-center">
                    {/* Error Icon */}
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl" />
                        <div className="relative w-24 h-24 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                            <UserX className="h-12 w-12 text-red-400" />
                        </div>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Employee Not Found
                    </h1>
                    <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
                        The employee ID you scanned could not be verified. This may mean the ID is invalid, expired, or no longer in our system.
                    </p>

                    {/* Warning Card */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 text-left">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-400 font-medium mb-1">Possible Reasons</p>
                                <ul className="text-amber-200/70 text-sm space-y-1">
                                    <li>• The QR code may be damaged or corrupted</li>
                                    <li>• The employee ID card may be counterfeit</li>
                                    <li>• The employee record has been removed</li>
                                    <li>• There may be a typo in the URL</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/verify"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/10"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Verification Info
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-block bg-gradient-to-r from-[#FF6B35] to-[#FF8B5E] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all duration-300"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-16 text-sm text-white/50">
                    <p className="font-semibold text-white/70">Infinite Rig Services, Inc.</p>
                    <p>Crown Prince Plaza, Congo Town, Monrovia, Liberia</p>
                    <p className="mt-2">
                        If you believe this is an error, please contact our office at{' '}
                        <a href="mailto:info@infiniterigservices.com" className="text-[#FF6B35] hover:underline">
                            info@infiniterigservices.com
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}
