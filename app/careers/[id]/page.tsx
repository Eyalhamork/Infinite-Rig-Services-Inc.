"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { submitApplication } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    User,
    Mail,
    Phone,
    FileText,
    Upload,
    X,
    Send,
    Building,
    Calendar,
    Award,
    Star,
    Loader2,
    AlertCircle,
} from "lucide-react";

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [fileName, setFileName] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        currentPosition: "",
        coverLetter: "",
        consent: false,
    });

    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [relatedJobs, setRelatedJobs] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        if (params.id) {
            fetchJob();
        }
    }, [params.id]);

    const fetchJob = async () => {
        try {
            const { data, error } = await supabase
                .from("job_postings")
                .select("*")
                .eq("id", params.id)
                .single();

            if (error) throw error;
            setJob(data);

            // Fetch related
            const { data: related } = await supabase
                .from("job_postings")
                .select("*")
                .eq("department", data.department)
                .eq("status", "published")
                .neq("id", data.id)
                .limit(2);

            setRelatedJobs(related || []);
        } catch (error) {
            console.error("Error fetching job:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-32 text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="h-10 w-10 text-gray-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-navy-900 mb-4">Job Not Found</h1>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        The position you're looking for doesn't exist or has been filled.
                    </p>
                    <Link
                        href="/careers"
                        className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-lg"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to All Jobs
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setUploadError("Please upload a PDF, DOC, or DOCX file.");
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError("File size must be less than 5MB.");
                return;
            }

            setUploadError("");
            setFileName(file.name);
            setIsUploading(true);

            try {
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                uploadFormData.append('bucket', 'resumes');
                uploadFormData.append('folder', 'applications');

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Upload failed');
                }

                setResumeUrl(result.url);
                toast.success("Resume uploaded successfully!");
            } catch (error) {
                console.error('Upload error:', error);
                setUploadError("Failed to upload file. Please try again.");
                setFileName("");
                toast.error("Failed to upload resume. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resumeUrl) {
            toast.error("Please upload your resume before submitting.");
            return;
        }

        if (!formData.consent) {
            toast.error("Please agree to the data processing terms.");
            return;
        }

        setIsSubmitting(true);

        try {
            const submitFormData = new FormData();
            submitFormData.append('job_id', job.id);
            submitFormData.append('job_title', job.title);
            submitFormData.append('first_name', formData.firstName);
            submitFormData.append('last_name', formData.lastName);
            submitFormData.append('email', formData.email);
            submitFormData.append('phone', formData.phone);
            submitFormData.append('current_position', formData.currentPosition);
            submitFormData.append('resume_url', resumeUrl);
            submitFormData.append('cover_letter', formData.coverLetter);

            const result = await submitApplication(submitFormData);

            if (result.error) {
                toast.error(result.error);
                setIsSubmitting(false);
                return;
            }

            setSubmitted(true);
            toast.success("Application submitted successfully!");
        } catch (error) {
            console.error('Submission error:', error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setShowApplicationForm(false);
        setSubmitted(false);
        setFileName("");
        setResumeUrl("");
        setUploadError("");
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            currentPosition: "",
            coverLetter: "",
            consent: false,
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };



    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Premium Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-navy-900">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 opacity-95"></div>
                <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5 mix-blend-overlay"></div>

                {/* Animated Orbs */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[128px] animate-pulse delay-1000"></div>


                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Back Link */}
                    <Link
                        href="/careers"
                        className="inline-flex items-center text-gray-400 hover:text-gold mb-8 transition-colors group"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        Back to All Jobs
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-white"
                    >
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-wide">
                                {job.experience_level}
                            </span>
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-md border border-white/10">
                                {job.department}
                            </span>
                            <span className="flex items-center text-gray-400 text-sm ml-2">
                                <Calendar className="h-4 w-4 mr-1.5 text-gold/70" />
                                Posted {new Date(job.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">{job.title}</h1>

                        <div className="flex flex-wrap items-center gap-8 text-gray-300">
                            <span className="flex items-center bg-white/5 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
                                <MapPin className="h-5 w-5 mr-3 text-gold" />
                                {job.location}
                            </span>
                            <span className="flex items-center bg-white/5 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
                                <Clock className="h-5 w-5 mr-3 text-gold" />
                                {job.employment_type}
                            </span>
                            <span className="flex items-center bg-white/5 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
                                <DollarSign className="h-5 w-5 mr-3 text-gold" />
                                {job.salary_range}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 -mt-8 relative z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100"
                            >
                                <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
                                    <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center mr-3 text-navy-900">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    About This Role
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-lg font-light">
                                    {job.description}
                                </p>
                            </motion.div>

                            {/* Responsibilities Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100"
                            >
                                <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
                                    <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center mr-3 text-navy-900">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    Responsibilities
                                </h2>
                                <ul className="space-y-4">
                                    {job.responsibilities?.split('\n').filter(Boolean).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start space-x-4 group">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0 group-hover:scale-150 transition-transform"></div>
                                            <span className="text-gray-600 font-light text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Qualifications Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100"
                            >
                                <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
                                    <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center mr-3 text-navy-900">
                                        <Award className="h-5 w-5" />
                                    </div>
                                    Qualifications
                                </h2>
                                <ul className="space-y-4">
                                    {job.qualifications?.split('\n').filter(Boolean).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start space-x-4 group">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 group-hover:scale-150 transition-transform"></div>
                                            <span className="text-gray-600 font-light text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Benefits Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100"
                            >
                                <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
                                    <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center mr-3 text-navy-900">
                                        <Star className="h-5 w-5" />
                                    </div>
                                    What We Offer
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {job.benefits?.split('\n').filter(Boolean).map((benefit: string, i: number) => (
                                        <div
                                            key={i}
                                            className="flex items-center space-x-3 bg-gray-50 rounded-xl p-5 hover:bg-navy-50 transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-6">
                                {/* Apply Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-[2rem] shadow-2xl p-8 border border-gray-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-[4rem] -mr-8 -mt-8"></div>

                                    <h3 className="text-xl font-bold text-navy-900 mb-4 relative z-10">
                                        Interested in this role?
                                    </h3>
                                    <p className="text-gray-500 mb-8 text-sm leading-relaxed relative z-10">
                                        Apply now and our recruitment team will review your
                                        application within 48 hours.
                                    </p>
                                    <button
                                        onClick={() => setShowApplicationForm(true)}
                                        className="w-full bg-gradient-to-r from-primary to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center relative z-10"
                                    >
                                        Apply Now
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </button>
                                </motion.div>

                                {/* Job Summary */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-navy-900 rounded-[2rem] p-8 text-white relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-950"></div>
                                    <div className="relative z-10 space-y-6">
                                        <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">
                                            Job Summary
                                        </h3>
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-white/10 p-2.5 rounded-lg">
                                                <Briefcase className="h-5 w-5 text-gold" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Department</p>
                                                <p className="font-semibold text-white">
                                                    {job.department}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-white/10 p-2.5 rounded-lg">
                                                <MapPin className="h-5 w-5 text-gold" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Location</p>
                                                <p className="font-semibold text-white">
                                                    {job.location}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-white/10 p-2.5 rounded-lg">
                                                <Clock className="h-5 w-5 text-gold" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Type</p>
                                                <p className="font-semibold text-white">{job.employment_type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-white/10 p-2.5 rounded-lg">
                                                <DollarSign className="h-5 w-5 text-gold" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Salary</p>
                                                <p className="font-semibold text-white">{job.salary_range}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Related Jobs */}
                                {relatedJobs.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-lg"
                                    >
                                        <h3 className="text-lg font-bold text-navy-900 mb-6">
                                            Related Positions
                                        </h3>
                                        <div className="space-y-4">
                                            {relatedJobs.map((relJob) => (
                                                <Link
                                                    key={relJob.id}
                                                    href={`/careers/${relJob.id}`}
                                                    className="block p-5 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group"
                                                >
                                                    <h4 className="font-bold text-navy-900 mb-1 group-hover:text-primary transition-colors">
                                                        {relJob.title}
                                                    </h4>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-white px-2 py-1 rounded-md inline-block border border-gray-100">{relJob.experience_level}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Form Modal */}
            <AnimatePresence>
                {showApplicationForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => !isSubmitting && setShowApplicationForm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {!submitted ? (
                                <>
                                    {/* Header */}
                                    <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-8 py-6 flex items-center justify-between z-10">
                                        <div>
                                            <h2 className="text-2xl font-bold text-navy-900">
                                                Apply for {job.title}
                                            </h2>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Complete the form below to submit your application
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowApplicationForm(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            <X className="h-6 w-6 text-gray-400" />
                                        </button>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                        {/* Personal Information */}
                                        <div>
                                            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center">
                                                <User className="w-5 h-5 mr-2 text-primary" />
                                                Personal Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        First Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                        placeholder="John"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Last Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                        placeholder="Doe"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    placeholder="john.doe@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    placeholder="+231 88 191 5322"
                                                />
                                            </div>
                                        </div>

                                        {/* Current Position */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Position / Company
                                            </label>
                                            <input
                                                type="text"
                                                name="currentPosition"
                                                value={formData.currentPosition}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="e.g. Operations Manager at ABC Company"
                                            />
                                        </div>

                                        {/* Resume Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Resume / CV *
                                            </label>
                                            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${uploadError ? 'border-red-300 bg-red-50' :
                                                resumeUrl ? 'border-green-300 bg-green-50' :
                                                    'border-gray-200 hover:border-primary hover:bg-primary/5'
                                                } group`}>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="resume-upload"
                                                    disabled={isUploading}
                                                />
                                                <label
                                                    htmlFor="resume-upload"
                                                    className="cursor-pointer w-full h-full block"
                                                >
                                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${resumeUrl ? 'bg-green-100' : 'bg-navy-50'
                                                        }`}>
                                                        {isUploading ? (
                                                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                                        ) : resumeUrl ? (
                                                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                                                        ) : (
                                                            <Upload className="h-8 w-8 text-primary" />
                                                        )}
                                                    </div>
                                                    {isUploading ? (
                                                        <p className="text-primary font-bold text-lg">Uploading...</p>
                                                    ) : fileName ? (
                                                        <div>
                                                            <p className={`font-bold text-lg ${resumeUrl ? 'text-green-600' : 'text-primary'}`}>
                                                                {fileName}
                                                            </p>
                                                            {resumeUrl && (
                                                                <p className="text-green-600 text-sm mt-1">Uploaded successfully</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="text-gray-900 font-bold text-lg mb-2">
                                                                Drop your resume here or{" "}
                                                                <span className="text-primary">browse</span>
                                                            </p>
                                                            <p className="text-gray-400 text-sm">
                                                                PDF, DOC, or DOCX (max 5MB)
                                                            </p>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                            {uploadError && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {uploadError}
                                                </p>
                                            )}
                                        </div>

                                        {/* Cover Letter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cover Letter / Additional Information
                                            </label>
                                            <textarea
                                                name="coverLetter"
                                                value={formData.coverLetter}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                            ></textarea>
                                        </div>

                                        {/* Consent */}
                                        <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl">
                                            <input
                                                type="checkbox"
                                                name="consent"
                                                checked={formData.consent}
                                                onChange={handleInputChange}
                                                id="consent"
                                                className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                            />
                                            <label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer">
                                                I agree to the processing of my personal data for recruitment
                                                purposes and confirm that the information provided is accurate. *
                                            </label>
                                        </div>

                                        {/* Submit */}
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || isUploading || !resumeUrl}
                                                className="w-full bg-gradient-to-r from-primary to-orange-600 text-white px-6 py-5 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        Submit Application
                                                        <Send className="ml-2 h-5 w-5" />
                                                    </>
                                                )}
                                            </button>
                                            {!resumeUrl && !isUploading && (
                                                <p className="text-center text-sm text-gray-500 mt-2">
                                                    Please upload your resume to submit
                                                </p>
                                            )}
                                        </div>
                                    </form>
                                </>
                            ) : (
                                /* Success State */
                                <div className="p-16 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", duration: 0.5 }}
                                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                                    >
                                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold text-navy-900 mb-4">
                                        Application Submitted!
                                    </h2>
                                    <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto">
                                        Thank you for applying for the <span className="text-primary font-semibold">{job.title}</span> position. Our
                                        recruitment team will review your application and get back to
                                        you within 48 hours.
                                    </p>
                                    <button
                                        onClick={resetForm}
                                        className="bg-navy-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-navy-800 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        Close Window
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
