import React from "react";
import { Metadata } from "next";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Cookie Policy | Infinite Rig Services",
  description:
    "Learn about how Infinite Rig Services uses cookies and similar tracking technologies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#004E89] to-[#1A1A2E] text-white py-16 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-200">Last Updated: November 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-4">
              What Are Cookies?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device
              (computer, tablet, or mobile phone) when you visit a website. They
              are widely used to make websites work more efficiently and provide
              a better user experience. Cookies allow websites to recognize your
              device and store some information about your preferences or past
              actions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This Cookie Policy explains how Infinite Rig Services, Inc.
              ("IRSI," "we," "us," or "our") uses cookies and similar tracking
              technologies on our website{" "}
              <span className="font-semibold">infiniterigservices.com</span>{" "}
              ("Website").
            </p>
          </section>

          {/* Types of Cookies */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              1. Types of Cookies We Use
            </h2>

            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="border-l-4 border-[#FF6B35] pl-6 bg-gray-50 p-6 rounded-r-lg">
                <h3 className="text-2xl font-bold text-[#1A1A2E] mb-3">
                  1.1 Necessary Cookies
                </h3>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Status:</span> Always Active
                  (Cannot be Disabled)
                </p>
                <p className="text-gray-700 mb-4">
                  These cookies are essential for the Website to function
                  properly. They enable core functionality such as security,
                  network management, and accessibility. Without these cookies,
                  services you have requested cannot be provided.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-[#1A1A2E] mb-3">
                    Examples:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#FF6B35] mr-2">•</span>
                      <div>
                        <span className="font-semibold">
                          Authentication Cookies:
                        </span>{" "}
                        Remember your login status and keep you signed in across
                        pages
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF6B35] mr-2">•</span>
                      <div>
                        <span className="font-semibold">Security Cookies:</span>{" "}
                        Detect authentication abuses, protect user data, and
                        prevent fraudulent use
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF6B35] mr-2">•</span>
                      <div>
                        <span className="font-semibold">Session Cookies:</span>{" "}
                        Store information during your browsing session, such as
                        items in shopping carts or form data
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF6B35] mr-2">•</span>
                      <div>
                        <span className="font-semibold">Load Balancing:</span>{" "}
                        Distribute website traffic across servers to ensure
                        optimal performance
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border-l-4 border-[#004E89] pl-6 bg-gray-50 p-6 rounded-r-lg">
                <h3 className="text-2xl font-bold text-[#1A1A2E] mb-3">
                  1.2 Analytics Cookies
                </h3>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Status:</span> Optional
                  (Requires Your Consent)
                </p>
                <p className="text-gray-700 mb-4">
                  These cookies help us understand how visitors interact with
                  our Website by collecting and reporting information
                  anonymously. This data helps us improve our Website's
                  performance and user experience.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-[#1A1A2E] mb-3">
                    What We Track:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#004E89] mr-2">•</span>
                      <div>Pages visited and time spent on each page</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#004E89] mr-2">•</span>
                      <div>Traffic sources (how you found our Website)</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#004E89] mr-2">•</span>
                      <div>Click patterns and navigation paths</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#004E89] mr-2">•</span>
                      <div>Device type, browser, and operating system</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#004E89] mr-2">•</span>
                      <div>Geographic location (country/city level only)</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#004E89] mr-2">•</span>
                      <div>Bounce rate and exit pages</div>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-4 italic">
                    Note: Analytics data is aggregated and anonymized. We cannot
                    identify individual users from this data.
                  </p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border-l-4 border-[#B8860B] pl-6 bg-gray-50 p-6 rounded-r-lg">
                <h3 className="text-2xl font-bold text-[#1A1A2E] mb-3">
                  1.3 Functional Cookies
                </h3>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Status:</span> Optional
                  (Requires Your Consent)
                </p>
                <p className="text-gray-700 mb-4">
                  These cookies enable enhanced functionality and
                  personalization. They remember your choices and preferences to
                  provide a more personalized experience.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-[#1A1A2E] mb-3">
                    Features Enabled:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#B8860B] mr-2">•</span>
                      <div>
                        <span className="font-semibold">
                          Language Preferences:
                        </span>{" "}
                        Remember your preferred language settings
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#B8860B] mr-2">•</span>
                      <div>
                        <span className="font-semibold">Chatbot Context:</span>{" "}
                        Remember your AI chatbot conversations for continuity
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#B8860B] mr-2">•</span>
                      <div>
                        <span className="font-semibold">Form Auto-fill:</span>{" "}
                        Remember information you've previously entered in forms
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#B8860B] mr-2">•</span>
                      <div>
                        <span className="font-semibold">User Preferences:</span>{" "}
                        Save your display preferences, theme choices, and other
                        settings
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#B8860B] mr-2">•</span>
                      <div>
                        <span className="font-semibold">Video Settings:</span>{" "}
                        Remember volume and quality preferences for embedded
                        videos
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="border-l-4 border-[#1A1A2E] pl-6 bg-gray-50 p-6 rounded-r-lg">
                <h3 className="text-2xl font-bold text-[#1A1A2E] mb-3">
                  1.4 Performance Cookies
                </h3>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Status:</span> Optional
                  (Requires Your Consent)
                </p>
                <p className="text-gray-700 mb-4">
                  These cookies collect information about how the Website
                  performs and help us identify and fix technical issues. They
                  help us provide a faster, more reliable experience.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-[#1A1A2E] mb-3">
                    Performance Metrics:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#1A1A2E] mr-2">•</span>
                      <div>Page load times and server response times</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#1A1A2E] mr-2">•</span>
                      <div>Error messages and broken links</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#1A1A2E] mr-2">•</span>
                      <div>Browser compatibility issues</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#1A1A2E] mr-2">•</span>
                      <div>Resource loading efficiency</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#1A1A2E] mr-2">•</span>
                      <div>User interaction responsiveness</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* First-Party vs Third-Party */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              2. First-Party vs. Third-Party Cookies
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
                  First-Party Cookies
                </h3>
                <p className="text-gray-700 mb-4">
                  Set directly by our Website (infiniterigservices.com). These
                  cookies are under our control and used to improve your
                  experience on our Website.
                </p>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Examples:</span>{" "}
                    Authentication, session management, user preferences, and
                    analytics
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
                  Third-Party Cookies
                </h3>
                <p className="text-gray-700 mb-4">
                  Set by external services integrated into our Website. These
                  help provide specific functionality like analytics, chatbot,
                  and content delivery.
                </p>
                <div className="bg-orange-50 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Providers:</span> Supabase,
                    OpenAI, Vercel, analytics tools
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Duration */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              3. Cookie Duration
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
                  Session Cookies
                </h3>
                <p className="text-gray-700">
                  Temporary cookies that are deleted when you close your
                  browser. Used for essential functions like maintaining your
                  login session and shopping cart.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
                  Persistent Cookies
                </h3>
                <p className="text-gray-700 mb-3">
                  Remain on your device for a set period or until you delete
                  them. Used to remember your preferences and settings across
                  visits.
                </p>
                <div className="bg-white border border-gray-200 rounded p-4 mt-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      Our persistent cookies typically expire after:
                    </span>
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
                    <li>Authentication: 30 days</li>
                    <li>Preferences: 1 year</li>
                    <li>Analytics: 2 years</li>
                    <li>Cookie Consent: 1 year</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Specific Cookies Table */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              4. Detailed Cookie Information
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#004E89] text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Cookie Name
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Category
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Purpose
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                      sb-auth-token
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Necessary
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Authentication and session management
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      30 days
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                      irs_cookie_consent
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Necessary
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Store cookie consent preferences
                    </td>
                    <td className="border border-gray-300 px-4 py-3">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                      irs_cookie_preferences
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Necessary
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Store detailed cookie category preferences
                    </td>
                    <td className="border border-gray-300 px-4 py-3">1 year</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                      _ga
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Analytics
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Google Analytics - distinguish users
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      2 years
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                      _gid
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Analytics
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Google Analytics - distinguish users
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      24 hours
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                      chatbot_session
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Functional
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      AI chatbot conversation context
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Session
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                      user_preferences
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Functional
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Store user display and language preferences
                    </td>
                    <td className="border border-gray-300 px-4 py-3">1 year</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                      performance_metrics
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Performance
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Collect page performance data
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      30 days
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>


          {/* Third-Party Links */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              6. Third-Party Cookie Policies
            </h2>
            <p className="text-gray-700 mb-4">
              Our Website uses services from third-party providers who may set
              their own cookies. We recommend reviewing their cookie policies:
            </p>
            <div className="grid gap-4">
              <div className="border-l-4 border-[#FF6B35] pl-4 py-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Supabase:</span>{" "}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6B35] hover:underline"
                  >
                    supabase.com/privacy
                  </a>
                </p>
              </div>
              <div className="border-l-4 border-[#FF6B35] pl-4 py-2">
                <p className="text-gray-700">
                  <span className="font-semibold">OpenAI:</span>{" "}
                  <a
                    href="https://openai.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6B35] hover:underline"
                  >
                    openai.com/privacy
                  </a>
                </p>
              </div>
              <div className="border-l-4 border-[#FF6B35] pl-4 py-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Vercel:</span>{" "}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6B35] hover:underline"
                  >
                    vercel.com/legal/privacy-policy
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              7. Changes to This Cookie Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices, technology, legal requirements, or other
              factors. When we make changes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                We will update the "Last Updated" date at the top of this policy
              </li>
              <li>We will notify you via email for material changes</li>
              <li>We will post a notice on our Website homepage</li>
              <li>
                Continued use of our Website after changes constitutes
                acceptance
              </li>
            </ul>
            <p className="text-gray-700">
              We encourage you to review this Cookie Policy periodically to stay
              informed about our use of cookies.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              8. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Cookie Policy or our use of
              cookies, please contact us:
            </p>

            <div className="bg-gradient-to-br from-[#004E89] to-[#1A1A2E] text-white rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4">
                Infinite Rig Services, Inc.
              </h4>
              <div className="space-y-2">
                <p>Crown Prince Plaza, Congo Town</p>
                <p>Monrovia, Liberia</p>
                <p className="mt-4">
                  <span className="font-semibold">Email:</span>{" "}
                  privacy@infiniterigservices.com
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> +231 777 560 411
                </p>
                <p>
                  <span className="font-semibold">Website:</span>{" "}
                  infiniterigservices.com
                </p>
              </div>
            </div>
          </section>

          {/* Additional Resources */}
          <section className="bg-blue-50 rounded-lg p-6 mb-10">
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-4">
              Additional Resources
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                📄{" "}
                <a
                  href="/privacy-policy"
                  className="text-[#FF6B35] hover:underline font-semibold"
                >
                  Privacy Policy
                </a>{" "}
                - Learn how we collect and use your personal information
              </p>
              <p className="text-gray-700">
                📄{" "}
                <a
                  href="/terms-of-service"
                  className="text-[#FF6B35] hover:underline font-semibold"
                >
                  Terms of Service
                </a>{" "}
                - Review our terms and conditions
              </p>
            </div>
          </section>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p className="mb-2">
              © 2025 Infinite Rig Services, Inc. All Rights Reserved.
            </p>
            <p>This Cookie Policy is proprietary and confidential.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
