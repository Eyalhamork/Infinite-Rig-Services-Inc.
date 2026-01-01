import React from "react";
import { Metadata } from "next";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Privacy Policy | Infinite Rig Services",
  description:
    "Privacy policy for Infinite Rig Services - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#004E89] to-[#1A1A2E] text-white py-16 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-200">Last Updated: November 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Infinite Rig Services, Inc. ("IRSI," "we," "us," or "our") is
              committed to protecting your privacy and ensuring the security of
              your personal information. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              visit our website{" "}
              <span className="font-semibold">infiniterigservices.com</span> and
              use our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our website and services, you acknowledge
              that you have read, understood, and agree to be bound by this
              Privacy Policy. If you do not agree with the terms of this Privacy
              Policy, please do not access or use our services.
            </p>
          </section>

          {/* Company Information */}
          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-[#004E89] mb-4">
              Company Information
            </h2>
            <div className="text-gray-700 space-y-2">
              <p>
                <span className="font-semibold">Company Name:</span> Infinite
                Rig Services, Inc.
              </p>
              <p>
                <span className="font-semibold">Address:</span> Crown Prince
                Plaza, Congo Town, Monrovia, Liberia
              </p>
              <p>
                <span className="font-semibold">Domain:</span>{" "}
                infiniterigservices.com
              </p>
              <p>
                <span className="font-semibold">Established:</span> 2025
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              1. Information We Collect
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  1.1 Personal Information You Provide
                </h3>
                <p className="text-gray-700 mb-3">
                  We collect information that you voluntarily provide to us when
                  you:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <span className="font-semibold">
                      Register for an account:
                    </span>{" "}
                    Name, email address, phone number, password, company name
                    (for clients), department
                  </li>
                  <li>
                    <span className="font-semibold">
                      Submit a job application:
                    </span>{" "}
                    Full name, contact information, resume, educational
                    certificates, work history, professional certifications,
                    identification documents
                  </li>
                  <li>
                    <span className="font-semibold">Use our AI chatbot:</span>{" "}
                    Questions, inquiries, conversation history
                  </li>
                  <li>
                    <span className="font-semibold">Contact us:</span> Name,
                    email, phone number, message content
                  </li>
                  <li>
                    <span className="font-semibold">Access client portal:</span>{" "}
                    Project information, uploaded documents, service requests
                  </li>
                  <li>
                    <span className="font-semibold">
                      Submit support tickets:
                    </span>{" "}
                    Issue descriptions, attachments, communication logs
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  1.2 Automatically Collected Information
                </h3>
                <p className="text-gray-700 mb-3">
                  When you visit our website, we automatically collect certain
                  information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <span className="font-semibold">Device Information:</span>{" "}
                    IP address, browser type and version, operating system,
                    device identifiers
                  </li>
                  <li>
                    <span className="font-semibold">Usage Data:</span> Pages
                    visited, time spent on pages, links clicked, navigation
                    paths
                  </li>
                  <li>
                    <span className="font-semibold">Location Data:</span>{" "}
                    Approximate geographic location based on IP address
                  </li>
                  <li>
                    <span className="font-semibold">Cookies and Tracking:</span>{" "}
                    Cookie identifiers, pixel tags, session data
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  1.3 Professional and Employment Information
                </h3>
                <p className="text-gray-700 mb-3">
                  For maritime personnel and job applicants:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>STCW certifications and maritime qualifications</li>
                  <li>Medical fitness certificates</li>
                  <li>Seafarer identification documents</li>
                  <li>Training records and competency assessments</li>
                  <li>Employment history in maritime and offshore sectors</li>
                  <li>Background check results (with consent)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use the collected information for the following purposes:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-[#FF6B35] pl-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  Service Delivery
                </h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>
                    Process and manage job applications through our Applicant
                    Tracking System (ATS)
                  </li>
                  <li>
                    Provide access to client portals and project management
                    tools
                  </li>
                  <li>
                    Facilitate communication between clients and account
                    managers
                  </li>
                  <li>Deliver AI chatbot support and customer service</li>
                </ul>
              </div>

              <div className="border-l-4 border-[#FF6B35] pl-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  Account Management
                </h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>
                    Create and manage user accounts with role-based access
                    control
                  </li>
                  <li>Authenticate users and maintain session security</li>
                  <li>
                    Enable two-factor authentication (2FA) for management roles
                  </li>
                  <li>Process password resets and account recovery</li>
                </ul>
              </div>

              <div className="border-l-4 border-[#FF6B35] pl-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  Communication
                </h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Send application status updates and notifications</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send service-related announcements and updates</li>
                  <li>Deliver project updates to clients</li>
                </ul>
              </div>

              <div className="border-l-4 border-[#FF6B35] pl-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  Compliance and Safety
                </h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>
                    Comply with Liberia Maritime Authority (LiMA) regulations
                  </li>
                  <li>Maintain ISO 9001 quality management standards</li>
                  <li>Verify employment eligibility and certifications</li>
                  <li>Conduct background checks (with consent)</li>
                  <li>
                    Ensure HSSE (Health, Safety, Security, Environment)
                    compliance
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-[#FF6B35] pl-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  Analytics and Improvement
                </h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Analyze website usage and user behavior</li>
                  <li>Improve website functionality and user experience</li>
                  <li>Monitor and improve AI chatbot performance</li>
                  <li>Generate operational and analytics reports</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Storage and Security */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              3. Data Storage and Security
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  3.1 Data Storage
                </h3>
                <p className="text-gray-700 mb-3">
                  Your information is stored using the following systems:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <span className="font-semibold">Database:</span> Supabase
                    PostgreSQL with encryption at rest and in transit
                  </li>
                  <li>
                    <span className="font-semibold">File Storage:</span>{" "}
                    Supabase Storage for documents, resumes, and certificates
                  </li>
                  <li>
                    <span className="font-semibold">Hosting:</span> Vercel edge
                    network with global distribution
                  </li>
                  <li>
                    <span className="font-semibold">Backup:</span> Automated
                    daily backups with 30-day retention
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  3.2 Security Measures
                </h3>
                <p className="text-gray-700 mb-3">
                  We implement industry-standard security measures:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <span className="font-semibold">Encryption:</span> HTTPS/TLS
                    encryption for all data transmission
                  </li>
                  <li>
                    <span className="font-semibold">Authentication:</span>{" "}
                    JWT-based authentication with secure token management
                  </li>
                  <li>
                    <span className="font-semibold">Access Control:</span> Row
                    Level Security (RLS) policies on all database tables
                  </li>
                  <li>
                    <span className="font-semibold">Password Security:</span>{" "}
                    Bcrypt hashing with minimum 8-character requirements
                  </li>
                  <li>
                    <span className="font-semibold">API Protection:</span> Rate
                    limiting to prevent abuse and attacks
                  </li>
                  <li>
                    <span className="font-semibold">Monitoring:</span> Regular
                    security audits and vulnerability scanning
                  </li>
                  <li>
                    <span className="font-semibold">Input Validation:</span> XSS
                    and SQL injection prevention
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Important:</span> While we use
                  industry-standard security measures, no method of transmission
                  over the internet or electronic storage is 100% secure. We
                  cannot guarantee absolute security of your information.
                </p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 mb-4">
              We may share your information in the following circumstances:
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  4.1 Service Providers
                </h4>
                <p className="text-gray-700">
                  We share data with third-party service providers who assist in
                  our operations:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                  <li>Supabase (database and authentication services)</li>
                  <li>OpenAI (AI chatbot functionality)</li>
                  <li>Resend (transactional email services)</li>
                  <li>Vercel (web hosting and deployment)</li>
                </ul>
                <p className="text-gray-700 mt-2 text-sm italic">
                  All service providers are bound by confidentiality agreements
                  and process data only for specified purposes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  4.2 Legal Requirements
                </h4>
                <p className="text-gray-700">
                  We may disclose your information when required by law or to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                  <li>Comply with legal obligations and court orders</li>
                  <li>Cooperate with the Liberia Maritime Authority (LiMA)</li>
                  <li>Protect our rights, property, or safety</li>
                  <li>Prevent fraud or security threats</li>
                  <li>Respond to government requests</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  4.3 Business Transfers
                </h4>
                <p className="text-gray-700">
                  If IRSI is involved in a merger, acquisition, or sale of
                  assets, your information may be transferred as part of that
                  transaction. We will notify you via email and/or prominent
                  notice on our website of any change in ownership.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  4.4 With Your Consent
                </h4>
                <p className="text-gray-700">
                  We may share your information for any other purpose with your
                  explicit consent.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to enhance your
              experience. See our{" "}
              <a
                href="/cookie-policy"
                className="text-[#FF6B35] hover:underline font-semibold"
              >
                Cookie Policy
              </a>{" "}
              for detailed information.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  Types of Cookies We Use:
                </h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <span className="font-semibold">Essential Cookies:</span>{" "}
                    Required for website functionality and security
                  </li>
                  <li>
                    <span className="font-semibold">Analytics Cookies:</span>{" "}
                    Help us understand how visitors use our website
                  </li>
                  <li>
                    <span className="font-semibold">Functional Cookies:</span>{" "}
                    Remember your preferences and settings
                  </li>
                  <li>
                    <span className="font-semibold">Performance Cookies:</span>{" "}
                    Improve website speed and performance
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-[#004E89] p-4">
                <p className="text-gray-700">
                  You can control cookies through your browser settings.
                  However, disabling certain cookies may affect website
                  functionality. Visit our Cookie Preferences center to manage
                  your choices.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              6. Your Privacy Rights
            </h2>
            <p className="text-gray-700 mb-4">
              You have the following rights regarding your personal information:
            </p>

            <div className="grid gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  ✓ Right to Access
                </h4>
                <p className="text-gray-700">
                  Request a copy of the personal information we hold about you.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  ✓ Right to Rectification
                </h4>
                <p className="text-gray-700">
                  Request correction of inaccurate or incomplete information.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  ✓ Right to Erasure
                </h4>
                <p className="text-gray-700">
                  Request deletion of your personal information (subject to
                  legal requirements).
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  ✓ Right to Object
                </h4>
                <p className="text-gray-700">
                  Object to processing of your personal information for specific
                  purposes.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  ✓ Right to Data Portability
                </h4>
                <p className="text-gray-700">
                  Receive your personal information in a structured, commonly
                  used format.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#1A1A2E] mb-2">
                  ✓ Right to Withdraw Consent
                </h4>
                <p className="text-gray-700">
                  Withdraw consent for data processing at any time.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-[#FF6B35] bg-opacity-10 border border-[#FF6B35] rounded-lg p-4">
              <p className="text-gray-700">
                <span className="font-semibold">To exercise your rights:</span>{" "}
                Contact our Data Protection Officer at
                privacy@infiniterigservices.com or write to us at Crown Prince
                Plaza, Congo Town, Monrovia, Liberia.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              7. Data Retention
            </h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Fulfill the purposes described in this Privacy Policy</li>
              <li>Comply with legal, regulatory, or contractual obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>

            <div className="bg-gray-100 rounded-lg p-6">
              <h4 className="font-semibold text-[#1A1A2E] mb-3">
                Retention Periods:
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • <span className="font-semibold">Job Applications:</span> 2
                  years from submission date
                </li>
                <li>
                  • <span className="font-semibold">Client Account Data:</span>{" "}
                  Duration of business relationship + 7 years
                </li>
                <li>
                  • <span className="font-semibold">Chat Conversations:</span> 1
                  year from last interaction
                </li>
                <li>
                  • <span className="font-semibold">Support Tickets:</span> 3
                  years from resolution
                </li>
                <li>
                  • <span className="font-semibold">Website Analytics:</span> 26
                  months
                </li>
                <li>
                  •{" "}
                  <span className="font-semibold">
                    Maritime Personnel Records:
                  </span>{" "}
                  As required by LiMA regulations
                </li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700">
              Our services are not directed to individuals under the age of 18.
              We do not knowingly collect personal information from children. If
              you are a parent or guardian and believe your child has provided
              us with personal information, please contact us immediately. We
              will take steps to remove such information from our systems.
            </p>
          </section>

          {/* International Transfers */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              9. International Data Transfers
            </h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries
              other than Liberia, including the United States and European
              Union, where our service providers operate. These countries may
              have data protection laws that differ from Liberian law.
            </p>
            <p className="text-gray-700">
              When we transfer your information internationally, we ensure
              appropriate safeguards are in place, including standard
              contractual clauses and adherence to international data protection
              frameworks.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, technology, legal requirements, or other
              factors. When we make changes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                We will update the "Last Updated" date at the top of this policy
              </li>
              <li>We will notify you via email for material changes</li>
              <li>We will post a notice on our homepage for 30 days</li>
              <li>
                Continued use of our services after changes constitutes
                acceptance
              </li>
            </ul>
            <p className="text-gray-700">
              We encourage you to review this Privacy Policy periodically to
              stay informed about how we protect your information.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              11. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>

            <div className="bg-gradient-to-br from-[#004E89] to-[#1A1A2E] text-white rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4">
                Infinite Rig Services, Inc.
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Data Protection Officer</span>
                </p>
                <p>Crown Prince Plaza, Congo Town</p>
                <p>Monrovia, Liberia</p>
                <p className="mt-4">
                  <span className="font-semibold">Email:</span>{" "}
                  privacy@infiniterigservices.com
                </p>
                <p>
                  <span className="font-semibold">General Inquiries:</span>{" "}
                  info@infiniterigservices.com
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

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              12. Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-700 mb-4">
              This Privacy Policy is governed by and construed in accordance
              with the laws of the Republic of Liberia. Any disputes arising
              from this Privacy Policy or our data practices shall be subject to
              the exclusive jurisdiction of the courts of Liberia.
            </p>
            <p className="text-gray-700">
              We comply with all applicable Liberian data protection regulations
              and the requirements of the Liberia Maritime Authority (LiMA).
            </p>
          </section>

          {/* Acknowledgment */}
          <section className="bg-gray-50 rounded-lg p-6 border-2 border-[#FF6B35]">
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
              Acknowledgment
            </h3>
            <p className="text-gray-700">
              By using infiniterigservices.com and our services, you acknowledge
              that you have read and understood this Privacy Policy and agree to
              its terms. If you do not agree with this Privacy Policy, please do
              not use our website or services.
            </p>
          </section>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p className="mb-2">
              © 2025 Infinite Rig Services, Inc. All Rights Reserved.
            </p>
            <p>This Privacy Policy is proprietary and confidential.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
