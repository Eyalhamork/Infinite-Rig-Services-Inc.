"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Mail,
  Linkedin,
  Award,
  Users,
  Building2,
  Briefcase,
  Star,
  Shield,
  Target,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

// Organized by department hierarchy
const teamMembers = [
  // Executive Leadership
  {
    name: "Amb. Melee Kermue",
    position: "CEO & Managing Partner",
    department: "Executive Leadership",
    tier: "executive",
    bio: "Visionary leader driving strategic growth and operational excellence across West African offshore markets.",
    email: "mkermue@infiniterigservices.com",
    linkedin: "#",
  },
  {
    name: "Mansfield Wrotto",
    position: "Deputy CEO",
    department: "Executive Leadership",
    tier: "executive",
    bio: "Strategic operations executive ensuring delivery of world-class offshore support services.",
    email: "mwrotto@infiniterigservices.com",
    linkedin: "#",
  },
  // Department Heads & Senior Management
  {
    name: "Nathaniel Jallah",
    position: "Admin & Human Resource Manager",
    department: "Human Resources",
    tier: "management",
    bio: "Leading talent acquisition, development, and organizational culture initiatives.",
    email: "njallah@infiniterigservices.com",
    linkedin: "#",
  },
  {
    name: "Prince Howard",
    position: "Procurement & Supply Manager",
    department: "Supply Chain",
    tier: "management",
    bio: "Managing strategic procurement and supply chain operations for offshore projects.",
    email: "phoward@infiniterigservices.com",
    linkedin: "#",
  },
  {
    name: "Mohammed Kromah",
    position: "IT Manager",
    department: "Information Technology",
    tier: "management",
    bio: "Driving digital transformation and technology infrastructure excellence.",
    email: "mkromah@infiniterigservices.com",
    linkedin: "#",
  },
  {
    name: "Woods Nyanton",
    position: "Communications Manager",
    department: "Corporate Communications",
    tier: "management",
    bio: "Leading corporate communications, brand strategy, and stakeholder engagement.",
    email: "wnyanton@infiniterigservices.com",
    linkedin: "#",
  },
  // Specialists & Consultants - Now promoted to "Expert" tier visually
  {
    name: "Francis Mcdonnough",
    position: "Procurement & Supply Consultant",
    department: "Supply Chain",
    tier: "specialist",
    bio: "Providing expert guidance on procurement strategies and supply chain optimization.",
    email: "fmcdonnough@infiniterigservices.com",
    linkedin: "#",
  },
  {
    name: "Kester Howard",
    position: "IT Specialist",
    department: "Information Technology",
    tier: "specialist",
    bio: "Technical expert ensuring robust IT systems and digital infrastructure.",
    email: "khoward@infiniterigservices.com",
    linkedin: "#",
  },
  {
    name: "Daniel M. Jallah",
    position: "Expeditor",
    department: "Operations",
    tier: "specialist",
    bio: "Coordinating logistics and ensuring timely delivery of materials and services.",
    email: "djallah@infiniterigservices.com",
    linkedin: "#",
  },
];

const departments = [
  {
    name: "Executive Leadership",
    icon: Building2,
    color: "from-gold to-yellow-600",
  },
  {
    name: "Human Resources",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Supply Chain",
    icon: Briefcase,
    color: "from-green-500 to-green-600",
  },
  {
    name: "Information Technology",
    icon: Target,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Operations",
    icon: Shield,
    color: "from-orange-500 to-orange-600",
  },
  {
    name: "Corporate Communications",
    icon: Star,
    color: "from-pink-500 to-pink-600",
  },
];

const stats = [
  { value: "12+", label: "Leadership Team", icon: Users },
  { value: "200+", label: "Total Employees", icon: TrendingUp },
  { value: "15+", label: "Years Experience", icon: Award },
  { value: "100%", label: "Commitment", icon: CheckCircle2 },
];

