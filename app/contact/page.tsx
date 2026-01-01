"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Building2,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { submitContactForm } from "@/app/actions";
import { toast } from "sonner";
import SuccessModal from "@/components/ui/SuccessModal";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // No changes to imports here, we will add server action later

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const promise = submitContactForm(formData);

    toast.promise(promise, {
      loading: 'Sending message...',
      success: (data) => {
        if (data.error) throw new Error(data.error);
        setFormData({ name: "", email: "", company: "", phone: "", subject: "", message: "" });
        setShowSuccessModal(true);
        return 'Message sent successfully!';
      },
      error: (err) => err.message || 'Failed to send message'
    });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      detail: "+231 88 191 5322",
      subtitle: "Mon-Fri 8am-6pm",
    },
    {
      icon: Mail,
      title: "Email Us",
      detail: "info@infiniterigservices.com",
      subtitle: "24 hour response time",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      detail: "Crown Prince Plaza, Congo Town",
      subtitle: "Monrovia, Liberia",
    },
    {
      icon: Clock,
      title: "Office Hours",
      detail: "Monday - Friday",
      subtitle: "8:00 AM - 6:00 PM WAT",
    },
  ];

  const departments = [
    { name: "General Inquiries", email: "info@infiniterigservices.com" },
    { name: "Sales & Business", email: "sales@infiniterigservices.com" },
    { name: "Careers", email: "careers@infiniterigservices.com" },
    { name: "Support", email: "support@infiniterigservices.com" },
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
              <MessageSquare className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">Get In Touch</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              Let's Start a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary-300 to-gold">
                Conversation
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
              Have questions about our services? Ready to discuss your offshore
              needs? Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods - Unified Premium Look */}
      <section className="relative -mt-20 z-20 px-4 pb-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[2rem] p-8 shadow-xl shadow-navy-900/5 hover:shadow-2xl hover:shadow-navy-900/10 transition-all duration-300 border border-gray-100 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-navy-900 transition-colors duration-300">
                  <method.icon className="h-7 w-7 text-navy-900 group-hover:text-gold transition-colors duration-300" />
                </div>

                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-primary font-bold text-lg mb-2">
                  {method.detail}
                </p>
                <p className="text-sm text-gray-500 font-medium bg-gray-50 inline-block px-3 py-1 rounded-full">{method.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100"
            >
              <span className="text-primary font-bold text-sm uppercase tracking-widest">
                Send a Message
              </span>
              <h2 className="text-4xl font-bold text-navy-900 mt-3 mb-8">
                How can we help?
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all placeholder:text-gray-400 font-medium"
                      name="name"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all placeholder:text-gray-400 font-medium"
                      name="email"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all placeholder:text-gray-400 font-medium"
                      name="company"
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all placeholder:text-gray-400 font-medium"
                      name="phone"
                      placeholder="+231..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Subject *
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all appearance-none cursor-pointer font-medium text-gray-700"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="services">Services Information</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="careers">Career Inquiry</option>
                      <option value="support">Technical Support</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={5}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all resize-none placeholder:text-gray-400 font-medium"
                    placeholder="How can we assist you today?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-navy-900 to-navy-800 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-navy-900/20 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center group"
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform text-gold" />
                </button>
              </form>
            </motion.div>

            {/* Info Sidebar with Office Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Office Image & Info */}
              <div className="bg-navy-900 rounded-[2.5rem] overflow-hidden text-white shadow-2xl relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>

                {/* Office Building Image */}
                <div className="relative h-72">
                  <Image
                    src="/images/office-building.png"
                    alt="Infinite Rig Services Office"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent"></div>

                  <div className="absolute bottom-6 left-8">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-4">
                      <Building2 className="h-8 w-8 text-gold" />
                    </div>
                    <h3 className="text-3xl font-bold">Head Office</h3>
                  </div>
                </div>

                <div className="p-8 pt-2">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <MapPin className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Address</p>
                        <p className="text-gray-400">
                          Crown Prince Plaza, Congo Town
                          <br />
                          Monrovia, Liberia
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <Phone className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Phone</p>
                        <p className="text-gray-400">+231 88 191 5322</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <Mail className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Email</p>
                        <p className="text-gray-400">
                          info@infiniterigservices.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <Clock className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Working Hours</p>
                        <p className="text-gray-400">
                          Monday - Friday: 8:00 AM - 6:00 PM
                          <br />
                          Saturday: 9:00 AM - 1:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-navy-900 mb-6">
                  Direct Departments
                </h3>
                <div className="space-y-3">
                  {departments.map((dept, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gold/10 hover:border-gold/20 border border-transparent transition-all group cursor-pointer"
                    >
                      <div>
                        <p className="font-bold text-navy-900 group-hover:text-primary transition-colors">{dept.name}</p>
                        <p className="text-sm text-gray-500">{dept.email}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Find Us</h2>
            <p className="text-xl text-gray-500">
              Located in the heart of Monrovia, easily accessible from all major
              areas
            </p>
          </motion.div>

          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-96 md:h-[500px] border border-gray-100">
            <iframe
              src="https://www.google.com/maps?q=6.266788,-10.722567&output=embed&z=18"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Infinite Rig Services Location - Crown Prince Plaza, Congo Town, Monrovia"
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>

            {/* Optional: Overlay with address info */}
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-8 md:bottom-8 md:w-80 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-900 mb-1">Crown Prince Plaza</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Congo Town, Monrovia
                  </p>
                  <a
                    href="https://maps.google.com/?q=6.266788,-10.722567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:text-orange-600 transition-colors font-bold"
                  >
                    Open in Google Maps
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-24 bg-gradient-to-r from-primary to-orange-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Have More Questions?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Check out our frequently asked questions or schedule a consultation
            with our team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              View FAQs
            </button>
            <button className="bg-navy-900 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-navy-800 hover:shadow-xl shadow-lg shadow-navy-900/20 transition-all duration-300 transform hover:-translate-y-1 border border-navy-800">
              Schedule Call
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Message Sent Successfully"
        message="Thank you for reaching out to Infinite Rig Services. Our team has received your message and will get back to you within 24 hours."
        actionLabel="Back to Home"
        onAction={() => window.location.href = "/"}
      />
    </div>
  );
}
