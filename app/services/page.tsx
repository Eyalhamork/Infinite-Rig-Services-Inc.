"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Anchor,
  Package,
  Briefcase,
  Shield,
  Wrench,
  Users,
  CheckCircle2,
  ArrowRight,
  Ship,
  Truck,
  HardHat,
  Award,
  Clock,
  TrendingUp,
  Zap,
  FileCheck,
  Headphones,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: Anchor,
      title: "Offshore Services",
      route: "offshore",
      tagline: "Expert operations for offshore platforms",
      description:
        "Comprehensive technical support and operational excellence for drilling rigs and offshore platforms. Our experienced crews ensure safe, efficient operations in the most challenging environments.",
      gradient: "from-blue-600 to-blue-800",
      imagePlaceholder: "/images/services/offshore-operations.png",
      imageAlt: "Offshore platform operations",
      features: [
        { icon: Ship, text: "Drilling Support Operations" },
        { icon: Wrench, text: "Platform Maintenance & Repair" },
        { icon: Shield, text: "Safety Management Systems" },
        { icon: Users, text: "Crew Rotation Management" },
      ],
      capabilities: [
        "Drilling rig operations and maintenance",
        "Production platform support",
        "Emergency response and contingency planning",
        "Asset integrity management",
        "Technical training and competency assurance",
      ],
    },
    {
      icon: Package,
      title: "Supply Chain & Logistics",
      route: "supply",
      tagline: "Seamless procurement and delivery",
      description:
        "End-to-end supply chain solutions designed for the unique demands of offshore operations. From procurement to delivery, we ensure your operations never miss a beat.",
      gradient: "from-green-600 to-green-800",
      imagePlaceholder: "/images/services/supply-operations.png",
      imageAlt: "Supply chain and logistics operations",
      features: [
        { icon: Package, text: "Procurement Management" },
        { icon: Truck, text: "Logistics & Transportation" },
        { icon: Shield, text: "Warehousing Solutions" },
        { icon: Clock, text: "Just-in-Time Delivery" },
      ],
      capabilities: [
        "Strategic sourcing and vendor management",
        "Marine logistics and offshore transportation",
        "Customs clearance and documentation",
        "Material management and warehousing",
        "Supply chain risk management",
      ],
    },
    {
      icon: Briefcase,
      title: "Manning Services",
      route: "manning",
      tagline: "Elite workforce solutions",
      description:
        "Comprehensive recruitment, training, and deployment of highly qualified offshore personnel. We build teams that deliver exceptional performance and maintain the highest safety standards.",
      gradient: "from-purple-600 to-purple-800",
      imagePlaceholder: "/images/services/manning-hero.png",
      imageAlt: "Professional offshore workforce",
      features: [
        { icon: Users, text: "Talent Recruitment" },
        { icon: Award, text: "Certification Programs" },
        { icon: HardHat, text: "Safety Training" },
        { icon: FileCheck, text: "Compliance Verification" },
      ],
      capabilities: [
        "Technical and operational recruitment",
        "Offshore training and competency development",
        "Crew management and rotation planning",
        "Certification and compliance management",
        "Performance monitoring and development",
      ],
    },
    {
      icon: Shield,
      title: "HSE Consulting",
      route: "hse",
      tagline: "Building zero-incident cultures",
      description:
        "Expert Health, Safety, and Environmental consulting to help organizations build world-class safety cultures that protect people, assets, and the environment.",
      gradient: "from-red-600 to-red-800",
      imagePlaceholder: "/images/services/offshore-hero.png",
      imageAlt: "HSE safety consulting",
      features: [
        { icon: ClipboardCheck, text: "Safety Audits" },
        { icon: AlertTriangle, text: "Risk Assessment" },
        { icon: Users, text: "HSE Training" },
        { icon: FileCheck, text: "Compliance Management" },
      ],
      capabilities: [
        "HSE management system development",
        "Safety audits and inspections",
        "Emergency response planning",
        "Incident investigation and analysis",
        "Regulatory compliance consulting",
      ],
    },
    {
      icon: TrendingUp,
      title: "Waste Management",
      route: "waste-management",
      tagline: "Sustainable environmental solutions",
      description:
        "Integrated waste management services for the offshore industry, focusing on hazardous material handling, recycling, and compliance with environmental regulations.",
      gradient: "from-teal-600 to-teal-800",
      imagePlaceholder: "/images/services/waste-management-hero.png",
      imageAlt: "Waste management operations",
      features: [
        { icon: AlertTriangle, text: "Hazardous Waste" },
        { icon: TrendingUp, text: "Recycling Programs" },
        { icon: Truck, text: "Transport & Disposal" },
        { icon: FileCheck, text: "EPA Reporting" },
      ],
      capabilities: [
        "Hazardous and non-hazardous waste collection",
        "Offshore waste segregation and transport",
        "Environmental impact assessment and reporting",
        "Recycling and resource recovery",
        "Regulatory compliance management",
      ],
    },
  ];

  const whyChoose = [
    {
      icon: Award,
      title: "ISO Certified",
      desc: "International quality standards",
    },
    { icon: Shield, title: "Safety First", desc: "Zero-incident track record" },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "Always available when needed",
    },
    { icon: Zap, title: "Rapid Response", desc: "Quick mobilization times" },
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
              <Anchor className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">Our Capabilities</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              Comprehensive <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary-300 to-gold">
                Offshore Solutions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
              Three decades of excellence delivering world-class offshore
              support, supply chain management, and manning services across West Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Detailed with Images */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                {/* Text Content */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-2 mb-6">
                    <div className={`w-12 h-1 bg-gradient-to-r ${service.gradient} rounded-full`}></div>
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${service.gradient} font-bold text-sm uppercase tracking-widest`}>
                      {service.tagline}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6 leading-tight">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-10">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start space-x-4 group/item">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover/item:scale-110 transition-transform`}
                        >
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm text-navy-900 font-bold leading-tight pt-3 group-hover/item:text-primary transition-colors">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/services/${service.route}`}
                    className={`group relative overflow-hidden bg-gradient-to-r ${service.gradient} text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-${service.gradient.split('-')[1]}-500/20 transition-all duration-300 inline-flex items-center`}
                  >
                    <span className="relative z-10 flex items-center">
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>

                {/* Image + Capabilities Card */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="relative">
                    {/* Service Image */}
                    <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-navy-900/10 group">
                      <Image
                        src={service.imagePlaceholder}
                        alt={service.imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-20 group-hover:opacity-10 transition-opacity duration-500 mix-blend-multiply`}></div>
                    </div>

                    {/* Capabilities Card */}
                    <div className="absolute -bottom-10 -right-10 w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white hidden md:block">
                      <h3 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                        <Shield className={`w-5 h-5 text-${service.gradient.split('-')[1]}-600`} />
                        Key Capabilities
                      </h3>
                      <ul className="space-y-4">
                        {service.capabilities.slice(0, 4).map((capability, i) => (
                          <li key={i} className="flex items-start space-x-3">
                            <CheckCircle2 className={`h-5 w-5 text-${service.gradient.split('-')[1]}-500 flex-shrink-0 mt-0.5`} />
                            <span className="text-gray-600 text-sm font-medium leading-relaxed">
                              {capability}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-navy-900 relative overflow-hidden">
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
              The Infinite Advantage
            </span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-6">Why Choose Our Services</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              Proven excellence, unwavering commitment, and results that exceed expectations time and time again.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl text-center group hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border border-white/5 shadow-inner">
                  <item.icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-orange-600 to-orange-700 text-white relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90 font-light">
            Contact our team to discuss how we can support your offshore
            operations.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl inline-block"
          >
            Request Consultation
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
