"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import HeroCarousel from "@/components/HeroCarousel";
import ClientMarquee from "@/components/ClientMarquee";
import AnimatedCounter from "@/components/AnimatedCounter";
import TestimonialSlider from "@/components/TestimonialSlider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  Users,
  Anchor,
  Award,
  Globe,
  Zap,
  CheckCircle2,
  TrendingUp,
  Target,
  Clock,
  Star,
  ChevronRight,
  Ship,
  Package,
  Briefcase,
  FileCheck,
  HeadphonesIcon,
  BarChart3,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section - Dynamic Carousel */}
      <HeroCarousel />

      {/* Trust Bar */}
      <section className="py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-medium">ISO 9001 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-medium">LiMA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-gold" />
              <span className="font-medium">15+ Years Excellence</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span className="font-medium">Regional Leader</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By - Infinite Marquee */}
      <ClientMarquee />

      {/* Services - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
              Comprehensive Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end offshore services designed to maximize operational
              efficiency and safety standards
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                icon: Anchor,
                title: "Offshore Services",
                desc: "Expert technical support and operations for drilling rigs and offshore platforms with highly trained crews.",
                features: [
                  "Drilling Support",
                  "Platform Operations",
                  "Technical Maintenance",
                ],
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: Package,
                title: "Supply Chain",
                desc: "Efficient procurement, logistics, and transportation solutions ensuring seamless offshore operations.",
                features: ["Procurement", "Logistics", "Transportation"],
                gradient: "from-green-500 to-green-600",
              },
              {
                icon: Briefcase,
                title: "Manning Services",
                desc: "Recruitment, training, and certification of qualified offshore personnel and specialized crew members.",
                features: ["Recruitment", "Training", "Certification"],
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: Shield,
                title: "HSE Consulting",
                desc: "Comprehensive Health, Safety, and Environmental consulting to ensure zero-incident operations.",
                features: ["Safety Audits", "Risk Assessment", "Compliance"],
                gradient: "from-orange-500 to-orange-600",
              },
              {
                icon: Ship,
                title: "Waste Management",
                desc: "Integrated hazardous waste handling, recycling, and disposal solutions for sustainable offshore operations.",
                features: ["Hazardous Handling", "Recycling", "EPA Compliance"],
                gradient: "from-teal-500 to-teal-600",
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
                ></div>

                <div
                  className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-navy mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.desc}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, j) => (
                    <li
                      key={j}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services/${service.title.toLowerCase().split(" ")[0] === "hse"
                    ? "hse"
                    : service.title.toLowerCase().split(" ")[0]
                    }`}
                  className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all group/link"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Premium */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                value: 500,
                suffix: "+",
                label: "Projects Delivered",
                icon: Target,
                color: "text-blue-600",
              },
              {
                value: 15,
                suffix: "+",
                label: "Years Experience",
                icon: TrendingUp,
                color: "text-green-600",
              },
              {
                value: 200,
                suffix: "+",
                label: "Skilled Professionals",
                icon: Users,
                color: "text-purple-600",
              },
              {
                value: 24,
                suffix: "/7",
                label: "Support Available",
                icon: Clock,
                color: "text-orange-600",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="mb-2 h-14 flex items-center justify-center">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Social Proof */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              What Our Partners Say
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
              Trusted by Industry Leaders
            </h2>
          </motion.div>

          <TestimonialSlider />
        </div>
      </section>

      {/* Why Choose Us - Premium Bento Grid */}
      <section className="py-24 bg-navy relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-600/5 rounded-full blur-[100px]"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Choose <span className="text-primary">IRS</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We combine local expertise with global standards to deliver
              excellence in every project.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
            {/* Feature 1: Safety - Large Item */}
            <motion.div
              variants={fadeInUp}
              className="md:col-span-2 md:row-span-2 group relative p-8 rounded-3xl bg-navy-800 border border-navy-700 hover:border-primary/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Uncompromised Safety
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Safety is our core value. We maintain rigorous HSE standards
                    to ensure the well-being of our team and the integrity of
                    your operations, achieving industry-leading safety records.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Compliance */}
            <motion.div
              variants={fadeInUp}
              className="md:col-span-1 group relative p-6 rounded-3xl bg-navy-800 border border-navy-700 hover:border-blue-500/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Global Standards
              </h3>
              <p className="text-sm text-gray-400">
                ISO 9001 certified processes meeting international benchmarks.
              </p>
            </motion.div>

            {/* Feature 3: Local Expertise */}
            <motion.div
              variants={fadeInUp}
              className="md:col-span-1 group relative p-6 rounded-3xl bg-navy-800 border border-navy-700 hover:border-green-500/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Local Expertise
              </h3>
              <p className="text-sm text-gray-400">
                Deep understanding of the West African operational landscape.
              </p>
            </motion.div>

            {/* Feature 4: 24/7 Support */}
            <motion.div
              variants={fadeInUp}
              className="md:col-span-1 group relative p-6 rounded-3xl bg-navy-800 border border-navy-700 hover:border-purple-500/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                24/7 Support
              </h3>
              <p className="text-sm text-gray-400">
                Round-the-clock availability for critical offshore operations.
              </p>
            </motion.div>

            {/* Feature 5: Excellence */}
            <motion.div
              variants={fadeInUp}
              className="md:col-span-1 group relative p-6 rounded-3xl bg-navy-800 border border-navy-700 hover:border-cyan-500/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Excellence
              </h3>
              <p className="text-sm text-gray-400">
                Commitment to superior quality in every service delivery.
              </p>
            </motion.div>

            {/* Feature 6: Innovation - Wide Item */}
            <motion.div
              variants={fadeInUp}
              className="md:col-span-2 group relative p-8 rounded-3xl bg-navy-800 border border-navy-700 hover:border-pink-500/30 transition-all duration-500 flex flex-col md:flex-row items-center gap-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 flex-shrink-0 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Innovation Driven
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Leveraging the latest technologies and methodologies to optimize your supply chain and offshore logistics.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-orange-600 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHwid2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-xl mb-10 text-white/90 leading-relaxed">
              Join Liberia's leading offshore services company. Whether you're
              seeking world-class services or exploring career opportunities,
              we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/careers"
                className="group bg-white text-primary px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center"
              >
                Explore Careers
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group bg-navy text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-navy-700 hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center"
              >
                Request Consultation
                <HeadphonesIcon className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Premium */}
      <Footer />
    </div>
  );
}
