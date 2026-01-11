"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Anchor,
  Ship,
  Wrench,
  Shield,
  Users,
  CheckCircle2,
  Award,
  Clock,
  TrendingUp,
  FileCheck,
  Settings,
  Target,
  ArrowRight,
  HardHat,
  AlertTriangle,
  Zap,
} from "lucide-react";

export default function OffshoreServicesPage() {
  const capabilities = [
    {
      icon: Ship,
      title: "Drilling Operations",
      description:
        "Complete operational support for drilling rigs including crew management, maintenance scheduling, and performance optimization.",
      features: [
        "24/7 Operations Support",
        "Rig Move Coordination",
        "Drilling Equipment Maintenance",
        "Performance Optimization",
      ],
      gradient: "from-blue-500 to-blue-700",
    },
    {
      icon: Wrench,
      title: "Platform Maintenance",
      description:
        "Comprehensive maintenance programs ensuring optimal performance and extended asset life for production platforms.",
      features: [
        "Preventive Maintenance",
        "Emergency Repair Services",
        "Asset Integrity Management",
        "Lifecycle Planning",
      ],
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: Shield,
      title: "Safety Management",
      description:
        "Robust HSE systems and protocols ensuring zero-incident operations and full regulatory compliance.",
      features: [
        "Risk Assessment & Mitigation",
        "Safety Audits & Inspections",
        "Emergency Response Planning",
        "Regulatory Compliance",
      ],
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Crew Management",
      description:
        "Strategic workforce planning, rotation management, and competency assurance for offshore teams.",
      features: [
        "Strategic Crew Planning",
        "Competency Assurance",
        "Performance Management",
        "Welfare & Logistics",
      ],
      gradient: "from-violet-500 to-fuchsia-600",
    },
  ];

  const services = [
    "Drilling rig operations and supervision",
    "Production platform support and optimization",
    "Mechanical and electrical maintenance",
    "Subsea operations and interventions",
    "Emergency response and contingency planning",
    "Asset integrity management programs",
    "Technical training and competency development",
    "HSE compliance and audit support",
    "Equipment procurement and supply",
    "Documentation and reporting systems",
  ];

  const stats = [
    { value: "200+", label: "Offshore Projects", icon: Target },
    { value: "15+", label: "Years Experience", icon: Award },
    { value: "24/7", label: "Support Coverage", icon: Clock },
    { value: "99.9%", label: "Safety Record", icon: Shield },
  ];

  const process = [
    {
      step: "01",
      title: "Assessment & Planning",
      description:
        "Comprehensive evaluation of your operational requirements and development of customized solutions.",
      icon: FileCheck,
    },
    {
      step: "02",
      title: "Mobilization",
      description:
        "Rapid deployment of qualified personnel and equipment with full documentation and compliance.",
      icon: Users,
    },
    {
      step: "03",
      title: "Execution",
      description:
        "Professional offshore operations with continuous monitoring, optimization, and safety oversight.",
      icon: Settings,
    },
    {
      step: "04",
      title: "Optimization",
      description:
        "Ongoing performance analysis and improvement initiatives to maximize efficiency and reduce costs.",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-navy-900 before:absolute before:inset-0 before:bg-[url('/bg-pattern.svg')] before:opacity-5 before:z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-primary-950 opacity-95 z-0"></div>

        {/* Animated Orbs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] animate-pulse z-0 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[128px] animate-pulse delay-1000 z-0 mix-blend-screen"></div>

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
                <Anchor className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">
                  Service Capability
                </span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
                Offshore <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400">
                  Operations
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-xl font-light">
                World-class support and operational excellence for your offshore
                assets and drilling campaigns, delivered by expert West African teams.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="bg-gold text-navy-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                >
                  Request Consultation
                </Link>
                <div className="flex items-center space-x-4 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-blue-500 border-2 border-navy-900 relative flex items-center justify-center text-[10px] font-bold text-white">
                        <Users className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-300 font-medium">Expert Teams Ready</span>
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
                  src="/images/services/offshore-hero-premium.png"
                  alt="Offshore Platform Operations"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-transparent to-transparent"></div>

                {/* Floating Card */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-white font-bold">Operational Status</div>
                        <div className="text-green-400 text-xs font-bold uppercase tracking-wider">Optimal Efficiency</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">99.9%</div>
                      <div className="text-gray-400 text-xs">Uptime</div>
                    </div>
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
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full">
              Why Infinite Rig
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mt-6 mb-6">
              Comprehensive Offshore Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Integrated services to support every stage of your offshore
              lifecycle, from exploration to decommissioning.
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
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${capability.gradient} opacity-5 rounded-bl-full -mr-16 -mt-16 transition-opacity group-hover:opacity-10`}></div>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${capability.gradient} flex items-center justify-center mb-8 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <capability.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-blue-700 transition-colors">
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
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${capability.gradient}`}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Feature Section - Dark Mode */}
      <section className="py-32 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-blue-950"></div>
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/services/offshore-drilling-premium.png" alt="Background" fill className="object-cover" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold font-bold text-sm uppercase tracking-widest mb-4 block">Operations in Action</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Engineering Excellence <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">at Sea</span>
              </h2>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <Target className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Precision Operations</h4>
                    <p className="text-gray-400 leading-relaxed">
                      Complex drilling campaigns managed with absolute precision, utilizing state-of-the-art telemetry and remote monitoring systems.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <HardHat className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Expert Personnel</h4>
                    <p className="text-gray-400 leading-relaxed">
                      Our crews are not just workers; they are highly trained specialists with deep experience in West African offshore geology and conditions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <TrendingUp className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Continuous Optimization</h4>
                    <p className="text-gray-400 leading-relaxed">
                      We don't just maintain; we optimize. Our performance analysis protocols consistently identify opportunities for efficiency gains.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 mt-12">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
                  <Image src="/images/services/offshore-drilling-premium.png" alt="Drilling" fill className="object-cover hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl bg-blue-900/30 border border-white/10 p-6">
                  <h3 className="text-3xl font-bold text-white mb-2">15+</h3>
                  <p className="text-gray-300 text-sm">Years of Drilling Excellence</p>
                  <div className="absolute bottom-4 right-4 text-white/10">
                    <Award className="w-16 h-16" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl bg-gold/10 border border-gold/20 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-gold mb-1">ISO 45001</h3>
                  <p className="text-gold/80 text-sm">Certified Safety Management</p>
                </div>
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <Image src="/images/services/offshore-team-premium.png" alt="Team" fill className="object-cover hover:scale-110 transition-transform duration-700" />
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
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Our Methodology</span>
            <h2 className="text-4xl font-bold text-navy-900 mt-2">Operational Workflow</h2>
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
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 relative z-10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3 relative z-10">{item.title}</h3>
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

      {/* Safety Section - Redesigned */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] overflow-hidden relative"
          >
            <div className="absolute inset-0">
              <Image src="/images/services/offshore-safety-premium.png" alt="Safety Background" fill className="object-cover" />
              <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 p-10 md:p-20 text-center">
              <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full font-bold mb-8 border border-red-500/30">
                <AlertTriangle className="h-5 w-5" />
                <span className="uppercase tracking-wider text-sm">Priority One</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 max-w-4xl mx-auto leading-tight">
                Zero Compromise on <br />
                <span className="text-red-400">Safety & Compliance</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-12">
                {[
                  "ISO 45001 Certified",
                  "Daily Risk Assessments",
                  "Emergency Response Drills",
                  "0.00 LTIFR Target"
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <CheckCircle2 className="h-8 w-8 text-green-400 mb-4 mx-auto" />
                    <span className="text-white font-medium block">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-14">
                <button className="bg-white text-navy-900 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-xl">
                  View HSE Policy
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-navy-900 to-primary-950 text-white relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Optimize Your <br /> Offshore Operations?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300 font-light">
            Partner with us for reliable, safe, and efficient offshore solutions tailored
            to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              Request Technical Proposal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