export default function TeamPage() {
  const getTierStyle = (tier: string) => {
    switch (tier) {
      case "executive":
        return "border-gold";
      case "management":
        return "border-primary/20";
      default:
        return "border-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Premium Hero Section - Updated to Brand Navy */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-navy-900">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5 mix-blend-overlay"></div>

        {/* Animated Light Orbs - Blended with Orange/Gold */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[128px] animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-8"
            >
              <Users className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">Elite Leadership</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white tracking-tight">
              The Visionaries Behind <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary-300 to-gold">
                Global Excellence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
              We are a collective of industry veterans and innovators, united by an unyielding
              commitment to safety, integrity, and world-class service delivery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Floating Stats Section with Glassmorphism */}
      <section className="relative -mt-20 z-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-8 md:p-12 mx-auto max-w-6xl"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
              {stats.map((stat, i) => (
                <div key={i} className="text-center pt-8 md:pt-0 first:pt-0">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-navy-50 rounded-2xl text-navy-600">
                      <stat.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-navy-900 mb-2 font-display">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 font-medium tracking-wide uppercase text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="bg-gray-50 pt-24 pb-32 space-y-32">

        {/* Executive Leadership - "The Elite Tier" */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold font-bold tracking-widest uppercase text-sm">Executive Board</span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mt-3 mb-6">Strategic Leadership</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-navy-900 via-primary to-navy-900 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {teamMembers
              .filter((member) => member.tier === "executive")
              .map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group relative bg-navy-800 rounded-[2rem] overflow-hidden border border-gold/30 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500"
                >
                  {/* Gold Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5 relative h-96 md:h-auto">
                      <Image
                        src={`/images/team/${member.name.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-")}.jpg`}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-navy-900 via-transparent to-transparent opacity-80 md:opacity-100"></div>

                      {/* Executive Badge */}
                      <div className="absolute top-4 left-4 bg-gold text-navy-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Executive
                      </div>
                    </div>

                    <div className="md:w-3/5 p-8 relative z-10 flex flex-col justify-center">
                      <h3 className="text-3xl font-bold text-white mb-2 font-display">{member.name}</h3>
                      <p className="text-gold font-medium mb-6 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-gold/50"></span>
                        {member.position}
                      </p>
                      <p className="text-gray-300 leading-relaxed mb-8 font-light">
                        {member.bio}
                      </p>

                      <div className="flex items-center gap-4 mt-auto">
                        <a href={`mailto:${member.email}`} className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:text-navy-900 hover:border-gold transition-all duration-300 group-hover:-translate-y-1">
                          <Mail className="w-5 h-5" />
                        </a>
                        <a href={member.linkedin} className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 group-hover:-translate-y-1">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>

        {/* Management Team */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">Management & Heads</h2>
              <p className="text-gray-500 max-w-2xl text-lg">Driving operational success and nurturing our company culture.</p>
            </div>
            <div className="h-[1px] flex-1 bg-gray-200 mx-8 hidden md:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers
              .filter((member) => member.tier === "management")
              .map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-72 overflow-hidden bg-gray-100">
                    <Image
                      src={`/images/team/${member.name.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-")}.jpg`}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="flex gap-3">
                        <a href={`mailto:${member.email}`} className="text-white hover:text-gold transition-colors">
                          <Mail className="w-5 h-5" />
                        </a>
                        <a href={member.linkedin} className="text-white hover:text-gold transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-navy-900 group-hover:text-primary transition-colors">{member.name}</h3>
                    <p className="text-primary font-medium text-sm mb-3">{member.position}</p>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>

        {/* Specialists - UPGRADED DESIGN */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">Specialists & Experts</h2>
            <p className="text-gray-500">The technical experts ensuring precision in every operation.</p>
            <div className="w-16 h-1 bg-primary mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers
              .filter((member) => member.tier === "specialist")
              .map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row h-full sm:h-48"
                >
                  {/* Upgraded Image Section - Larger */}
                  <div className="relative w-full sm:w-40 h-56 sm:h-full shrink-0 bg-gray-100">
                    <Image
                      src={`/images/team/${member.name.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-")}.jpg`}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Social Overlay */}
                    <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a href={`mailto:${member.email}`} className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm text-white transition-all">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-center">
                    <h4 className="text-lg font-bold text-navy-900 group-hover:text-primary transition-colors mb-1">{member.name}</h4>
                    <p className="text-primary font-semibold text-xs uppercase tracking-wide mb-2">{member.position}</p>
                    <p className="text-xs text-gray-500 mb-2 font-medium bg-gray-50 inline-block px-2 py-1 rounded w-fit">{member.department}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/10 to-transparent"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Guided by Unwavering Values</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { icon: Shield, label: "Safety First" },
                  { icon: CheckCircle2, label: "Integrity" },
                  { icon: Award, label: "Excellence" },
                  { icon: Target, label: "Innovation" },
                  { icon: Users, label: "Collaboration" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="p-3 bg-gradient-to-br from-gold to-yellow-600 rounded-full text-white shadow-lg">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-200 font-medium text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* CTA Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-navy-900 mb-6">Ready to Join the Elite?</h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">We are always looking for exceptional talent to join our world-class team.</p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-orange-600 transition-all transform hover:-translate-y-1">
              View Opportunities
            </button>
            <button className="px-8 py-4 bg-white text-navy-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all transform hover:-translate-y-1">
              Contact HR
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
