"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  TrendingUp,
  GraduationCap,
  Award,
  Globe,
  Star,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience_level: string;
  salary_range: string;
  status: string;
  description: string;
  requirements: string;
  created_at: string;
}

const departments = [
  "All",
  "Offshore Operations",
  "Supply Chain & Logistics",
  "Manning Services",
  "Health, Safety, Security & Environment",
  "Finance & Administration",
  "Human Resources",
  "Information Technology",
];

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Salary",
      desc: "Industry-leading compensation packages tied to performance and expertise.",
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      desc: "Comprehensive medical coverage for you and your family.",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      desc: "Clear advancement pathways and opportunities for promotion.",
    },
    {
      icon: GraduationCap,
      title: "Continuous Learning",
      desc: "Access to world-class training and professional development.",
    },
    {
      icon: Globe,
      title: "Global Exposure",
      desc: "Work on international projects with diverse teams.",
    },
    { icon: Award, title: "Recognition", desc: "Performance-based rewards and acknowledgment." },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDepartment === "All" || job.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-navy-900">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5 mix-blend-overlay"></div>

        {/* Animated Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[128px] animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-8"
            >
              <Briefcase className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">Join Our Team</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              Build Your Career <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary-300 to-gold">
                With Excellence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
              Join a dynamic team shaping the future of offshore services in
              West Africa. We invest in our people and celebrate their success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits - Premium Cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              Why Work With Us
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive benefits designed to support your
              professional and personal growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-navy-50 group-hover:bg-navy-900 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                  <benefit.icon className="h-8 w-8 text-navy-900 group-hover:text-gold transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings - Executive Style */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-bold text-sm uppercase tracking-widest">
              Open Positions
            </span>
            <h2 className="text-4xl font-bold text-navy-900 mt-2 mb-4">
              Current Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Explore our available positions and find your perfect role.
            </p>
          </motion.div>

          {/* Search & Filter - Glass Effect */}
          <div className="mb-12 max-w-4xl mx-auto relative z-10">
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-gray-700"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-6 max-w-5xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white border border-gray-100 rounded-[1.5rem] p-8 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                          <span className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                            <Briefcase className="h-4 w-4 mr-2 text-primary" />
                            {job.department}
                          </span>
                          <span className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            {job.location}
                          </span>
                          <span className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                            <Clock className="h-4 w-4 mr-2 text-primary" />
                            {job.employment_type}
                          </span>
                          <span className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                            <DollarSign className="h-4 w-4 mr-2 text-primary" />
                            {job.salary_range}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-navy-50 text-navy-900 border border-navy-100 self-start md:self-auto">
                        {job.experience_level}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed font-light line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {job.requirements.split('\n').slice(0, 3).map((req, j) => (
                        <span
                          key={j}
                          className="flex items-center text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1.5 text-gold" />
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 min-w-[180px]">
                    <Link
                      href={`/careers/${job.id}`}
                      className="flex-1 lg:flex-none bg-gradient-to-r from-primary to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center whitespace-nowrap"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      href={`/careers/${job.id}`}
                      className="flex-1 lg:flex-none bg-white border border-gray-200 text-navy-900 px-6 py-4 rounded-xl font-bold hover:border-gold hover:text-gold transition-all text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {!loading && filteredJobs.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Culture - Navy Section */}
      <section className="py-24 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-primary-950"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/bg-pattern.svg')] opacity-5"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Star className="h-4 w-4 text-gold fill-gold" />
              <span className="text-xs font-bold uppercase tracking-widest text-gold">Life at Infinite</span>
            </div>

            <h2 className="text-4xl font-bold mb-6">Culture of Excellence</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              We foster an environment of innovation, collaboration, and
              continuous growth. Our team members are empowered to make
              decisions, take ownership, and drive positive change.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { value: "95%", label: "Employee Satisfaction" },
                { value: "4.5", label: "Average Years Tenure" },
                { value: "80%", label: "Internal Promotions" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl"
                >
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gold to-yellow-600 mb-2 font-display">{stat.value}</div>
                  <div className="text-gray-400 font-medium uppercase tracking-wide text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-orange-600 to-orange-700 text-white relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Don't See Your Role?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90 font-light">
            We're always looking for talented individuals. Send us your resume
            and we'll keep you in mind for future opportunities.
          </p>
          <button className="bg-white text-primary px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl">
            Submit General Application
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
