import Link from "next/link";
import { Home, Search, Briefcase, HelpCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] via-white to-[#F4F4F4] flex items-center justify-center px-4">
      <Header />
      <div className="max-w-4xl pt-32 mx-auto text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-[200px] md:text-[280px] font-bold leading-none">
            <span className="bg-gradient-to-br from-[#FF6B35] to-[#B8860B] bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-8">
          <div className="inline-block p-6 bg-white rounded-full shadow-lg">
            <HelpCircle className="w-16 h-16 text-[#FF6B35]" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          The page you're looking for seems to have drifted off course. Don't
          worry – let's navigate you back to familiar waters.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          <Link
            href="/"
            className="group bg-white hover:bg-[#FF6B35] border-2 border-gray-200 hover:border-[#FF6B35] rounded-xl p-6 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <Home className="w-8 h-8 text-[#FF6B35] group-hover:text-white mx-auto mb-3 transition-colors" />
            <h3 className="font-semibold text-[#1A1A2E] group-hover:text-white mb-2 transition-colors">
              Go Home
            </h3>
            <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
              Return to homepage
            </p>
          </Link>

          <Link
            href="/careers"
            className="group bg-white hover:bg-[#FF6B35] border-2 border-gray-200 hover:border-[#FF6B35] rounded-xl p-6 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <Briefcase className="w-8 h-8 text-[#FF6B35] group-hover:text-white mx-auto mb-3 transition-colors" />
            <h3 className="font-semibold text-[#1A1A2E] group-hover:text-white mb-2 transition-colors">
              View Careers
            </h3>
            <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
              Explore opportunities
            </p>
          </Link>

          <Link
            href="/contact"
            className="group bg-white hover:bg-[#FF6B35] border-2 border-gray-200 hover:border-[#FF6B35] rounded-xl p-6 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <Search className="w-8 h-8 text-[#FF6B35] group-hover:text-white mx-auto mb-3 transition-colors" />
            <h3 className="font-semibold text-[#1A1A2E] group-hover:text-white mb-2 transition-colors">
              Contact Us
            </h3>
            <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
              Get in touch
            </p>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-[#1A1A2E] mb-4">
            Need Assistance?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help you navigate. Reach out if you need support
            finding what you're looking for.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#FF6B35] hover:bg-[#ff5722] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300"
          >
            Contact Support
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#FF6B35]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#004E89]/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
