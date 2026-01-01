"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  Award,
  CheckCircle2,
  HardHat,
  FileCheck,
  Target,
  Clock,
  Zap,
  UserCheck,
  BookOpen,
  ArrowRight,
  Briefcase,
  Globe,
  Star,
  Shield,
  Search,
} from "lucide-react";

export default function ManningServicesPage() {
  const capabilities = [
    {
      icon: Users,
      title: "Strategic Recruitment",
      description:
        "Access to a vast network of pre-vetted West African offshore professionals, ready for rapid deployment.",
      features: [
        "Executive & Technical Search",
        "Competency-Based Selection",
        "Background & Medical Vetting",
        "Rapid Mobilization",
      ],
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: GraduationCap,
      title: "Training & Development",
      description:
        "World-class training programs ensuring your workforce meets international safety and technical standards.",
      features: [
        "BOSIET / HUET / STCW",
        "Technical Skills Upgrading",
        "Leadership Development",
        "Safety Culture Induction",
      ],
      gradient: "from-violet-500 to-fuchsia-600",
    },
    {
      icon: FileCheck,
      title: "Compliance & Admin",
      description:
        "Full-service management of crew logistics, payroll, visas, and regulatory compliance.",
      features: [
        "Visa & Work Permits",
        "Payroll & Tax Management",
        "Medical Certification",
        "Travel & Logistics",
      ],
      gradient: "from-indigo-500 to-purple-700",
    },
    {
      icon: Shield,
      title: "Crew Management",
      description:
        "End-to-end workforce lifecycle management focused on retention, welfare, and performance.",
      features: [
        "Rotation Planning",
        "Performance Appraisals",
        "Crew Welfare Programs",
        "Emergency Response",
      ],
      gradient: "from-fuchsia-500 to-pink-600",
    },
  ];

  const stats = [
    { value: "2,000+", label: "Personnel Placed", icon: Users },
    { value: "98%", label: "Retention Rate", icon: Target },
    { value: "24h", label: "Rapid Mobilization", icon: Clock },
    { value: "100%", label: "Compliance", icon: Shield },
  ];

  const process = [
    {
      step: "01",
      title: "Needs Assessment",
      description:
        "We analyze your project requirements to define the exact skill sets and crew mix needed.",
      icon: Search,
    },
    {
      step: "02",
      title: "Sourcing & Vetting",
      description:
        "Rigorous selection process including technical assessments, medicals, and background checks.",
      icon: UserCheck,
    },
    {
      step: "03",
      title: "Traffic & Deployment",
      description:
        "Seamless handling of logistics, visas, and documentation for on-time mobilization.",
      icon: Globe,
    },
    {
      step: "04",
      title: "Management",
      description:
        "Ongoing support, payroll, and performance monitoring throughout the project lifecycle.",
      icon: Users,
    },
  ];

  const roles = [
    {
      category: "Technical Crew",
      items: ["Drilling Engineers", "Mechanics", "Electricians", "Welders"],
    },
    {
      category: "Marine Crew",
      items: ["Captains", "Officers", "Dynamic Positioning Ops", "Deck Crew"],
    },
    {
      category: "Support Staff",
      items: ["HSE Officers", "Medics", "Camp Boss", "Catering Staff"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-navy-900 before:absolute before:inset-0 before:bg-[url('/bg-pattern.svg')] before:opacity-5 before:z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-purple-950 to-black opacity-95 z-0"></div>

        {/* Animated Orbs - Purple Theme */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse z-0 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[128px] animate-pulse delay-1000 z-0 mix-blend-screen"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-8"
              >
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">
                  Workforce Solutions
                </span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
                Elite Offshore <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-indigo-400">
                  Talent
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-xl font-light">
                Connecting you with the region's most qualified, certified, and dedicated offshore professionals. We build the teams that power your success.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-purple-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                >
                  Find Talent
                </Link>
                <div className="flex items-center space-x-4 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-navy-900 relative flex items-center justify-center text-[10px] font-bold text-white"
                      >
                        <UserCheck className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-300 font-medium">
                    Verified Professionals
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src="/images/services/manning-hero-premium.png"
                  alt="Elite Offshore Crew"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-transparent to-transparent"></div>

                {/* Floating Card */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-white font-bold">
                          Compliance Status
                        </div>
                        <div className="text-purple-400 text-xs font-bold uppercase tracking-wider">
                          Fully Certified
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-white/10 text-xs text-white">ISO 9001</span>
                    <span className="px-2 py-1 rounded bg-white/10 text-xs text-white">MLC 2006</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 -mt-10 mb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200 border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 rounded-xl mb-3">
                  <stat.icon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-purple-600 font-bold text-sm uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-full">
              Workforce Excellence
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mt-6 mb-6">
              Total Manning Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              From recruitment to retirement, we manage the entire lifecycle of
              your offshore workforce with precision and care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {capabilities.map((capability, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${capability.gradient} opacity-5 rounded-bl-full -mr-16 -mt-16 transition-opacity group-hover:opacity-10`}
                ></div>

                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${capability.gradient} flex items-center justify-center mb-8 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <capability.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-purple-700 transition-colors">
                  {capability.title}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {capability.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                  {capability.features.map((feature, j) => (
                    <div
                      key={j}
                      className="flex items-center space-x-3 text-sm font-medium text-gray-700"
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${capability.gradient}`}
                      ></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Feature Section - Training */}
      <section className="py-32 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-purple-950 to-navy-900"></div>
        {/* Background Overlay */}
        <div className="absolute inset-0 opacity-10">
          {/* Fallback pattern if image fails */}
          <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-purple-400 font-bold text-sm uppercase tracking-widest mb-4 block">
                Competency Assurance
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Investing in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  Human Capital
                </span>
              </h2>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Advanced Training</h4>
                    <p className="text-gray-400 leading-relaxed">State-of-the-art simulation and classroom training to ensure technical proficiency and safety awareness.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <Briefcase className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Career Progression</h4>
                    <p className="text-gray-400 leading-relaxed">Structured career paths that retain top talent and build institutional knowledge for your operations.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image src="/images/services/manning-training-premium.png" alt="Training" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl inline-block max-w-xs">
                    <p className="text-white font-medium">"Our people are our greatest asset. Investing in them is investing in safety and efficiency."</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wide">
              The Workflow
            </span>
            <h2 className="text-4xl font-bold text-navy-900 mt-2">Mobilization Process</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="text-5xl font-bold text-gray-100 mb-6 absolute top-4 right-6 select-none">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600 relative z-10 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3 relative z-10">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                    {item.description}
                  </p>
                </div>
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Roles Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Available Crew Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {roles.map((role, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                      <h3 className="text-xl font-bold text-white">{role.category}</h3>
                    </div>
                    <ul className="space-y-3">
                      {role.items.map((item, j) => (
                        <li key={j} className="flex items-center text-gray-300">
                          <Star className="w-4 h-4 text-purple-400 mr-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Build Your Team?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300 font-light">
            Contact us today to discuss your manning requirements and access our premium talent pool.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="bg-white text-purple-900 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Request Staffing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
