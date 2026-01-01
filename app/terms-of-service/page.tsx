import React from "react";
import { Metadata } from "next";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Terms of Service | Infinite Rig Services",
  description:
    "Terms of Service for Infinite Rig Services - Review our terms and conditions for using our website and services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#004E89] to-[#1A1A2E] text-white py-16 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
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
              Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Infinite Rig Services, Inc. ("IRSI," "Company," "we,"
              "us," or "our"). These Terms of Service ("Terms," "Terms of
              Service") govern your access to and use of our website{" "}
              <span className="font-semibold">infiniterigservices.com</span>{" "}
              (the "Website") and all related services, features, content, and
              applications offered by IRSI (collectively, the "Services").
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Please read these Terms carefully before using our Services. By
              accessing or using our Services, you agree to be bound by these
              Terms. If you disagree with any part of these Terms, you may not
              access or use our Services.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
              <p className="text-gray-700 font-semibold">
                IMPORTANT: These Terms contain provisions that limit our
                liability and require you to resolve disputes through binding
                arbitration. Please read Section 17 (Limitation of Liability)
                and Section 18 (Dispute Resolution) carefully.
              </p>
            </div>
          </section>

          {/* Company Information */}
          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-[#004E89] mb-4">
              Company Information
            </h2>
            <div className="text-gray-700 space-y-2">
              <p>
                <span className="font-semibold">Legal Name:</span> Infinite Rig
                Services, Inc.
              </p>
              <p>
                <span className="font-semibold">Business Address:</span> Crown
                Prince Plaza, Congo Town, Monrovia, Liberia
              </p>
              <p>
                <span className="font-semibold">Incorporation:</span> Republic
                of Liberia
              </p>
              <p>
                <span className="font-semibold">Domain:</span>{" "}
                infiniterigservices.com
              </p>
              <p>
                <span className="font-semibold">Services:</span> Offshore
                Service Operations, Supply Chain & Logistics, Manning & Crew
                Services
              </p>
              <p>
                <span className="font-semibold">Established:</span> 2025
              </p>
            </div>
          </section>

          {/* Definitions */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              1. Definitions
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">"User," "You," "Your"</span>{" "}
                refers to any individual or entity accessing or using our
                Services.
              </p>
              <p>
                <span className="font-semibold">"Account"</span> means a
                registered user account on our platform with specific role-based
                permissions.
              </p>
              <p>
                <span className="font-semibold">"Content"</span> includes text,
                images, videos, documents, data, and other materials available
                through our Services.
              </p>
              <p>
                <span className="font-semibold">"Client"</span> refers to
                businesses or organizations using our offshore services.
              </p>
              <p>
                <span className="font-semibold">"Applicant"</span> refers to
                individuals applying for employment positions through our
                platform.
              </p>
              <p>
                <span className="font-semibold">"User Content"</span> means any
                content you submit, upload, or transmit through our Services.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              2. Eligibility and Account Registration
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  2.1 Age Requirement
                </h3>
                <p className="text-gray-700">
                  You must be at least 18 years old to use our Services. By
                  using our Services, you represent and warrant that you are of
                  legal age to form a binding contract with IRSI.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  2.2 Account Creation
                </h3>
                <p className="text-gray-700 mb-3">
                  To access certain features, you must create an account. When
                  creating an account:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    You must provide accurate, complete, and current information
                  </li>
                  <li>You must maintain and update your account information</li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your password
                  </li>
                  <li>
                    You are responsible for all activities under your account
                  </li>
                  <li>
                    You must immediately notify us of any unauthorized access
                  </li>
                  <li>
                    You may not transfer or share your account with others
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  2.3 User Roles
                </h3>
                <p className="text-gray-700 mb-3">
                  Our platform supports multiple user roles with different
                  permissions:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <span className="font-semibold">Super Admin:</span> Full
                    system access and configuration
                  </li>
                  <li>
                    <span className="font-semibold">Management:</span>{" "}
                    Department oversight and approvals
                  </li>
                  <li>
                    <span className="font-semibold">Editor:</span> Content
                    creation and management
                  </li>
                  <li>
                    <span className="font-semibold">Support:</span> Customer
                    service and ticket management
                  </li>
                  <li>
                    <span className="font-semibold">Client:</span> Access to
                    project portal and documents
                  </li>
                  <li>
                    <span className="font-semibold">Applicant:</span> Job
                    application and profile management
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  2.4 Account Termination
                </h3>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate your account at
                  any time for violation of these Terms, suspicious activity, or
                  for any other reason at our sole discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Services */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              3. Use of Services
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  3.1 Permitted Use
                </h3>
                <p className="text-gray-700 mb-3">
                  You may use our Services for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Accessing information about our offshore services</li>
                  <li>
                    Submitting job applications for employment opportunities
                  </li>
                  <li>
                    Managing client projects and documents (for authorized
                    clients)
                  </li>
                  <li>
                    Communicating with our support team via chatbot or tickets
                  </li>
                  <li>Accessing your account and personal information</li>
                  <li>Any other lawful purpose consistent with these Terms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  3.2 Prohibited Activities
                </h3>
                <p className="text-gray-700 mb-3">You agree NOT to:</p>
                <div className="grid gap-3">
                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3">
                    <p className="text-gray-700">
                      <span className="font-semibold">
                        Security Violations:
                      </span>{" "}
                      Attempt to gain unauthorized access, circumvent security
                      measures, or interfere with the proper functioning of the
                      Services
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3">
                    <p className="text-gray-700">
                      <span className="font-semibold">Automated Access:</span>{" "}
                      Use robots, scrapers, or automated tools to access the
                      Services without permission
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3">
                    <p className="text-gray-700">
                      <span className="font-semibold">False Information:</span>{" "}
                      Provide false, misleading, or fraudulent information,
                      especially in job applications
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3">
                    <p className="text-gray-700">
                      <span className="font-semibold">Malicious Content:</span>{" "}
                      Upload viruses, malware, or any harmful code
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3">
                    <p className="text-gray-700">
                      <span className="font-semibold">Harassment:</span> Harass,
                      abuse, or harm other users or our staff
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3">
                    <p className="text-gray-700">
                      <span className="font-semibold">Illegal Activities:</span>{" "}
                      Use the Services for any illegal purpose or violate any
                      laws
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3">
                    <p className="text-gray-700">
                      <span className="font-semibold">
                        Intellectual Property:
                      </span>{" "}
                      Infringe on our or third parties' intellectual property
                      rights
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3">
                    <p className="text-gray-700">
                      <span className="font-semibold">
                        Reverse Engineering:
                      </span>{" "}
                      Reverse engineer, decompile, or disassemble any aspect of
                      the Services
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Applications */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              4. Job Applications and Recruitment
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  4.1 Application Process
                </h3>
                <p className="text-gray-700 mb-3">
                  When submitting a job application:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    All information provided must be accurate, complete, and
                    truthful
                  </li>
                  <li>
                    You authorize us to verify all information, credentials, and
                    references
                  </li>
                  <li>
                    You consent to background checks as outlined in our
                    recruitment policy
                  </li>
                  <li>
                    False information may result in application rejection or
                    employment termination
                  </li>
                  <li>
                    You retain ownership of your submitted documents (resume,
                    certificates)
                  </li>
                  <li>
                    We may retain your application for up to 2 years for future
                    opportunities
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  4.2 Maritime Certifications
                </h3>
                <p className="text-gray-700">
                  For maritime and offshore positions, you must possess valid
                  certifications as required by the Liberia Maritime Authority
                  (LiMA) and international standards (STCW, etc.). We reserve
                  the right to verify all certifications.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  4.3 No Employment Guarantee
                </h3>
                <p className="text-gray-700">
                  Submission of an application does not guarantee employment. We
                  reserve the right to reject any application at our sole
                  discretion. Employment decisions are based on qualifications,
                  experience, and business needs.
                </p>
              </div>
            </div>
          </section>

          {/* Client Services */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              5. Client Portal and Services
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  5.1 Service Agreements
                </h3>
                <p className="text-gray-700">
                  Use of our offshore services (Service, Supply, Manning) is
                  governed by separate written service agreements. These Terms
                  supplement but do not replace such agreements. In case of
                  conflict, the service agreement prevails.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  5.2 Client Portal Access
                </h3>
                <p className="text-gray-700 mb-3">
                  Authorized clients receive access to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Project dashboards and timelines</li>
                  <li>Secure document repository</li>
                  <li>Service request forms</li>
                  <li>Communication with account managers</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  Client portal access is granted per our service agreement and
                  may be revoked upon termination of services.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  5.3 Document Confidentiality
                </h3>
                <p className="text-gray-700">
                  Documents uploaded to the client portal remain confidential
                  and are protected by our security measures. You are
                  responsible for ensuring you have rights to upload any
                  documents.
                </p>
              </div>
            </div>
          </section>

          {/* AI Chatbot */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              6. AI Chatbot and Automated Services
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  6.1 Chatbot Functionality
                </h3>
                <p className="text-gray-700">
                  Our AI-powered chatbot provides automated assistance for
                  common inquiries. The chatbot uses OpenAI's GPT-4 technology
                  and Retrieval-Augmented Generation (RAG) to provide responses
                  based on company documentation.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  6.2 Limitations and Disclaimers
                </h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    Chatbot responses are automated and may not be 100% accurate
                  </li>
                  <li>
                    Do not rely solely on chatbot information for critical
                    decisions
                  </li>
                  <li>
                    The chatbot is not a substitute for professional advice
                  </li>
                  <li>
                    We are not liable for actions taken based on chatbot
                    responses
                  </li>
                  <li>
                    Conversations may be reviewed for quality and training
                    purposes
                  </li>
                  <li>You may request human support at any time</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  6.3 Data Usage
                </h3>
                <p className="text-gray-700">
                  Chatbot conversations are stored and may be used to improve
                  our services. Do not share sensitive personal information
                  through the chatbot. See our Privacy Policy for details.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              7. Intellectual Property Rights
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  7.1 Our Intellectual Property
                </h3>
                <p className="text-gray-700 mb-3">
                  All content, features, and functionality of the Services,
                  including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Text, graphics, logos, icons, images, videos</li>
                  <li>Software, code, and algorithms</li>
                  <li>Design, layout, and "look and feel"</li>
                  <li>Company name, trademarks, and service marks</li>
                  <li>Documentation and technical materials</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  are owned by IRSI or our licensors and are protected by
                  copyright, trademark, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  7.2 Limited License
                </h3>
                <p className="text-gray-700">
                  We grant you a limited, non-exclusive, non-transferable,
                  revocable license to access and use the Services for your
                  personal or internal business purposes, subject to these
                  Terms. This license does not permit you to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                  <li>Copy, modify, or create derivative works</li>
                  <li>
                    Distribute, sell, or sublicense any part of the Services
                  </li>
                  <li>Remove or alter any copyright or proprietary notices</li>
                  <li>Use our trademarks without written permission</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  7.3 User Content License
                </h3>
                <p className="text-gray-700">
                  By submitting User Content (resumes, documents, messages), you
                  grant us a worldwide, non-exclusive, royalty-free license to
                  use, store, display, and process such content as necessary to
                  provide the Services. You retain all ownership rights to your
                  User Content.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  7.4 Feedback
                </h3>
                <p className="text-gray-700">
                  Any feedback, suggestions, or ideas you provide about the
                  Services become our property, and we may use them without
                  restriction or compensation to you.
                </p>
              </div>
            </div>
          </section>

          {/* Third Party Services */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              8. Third-Party Services and Links
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  8.1 Third-Party Integrations
                </h3>
                <p className="text-gray-700 mb-3">
                  Our Services integrate with third-party providers:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Supabase (database and authentication)</li>
                  <li>OpenAI (AI chatbot functionality)</li>
                  <li>Resend (email services)</li>
                  <li>Vercel (hosting platform)</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  Your use of these integrated services is subject to their
                  respective terms and privacy policies.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  8.2 External Links
                </h3>
                <p className="text-gray-700">
                  Our Services may contain links to third-party websites. We do
                  not control, endorse, or assume responsibility for any
                  third-party sites or services. Access to third-party sites is
                  at your own risk.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              9. Privacy and Data Protection
            </h2>
            <p className="text-gray-700 mb-4">
              Our collection, use, and protection of your personal information
              is governed by our{" "}
              <a
                href="/privacy-policy"
                className="text-[#FF6B35] hover:underline font-semibold"
              >
                Privacy Policy
              </a>
              , which is incorporated into these Terms by reference. By using
              our Services, you consent to our data practices as described in
              the Privacy Policy.
            </p>
            <p className="text-gray-700">
              We implement industry-standard security measures including
              encryption, Row Level Security (RLS), and regular security audits.
              However, no system is 100% secure, and we cannot guarantee
              absolute security of your information.
            </p>
          </section>

          {/* Payment and Fees */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              10. Payment and Fees
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  10.1 Service Fees
                </h3>
                <p className="text-gray-700">
                  Fees for our offshore services (Service, Supply, Manning) are
                  specified in individual service agreements. Access to the
                  website and basic features is provided free of charge.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  10.2 Payment Terms
                </h3>
                <p className="text-gray-700">
                  Payment terms are specified in service agreements. Late
                  payments may result in suspension of services and may incur
                  late fees as permitted by law.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  10.3 Taxes
                </h3>
                <p className="text-gray-700">
                  All fees are exclusive of applicable taxes, which are your
                  responsibility unless otherwise stated.
                </p>
              </div>
            </div>
          </section>

          {/* Warranties */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              11. Disclaimers and Warranties
            </h2>

            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  11.1 "AS IS" Disclaimer
                </h3>
                <p className="text-gray-700 mb-3 uppercase font-semibold">
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                  WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p className="text-gray-700">
                  To the fullest extent permitted by law, we disclaim all
                  warranties, including but not limited to implied warranties of
                  merchantability, fitness for a particular purpose, title, and
                  non-infringement.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  11.2 No Guarantee of Availability
                </h3>
                <p className="text-gray-700">
                  We do not warrant that the Services will be uninterrupted,
                  error-free, secure, or free from viruses or other harmful
                  components. We may suspend, modify, or discontinue Services at
                  any time without notice.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  11.3 Third-Party Content
                </h3>
                <p className="text-gray-700">
                  We do not control or endorse User Content or third-party
                  content accessed through the Services. You are solely
                  responsible for evaluating the accuracy, completeness, and
                  usefulness of any content.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              12. Limitation of Liability
            </h2>

            <div className="bg-red-50 border-2 border-red-500 p-6 rounded-lg">
              <p className="text-gray-700 mb-4 uppercase font-bold">
                IMPORTANT - PLEASE READ CAREFULLY
              </p>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                SHALL INFINITE RIG SERVICES, INC., ITS OFFICERS, DIRECTORS,
                EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                  DAMAGES
                </li>
                <li>LOSS OF PROFITS, REVENUE, DATA, OR USE</li>
                <li>BUSINESS INTERRUPTION OR LOSS OF GOODWILL</li>
                <li>
                  DAMAGES ARISING FROM USE OR INABILITY TO USE THE SERVICES
                </li>
                <li>DAMAGES ARISING FROM UNAUTHORIZED ACCESS TO YOUR DATA</li>
                <li>DAMAGES ARISING FROM THIRD-PARTY CONDUCT OR CONTENT</li>
              </ul>
              <p className="text-gray-700 mt-4">
                WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING
                NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN
                ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-gray-700 mt-4 font-semibold">
                OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR
                RELATED TO THE SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID TO
                US, IF ANY, IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100 USD,
                WHICHEVER IS GREATER.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              13. Indemnification
            </h2>
            <p className="text-gray-700 mb-4">
              You agree to defend, indemnify, and hold harmless IRSI and its
              officers, directors, employees, agents, and affiliates from and
              against any claims, liabilities, damages, losses, costs, and
              expenses (including reasonable attorneys' fees) arising out of or
              related to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your use or misuse of the Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your User Content</li>
              <li>Any false or misleading information you provide</li>
              <li>Your violation of any laws or regulations</li>
            </ul>
          </section>

          {/* Term and Termination */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              14. Term and Termination
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  14.1 Term
                </h3>
                <p className="text-gray-700">
                  These Terms remain in effect while you use the Services. Your
                  right to access the Services is effective until terminated by
                  you or us.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  14.2 Termination by You
                </h3>
                <p className="text-gray-700">
                  You may terminate your account at any time by contacting us or
                  using the account closure feature. Termination does not affect
                  any obligations or liabilities incurred before termination.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  14.3 Termination by Us
                </h3>
                <p className="text-gray-700 mb-3">
                  We may suspend or terminate your access immediately, without
                  prior notice, for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent, abusive, or illegal activity</li>
                  <li>Extended period of inactivity</li>
                  <li>At our sole discretion for any reason</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  14.4 Effect of Termination
                </h3>
                <p className="text-gray-700">
                  Upon termination, your right to access the Services ceases
                  immediately. We may delete your account and data, subject to
                  applicable laws and our data retention policies. Sections that
                  by their nature should survive termination will survive.
                </p>
              </div>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              15. Dispute Resolution and Arbitration
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  15.1 Informal Resolution
                </h3>
                <p className="text-gray-700">
                  Before initiating formal proceedings, you agree to contact us
                  first to seek informal resolution. Send a detailed description
                  of the dispute to legal@infiniterigservices.com. We will
                  attempt to resolve the dispute within 60 days.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  15.2 Binding Arbitration
                </h3>
                <p className="text-gray-700 mb-3">
                  If informal resolution fails, disputes shall be resolved by
                  binding arbitration in accordance with the arbitration rules
                  of Liberia. The arbitration shall take place in Monrovia,
                  Liberia.
                </p>
                <p className="text-gray-700">
                  BY AGREEING TO THESE TERMS, YOU WAIVE YOUR RIGHT TO A TRIAL BY
                  JURY OR TO PARTICIPATE IN A CLASS ACTION.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  15.3 Exceptions
                </h3>
                <p className="text-gray-700">
                  Either party may seek equitable relief in court to protect
                  intellectual property rights or to enforce confidentiality
                  obligations.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              16. Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-700 mb-4">
              These Terms and any disputes arising from or related to them shall
              be governed by and construed in accordance with the laws of the
              Republic of Liberia, without regard to its conflict of law
              principles.
            </p>
            <p className="text-gray-700 mb-4">
              Subject to the arbitration provisions above, you agree to submit
              to the exclusive jurisdiction of the courts located in Monrovia,
              Liberia.
            </p>
            <p className="text-gray-700">
              We comply with all applicable Liberian laws and regulations,
              including those of the Liberia Maritime Authority (LiMA) for
              offshore services operations.
            </p>
          </section>

          {/* General Provisions */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              17. General Provisions
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  17.1 Changes to Terms
                </h3>
                <p className="text-gray-700">
                  We reserve the right to modify these Terms at any time. We
                  will notify you of material changes via email or prominent
                  notice on the Website. Continued use after changes constitutes
                  acceptance of the modified Terms.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  17.2 Entire Agreement
                </h3>
                <p className="text-gray-700">
                  These Terms, together with our Privacy Policy and any service
                  agreements, constitute the entire agreement between you and
                  IRSI regarding the Services.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  17.3 Severability
                </h3>
                <p className="text-gray-700">
                  If any provision of these Terms is found to be unenforceable,
                  the remaining provisions will remain in full force and effect.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  17.4 Waiver
                </h3>
                <p className="text-gray-700">
                  Our failure to enforce any right or provision of these Terms
                  does not constitute a waiver of that right or provision.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  17.5 Assignment
                </h3>
                <p className="text-gray-700">
                  You may not assign or transfer these Terms or your account
                  without our prior written consent. We may assign these Terms
                  without restriction.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  17.6 Force Majeure
                </h3>
                <p className="text-gray-700">
                  We shall not be liable for any failure or delay in performance
                  due to circumstances beyond our reasonable control, including
                  acts of God, war, terrorism, riots, natural disasters, or
                  government actions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                  17.7 Notices
                </h3>
                <p className="text-gray-700">
                  Notices to you may be sent to the email address associated
                  with your account. Notices to us should be sent to
                  legal@infiniterigservices.com.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-[#004E89] mb-6">
              18. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms of Service, please contact
              us:
            </p>

            <div className="bg-gradient-to-br from-[#004E89] to-[#1A1A2E] text-white rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4">
                Infinite Rig Services, Inc.
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Legal Department</span>
                </p>
                <p>Crown Prince Plaza, Congo Town</p>
                <p>Monrovia, Liberia</p>
                <p className="mt-4">
                  <span className="font-semibold">Legal Inquiries:</span>{" "}
                  legal@infiniterigservices.com
                </p>
                <p>
                  <span className="font-semibold">General:</span>{" "}
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

          {/* Acknowledgment */}
          <section className="bg-gray-50 rounded-lg p-6 border-2 border-[#FF6B35]">
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
              Acknowledgment and Acceptance
            </h3>
            <p className="text-gray-700 mb-4">
              BY ACCESSING OR USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE
              READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE,
              INCLUDING THE ARBITRATION AGREEMENT AND CLASS ACTION WAIVER.
            </p>
            <p className="text-gray-700">
              IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT ACCESS OR USE OUR
              SERVICES.
            </p>
          </section>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p className="mb-2">
              © 2025 Infinite Rig Services, Inc. All Rights Reserved.
            </p>
            <p className="mb-2">
              These Terms of Service are proprietary and confidential.
            </p>
            <p>Established 2025 | Monrovia, Liberia</p>
          </div>
        </div>
      </div>
    </div>
  );
}
