import Link from 'next/link';
import { QrCode, Shield, CheckCircle, Building2 } from 'lucide-react';

export const metadata = {
    title: 'Employee ID Verification | Infinite Rig Services',
    description: 'Secure and instant verification of Infinite Rig Services employees using QR codes.',
};

export default function VerifyPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-navy-900 font-bold text-lg tracking-tight">Infinite Rig Services</span>
                    </Link>
                    <Link
                        href="/"
                        className="text-gray-500 hover:text-navy-700 text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                        <span>←</span> Back to Homepage
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-50 border border-navy-100 text-navy-600 text-sm font-semibold mb-6 shadow-sm">
                        <Shield className="h-4 w-4" />
                        Secure Verification System
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 mb-6 tracking-tight">
                        Employee ID Verification
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Secure and instant verification of Infinite Rig Services employees using advanced QR code technology and real-time database validation.
                    </p>
                </div>

                {/* How It Works Card */}
                <div className="bg-white rounded-3xl p-8 md:p-12 mb-8 border border-gray-100 shadow-xl relative overflow-hidden group">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full blur-3xl -mr-48 -mt-48 opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 relative z-10">
                        <div className="flex-shrink-0">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-lg shadow-primary/20">
                                <QrCode className="h-7 w-7 text-white" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
                                How It Works
                            </h2>
                            <p className="text-gray-500 text-lg">
                                Our verification process is designed for speed and security.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        {[
                            {
                                icon: QrCode,
                                title: 'Scan QR Code',
                                description: 'Use your phone camera to scan the secure QR code located on the employee ID card.',
                                color: 'text-primary',
                                bg: 'bg-primary/10'
                            },
                            {
                                icon: Shield,
                                title: 'Instant Verification',
                                description: 'Our system instantly validates the code against our secure global database.',
                                color: 'text-navy',
                                bg: 'bg-navy/10'
                            },
                            {
                                icon: CheckCircle,
                                title: 'Secure & Current',
                                description: 'Access real-time employment status, qualifications, and department info.',
                                color: 'text-emerald-600',
                                bg: 'bg-emerald-50'
                            },
                        ].map((step, idx) => (
                            <div key={step.title} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-lg hover:border-gray-200 transition-all duration-300 group/card">
                                <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center mb-4 group-hover/card:scale-110 transition-transform duration-300`}>
                                    <step.icon className={`h-6 w-6 ${step.color}`} />
                                </div>
                                <h3 className="font-bold text-lg text-navy-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Verification Details */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                        <h2 className="text-2xl font-bold text-navy-900 mb-6">
                            Verified Information
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                'Employee photo and full name',
                                'Current Position and Department',
                                'Employment status (Active/Inactive)',
                                'Official Employee ID number',
                                'Card issue and expiry dates',
                                'Real-time Verification timestamp',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                    <span className="text-gray-600 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-navy-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -ml-20 -mb-20" />

                        <div className="relative z-10">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Security & Privacy
                            </h3>
                            <p className="text-white/70 leading-relaxed mb-6">
                                This verification system is designed to protect employee privacy while providing necessary verification for authorized purposes.
                            </p>
                            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                <p className="text-sm text-white/90 font-medium">
                                    All verification activities are logged securely.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center space-y-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Return to Homepage
                        <Building2 className="h-4 w-4" />
                    </Link>

                    <div className="text-sm text-gray-400">
                        <p className="font-semibold text-gray-900 mb-1">
                            Infinite Rig Services, Inc.
                        </p>
                        <p>Crown Prince Plaza, Congo Town, Monrovia, Liberia</p>
                        <Link href="https://infiniterigservices.com" className="mt-1 text-primary hover:text-primary-600 block transition-colors">
                            infiniterigservices.com
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
