"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Award, Download } from "lucide-react";
import { triggerPWAInstall } from "@/lib/pwa-utils";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-800 to-navy opacity-50"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Infinite Rig Services"
                width={200}
                height={70}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Liberia's premier provider of offshore support, supply chain
              solutions, and manning services for the oil and gas industry.
            </p>
            <div className="text-sm text-gray-400">
              <p className="font-semibold text-white mb-1">
                Crown Prince Plaza
              </p>
              <p>Congo Town, Monrovia</p>
              <p>Liberia, West Africa</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Offshore Operations", href: "/services/offshore" },
                { name: "Supply Chain", href: "/services/supply" },
                { name: "Track Shipment", href: "/tracking" },
                { name: "Manning Solutions", href: "/services/manning" },
                { name: "HSE Consulting", href: "/services/hse" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-primary transition-colors flex items-center group"
                  >
                    <ChevronRight className="h-3 w-3 mr-1 group-hover:translate-x-1 transition-transform" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "Careers", "Team", "News & Updates", "Contact"].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item === "News & Updates" ? "/news" : `/${item.toLowerCase().split(" ")[0]}`}
                    className="text-gray-400 hover:text-primary transition-colors flex items-center group"
                  >
                    <ChevronRight className="h-3 w-3 mr-1 group-hover:translate-x-1 transition-transform" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@infiniterigservices.com</li>
              <li>Phone: +231 88 191 5322</li>
              <li className="pt-2">
                <Link
                  href="/privacy-policy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Infinite Rig Services, Inc. All Rights Reserved.</p>

          <div className="my-4 md:my-0">
            <button
              onClick={triggerPWAInstall}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all flex items-center gap-2 group text-white font-medium shadow-sm hover:shadow-md hover:scale-105"
            >
              <Download className="h-4 w-4 text-primary group-hover:animate-bounce" />
              Install App
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Award className="h-4 w-4 text-gold" />
              <span>ISO 9001 Certified</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
