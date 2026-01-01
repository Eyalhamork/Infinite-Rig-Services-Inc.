"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Target,
  Heart,
  Shield,
  Users,
  TrendingUp,
  Award,
  Globe,
  Zap,
  CheckCircle2,
  Building2,
  Anchor,
  Ship,
  History,
  Medal,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Zero-incident culture. We believe every accident is preventable and compromise on safety is never an option.",
    },
    {
      icon: CheckCircle2,
      title: "Unwavering Integrity",
      description:
        "We conduct business with transparency, honesty, and ethical standards that build lasting trust.",
    },
    {
      icon: Medal,
      title: "Excellence",
      description: "Delivering superior quality through continuous improvement and world-class standards.",
    },
    {
      icon: Users,
      title: "Collaborative Growth",
      description:
        "Fostering a culture where innovation, teamwork, and mutual success drive our operations.",
    },
  ];

  const milestones = [
    {
      year: "2010",
      title: "Foundation",
      desc: "Established in Monrovia with a vision to transform offshore support.",
    },
    {
      year: "2012",
      title: "ISO Certification",
      desc: "Achieved ISO 9001:2015, setting the standard for quality.",
    },
    {
      year: "2015",
      title: "Regional Expansion",
      desc: "Extended operations to serve major clients across West Africa.",
    },
    {
      year: "2018",
      title: "500+ Projects",
      desc: "Celebrated a major milestone of successful project deliveries.",
    },
    {
      year: "2020",
      title: "Digital Leap",
      desc: "Integrated advanced digital systems for operational efficiency.",
    },
    {
      year: "2025",
      title: "Market Leader",
      desc: "Recognized as the premier offshore services partner in the region.",
    },
  ];

  const stats = [
    { value: "15+", label: "Years Experience", icon: TrendingUp },
    { value: "500+", label: "Projects Delivered", icon: CheckCircle2 },
    { value: "200+", label: "Expert Staff", icon: Users },
    { value: "100%", label: "Safety Record", icon: Shield },
  ];

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
              <Building2 className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">About Infinite Rig Services</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              Powering Africa's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary-300 to-gold">
                Energy Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
              Building on a foundation of excellence, safety, and innovation to
              deliver world-class offshore services across West Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story with Office Image */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-1 bg-primary rounded-full"></div>
                <span className="text-primary font-bold text-sm uppercase tracking-widest">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-8 leading-tight">
                Building Excellence <br /> Since <span className="text-primary">2010</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-light">
                <p>
                  Founded in the heart of Monrovia, Infinite Rig Services
                  emerged with a clear vision: to become Liberia's premier
                  provider of offshore support services. What began as a strategic initiative has evolved into a regional power-house.
                </p>
                <p>
                  Our journey has been marked by unwavering commitment to
                  <strong className="text-navy-900 font-semibold"> safety, operational excellence, and client satisfaction</strong>.
                  Through strategic investments in people, technology, and
                  infrastructure, we've built a reputation for accuracy and reliability in the most demanding environments.
                </p>
                <p>
                  Today, with over <strong className="text-navy-900 font-semibold">200 dedicated professionals</strong> and a track
                  record of successful projects, we continue to set
                  industry standards while maintaining our core values.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Premium Image Frame */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-navy-900/20 border-8 border-gray-50 h-[600px]">
                <Image
                  src="/images/office-building.png"
                  alt="Infinite Rig Services Office - Crown Prince Plaza"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-80"></div>

                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gold/20 backdrop-blur-sm rounded-lg border border-gold/30">
                      <Building2 className="w-5 h-5 text-gold" />
                    </div>
                    <span className="text-gold font-bold tracking-widest uppercase text-xs">Headquarters</span>
                  </div>
                  <p className="text-2xl font-bold mb-1">Crown Prince Plaza</p>
                  <p className="text-sm text-gray-300">
                    Congo Town, Monrovia, Liberia
                  </p>
                </div>
              </div>

              {/* Floating Glass Stats */}
              <div className="absolute -bottom-10 -left-10 md:-left-20 bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-navy-900">15+</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Years Experience</p>
                  </div>
                </div>
                <div className="h-px bg-gray-200 mb-6"></div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-navy-50 rounded-xl text-navy-900">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-navy-900">500+</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Projects Done</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values - Premium Cards */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              Principles That Guide Us
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values are the foundation of everything we do, shaping
              our culture and driving our success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100%] transition-colors group-hover:bg-primary/5"></div>

                <div className="w-16 h-16 bg-navy-50 group-hover:bg-navy-900 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 relative z-10">
                  <value.icon className="h-8 w-8 text-navy-900 group-hover:text-gold transition-colors duration-300" />
                </div>

                <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Navy & Gold */}
      <section className="py-24 bg-navy-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-black"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/bg-pattern.svg')] opacity-5"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold font-bold text-sm uppercase tracking-widest">
              Our Journey
            </span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">Milestones of Success</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A timeline of growth, achievement, and continuous innovation.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-gold/30 hover:bg-white/10 transition-all duration-300 relative z-10 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-primary-300 font-display">
                        {milestone.year}
                      </div>
                      <div className="h-px bg-white/20 flex-1 ml-4 group-hover:bg-gold/50 transition-colors"></div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{milestone.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications - Metallic Badges */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-[3rem] p-12 md:p-20 text-center border border-gray-100 shadow-inner"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="h-8 w-8 text-gold" />
              <span className="text-primary font-bold tracking-widest uppercase">Official Recognition</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-navy-900 mb-6">
              Certified Excellence
            </h2>
            <p className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto">
              Our commitment to quality is validated through international
              certifications and strict adherence to industry standards.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {[
                { name: "ISO 9001:2015", sub: "Quality Management", color: "from-slate-700 to-slate-900" },
                { name: "LiMA Compliant", sub: "Liberia Maritime Authority", color: "from-blue-800 to-navy-900" },
                { name: "HSE Certified", sub: "Health & Safety", color: "from-green-700 to-green-900" }
              ].map((cert, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className={`w-64 h-64 rounded-full bg-gradient-to-br ${cert.color} p-1 shadow-2xl flex items-center justify-center relative group`}
                >
                  <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                  <div className="absolute inset-2 rounded-full border border-white/20 border-dashed animate-spin-slow"></div>

                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <CheckCircle2 className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1 font-display">{cert.name}</h3>
                    <p className="text-gray-300 text-xs uppercase tracking-wide">{cert.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-orange-600 to-orange-700 text-white relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Growing Team</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90 font-light">
            Be part of a company that values excellence, innovation, and your
            professional growth.
          </p>
          <button className="bg-white text-primary px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl">
            View Career Opportunities
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
