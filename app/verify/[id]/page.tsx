import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    Building2,
    Shield,
    CheckCircle,
    XCircle,
    AlertCircle,
    Calendar,
    Clock,
    Briefcase,
    Users,
    BadgeCheck,
    ArrowRight
} from 'lucide-react';
import { isCardExpired } from '@/lib/utils';
import { Employee } from '@/types/database';
import EmployeePhoto from '@/components/EmployeePhoto';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    return {
        title: `Verify Employee ${id} | Infinite Rig Services`,
        description: 'Verify the employment status of an Infinite Rig Services employee.',
    };
}

async function getEmployee(employeeId: string): Promise<Employee | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', employeeId)
        .single();

    if (error || !data) {
        return null;
    }

    // Update last_verified_at timestamp
    await supabase.rpc('update_employee_verification', { emp_id: employeeId });

    return data as Employee;
}

function formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function getStatusConfig(status: string, isExpired: boolean) {
    if (isExpired) {
        return {
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-700',
            icon: AlertCircle,
            label: 'Card Expired',
        };
    }

    switch (status) {
        case 'active':
            return {
                color: 'from-emerald-500 to-emerald-600',
                bgColor: 'bg-emerald-50',
                borderColor: 'border-emerald-200',
                textColor: 'text-emerald-700',
                icon: CheckCircle,
                label: 'Active Employee',
            };
        case 'inactive':
            return {
                color: 'from-amber-500 to-amber-600',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-200',
                textColor: 'text-amber-700',
                icon: AlertCircle,
                label: 'Inactive',
            };
        case 'terminated':
            return {
                color: 'from-red-500 to-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                textColor: 'text-red-700',
                icon: XCircle,
                label: 'Terminated',
            };
        default:
            return {
                color: 'from-gray-500 to-gray-600',
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                textColor: 'text-gray-700',
                icon: AlertCircle,
                label: 'Unknown',
            };
    }
}

export default async function EmployeeVerificationPage({ params }: PageProps) {
    const { id } = await params;
    const employee = await getEmployee(id);

    if (!employee) {
        notFound();
    }

    const cardExpired = isCardExpired(employee.card_expiry_date);
    const statusConfig = getStatusConfig(employee.employment_status, cardExpired);
    const StatusIcon = statusConfig.icon;
    const verificationTime = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
    });

    // Check if photo exists, use placeholder if not
    const photoUrl = employee.photo_url || '/images/employees/placeholder.svg';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
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
                        href="/verify"
                        className="text-gray-500 hover:text-navy-700 text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                        <span>←</span> Verification Search
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-3xl">
                    {/* Verification Badge */}
                    <div className="flex justify-center mb-8">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${statusConfig.bgColor} border ${statusConfig.borderColor} ${statusConfig.textColor} text-sm font-semibold shadow-sm`}>
                            <StatusIcon className="h-4 w-4" />
                            {statusConfig.label}
                        </div>
                    </div>

                    {/* Main Employee Card */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-navy/5 to-transparent rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

                        {/* Photo and Name Section */}
                        <div className="relative flex flex-col items-center mb-10">
                            <div className="relative mb-6 group">
                                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${statusConfig.color} blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-1 ring-gray-100 group-hover:scale-[1.02] transition-transform duration-500">
                                    <EmployeePhoto
                                        src={photoUrl}
                                        alt={employee.full_name}
                                    />
                                </div>
                                <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br ${statusConfig.color} flex items-center justify-center shadow-lg border-4 border-white z-10`}>
                                    <StatusIcon className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 text-center mb-2 tracking-tight">
                                {employee.full_name}
                            </h1>
                            <p className="text-primary font-medium text-lg tracking-wide uppercase">
                                {employee.position}
                            </p>
                        </div>

                        {/* Employee Details Grid */}
                        <div className="grid gap-4 md:grid-cols-2 mb-10">
                            {/* Employee ID */}
                            <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-navy/10 transition-all duration-300">
                                        <BadgeCheck className="h-6 w-6 text-navy" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Employee ID</p>
                                        <p className="text-navy-900 font-bold text-lg">{employee.employee_id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Department */}
                            <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-navy/10 transition-all duration-300">
                                        <Users className="h-6 w-6 text-navy" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Department</p>
                                        <p className="text-navy-900 font-bold text-lg">{employee.department}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Issue Date */}
                            <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-navy/10 transition-all duration-300">
                                        <Calendar className="h-6 w-6 text-navy" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Issue Date</p>
                                        <p className="text-navy-900 font-bold text-lg">{formatDate(employee.card_issue_date)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expiry Date */}
                            <div className={`p-4 rounded-2xl border transition-all duration-300 group ${cardExpired ? 'bg-amber-50/50 border-amber-100 hover:border-amber-200 hover:bg-amber-50' : 'bg-gray-50/50 border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300 ${cardExpired ? 'bg-white border-amber-100' : 'bg-white border-gray-100 group-hover:border-navy/10'}`}>
                                        <Calendar className={`h-6 w-6 ${cardExpired ? 'text-amber-600' : 'text-navy'}`} />
                                    </div>
                                    <div>
                                        <p className={`${cardExpired ? 'text-amber-600' : 'text-gray-400'} text-xs font-bold uppercase tracking-wider mb-0.5`}>Expiry Date</p>
                                        <p className={`${cardExpired ? 'text-amber-900' : 'text-navy-900'} font-bold text-lg`}>
                                            {formatDate(employee.card_expiry_date)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Timestamp */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                                <Clock className="h-4 w-4 text-emerald-600" />
                                <p className="text-emerald-700 text-sm font-medium">
                                    Verified: {verificationTime}
                                </p>
                            </div>

                            <Link
                                href="/"
                                className="text-sm font-medium text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                                Infinite Rig Services <span className="w-1 h-1 rounded-full bg-gray-300"></span> Official Verification
                            </Link>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 group"
                        >
                            <span>Visit Our Website</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-8 mx-4 text-center">
                        <p className="text-gray-400 text-sm max-w-2xl mx-auto flex items-center justify-center gap-2">
                            <Shield className="h-4 w-4" />
                            Secure verification powered by LiMA Compliant Systems
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
