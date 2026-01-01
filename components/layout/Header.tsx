"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Download } from "lucide-react";
import { useState } from "react";
import { triggerPWAInstall } from "@/lib/pwa-utils";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Tracking", path: "/tracking" },
    { name: "About", path: "/about" },
    { name: "Team", path: "/team" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Infinite Rig Services"
              width={200}
              height={70}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 text-md font-medium rounded-lg transition-all relative ${isActive(item.path)
                  ? "text-primary bg-primary/10"
                  : "text-gray-700 hover:text-primary hover:bg-primary/5"
                  }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="text-md font-medium text-gray-700 hover:text-primary transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/quote"
              className="bg-gradient-to-r from-primary to-orange-600 text-white px-6 py-2.5 rounded-lg text-md font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive(item.path)
                  ? "text-primary bg-primary/10"
                  : "text-gray-700 hover:text-primary hover:bg-primary/5"
                  }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Menu Actions */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/5 transition-all"
              >
                Login
              </Link>
              <Link
                href="/quote"
                onClick={closeMobileMenu}
                className="block bg-gradient-to-r from-primary to-orange-600 text-white px-6 py-3 rounded-lg text-md font-semibold hover:shadow-lg transition-all duration-300 text-center"
              >
                Get a Quote
              </Link>
              <button
                onClick={() => {
                  closeMobileMenu();
                  triggerPWAInstall();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-all"
              >
                <Download className="w-4 h-4" />
                Install App
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
