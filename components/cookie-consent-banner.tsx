"use client";

import React, { useState, useEffect } from "react";
import { X, Settings, Cookie } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  performance: boolean;
}

const COOKIE_CONSENT_KEY = "irs_cookie_consent";
const COOKIE_PREFERENCES_KEY = "irs_cookie_preferences";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    functional: false,
    performance: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");

    // Apply cookie preferences
    applyCookiePreferences(prefs);

    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
      performance: true,
    };
    savePreferences(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      functional: false,
      performance: false,
    };
    savePreferences(necessaryOnly);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Here you would integrate with your analytics and tracking tools
    // For example:

    // Google Analytics
    if (prefs.analytics && typeof window !== "undefined") {
      // Enable Google Analytics
      // window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
    }

    // Other tracking tools based on preferences
    console.log("Cookie preferences applied:", prefs);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-white border-t-4 border-[#FF6B35] shadow-2xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Content */}
              <div className="flex items-start gap-4 flex-1">
                <div className="hidden sm:block">
                  <Cookie className="w-10 h-10 text-[#FF6B35] flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    Infinite Rig Services uses cookies to enhance your browsing
                    experience, analyze site traffic, and personalize content.
                    By clicking "Accept All", you consent to our use of cookies.
                    You can customize your preferences or accept only necessary
                    cookies.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <a
                      href="/privacy-policy"
                      className="text-[#FF6B35] hover:underline font-semibold"
                    >
                      Privacy Policy
                    </a>
                    <span className="text-gray-400">|</span>
                    <a
                      href="/cookie-policy"
                      className="text-[#FF6B35] hover:underline font-semibold"
                    >
                      Cookie Policy
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#1A1A2E] font-semibold rounded-lg transition-colors duration-200"
                >
                  <Settings className="w-4 h-4" />
                  Customize
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-[#1A1A2E] font-semibold rounded-lg border-2 border-gray-300 transition-colors duration-200"
                >
                  Necessary Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#004E89] to-[#1A1A2E] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <Cookie className="w-6 h-6" />
                <h2 className="text-xl font-bold">Cookie Preferences</h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Customize your cookie preferences below. Necessary cookies are
                always enabled as they are essential for the website to function
                properly. You can enable or disable other cookie categories.
              </p>

              {/* Cookie Categories */}
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#1A1A2E]">
                      Necessary Cookies
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Always Enabled
                      </span>
                      <div className="relative w-12 h-6 bg-[#FF6B35] rounded-full">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    These cookies are essential for the website to function and
                    cannot be disabled. They include session management,
                    authentication, and security features.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#1A1A2E]">
                      Analytics Cookies
                    </h3>
                    <button
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          analytics: !prev.analytics,
                        }))
                      }
                      className="relative w-12 h-6 bg-gray-300 rounded-full transition-colors duration-200"
                      style={{
                        backgroundColor: preferences.analytics ? "#FF6B35" : "",
                      }}
                    >
                      <div
                        className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                        style={{
                          transform: preferences.analytics
                            ? "translateX(24px)"
                            : "translateX(4px)",
                        }}
                      ></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Help us understand how visitors interact with our website by
                    collecting and reporting information anonymously. This helps
                    us improve our services.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#1A1A2E]">
                      Functional Cookies
                    </h3>
                    <button
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          functional: !prev.functional,
                        }))
                      }
                      className="relative w-12 h-6 bg-gray-300 rounded-full transition-colors duration-200"
                      style={{
                        backgroundColor: preferences.functional
                          ? "#FF6B35"
                          : "",
                      }}
                    >
                      <div
                        className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                        style={{
                          transform: preferences.functional
                            ? "translateX(24px)"
                            : "translateX(4px)",
                        }}
                      ></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Enable enhanced functionality and personalization, such as
                    remembering your preferences, language settings, and AI
                    chatbot interactions.
                  </p>
                </div>

                {/* Performance Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#1A1A2E]">
                      Performance Cookies
                    </h3>
                    <button
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          performance: !prev.performance,
                        }))
                      }
                      className="relative w-12 h-6 bg-gray-300 rounded-full transition-colors duration-200"
                      style={{
                        backgroundColor: preferences.performance
                          ? "#FF6B35"
                          : "",
                      }}
                    >
                      <div
                        className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                        style={{
                          transform: preferences.performance
                            ? "translateX(24px)"
                            : "translateX(4px)",
                        }}
                      ></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Help us measure and improve website performance by
                    collecting information about page load times, errors, and
                    user interactions.
                  </p>
                </div>
              </div>

              {/* More Information */}
              <div className="bg-blue-50 border-l-4 border-[#004E89] p-4 rounded">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Learn more:</span> For
                  detailed information about the cookies we use and how we
                  protect your data, please read our{" "}
                  <a
                    href="/cookie-policy"
                    className="text-[#FF6B35] hover:underline font-semibold"
                  >
                    Cookie Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    className="text-[#FF6B35] hover:underline font-semibold"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 rounded-b-xl border-t">
              <button
                onClick={handleAcceptNecessary}
                className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-[#1A1A2E] font-semibold rounded-lg border-2 border-gray-300 transition-colors duration-200"
              >
                Necessary Only
              </button>
              <button
                onClick={handleSaveCustom}
                className="flex-1 px-6 py-3 bg-[#004E89] hover:bg-[#003A6B] text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Save Preferences
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// Export utility functions for managing cookies
export const CookieUtils = {
  // Get current cookie preferences
  getPreferences: (): CookiePreferences => {
    if (typeof window === "undefined") {
      return {
        necessary: true,
        analytics: false,
        functional: false,
        performance: false,
      };
    }
    const saved = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          necessary: true,
          analytics: false,
          functional: false,
          performance: false,
        };
  },

  // Check if user has consented
  hasConsented: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
  },

  // Reset cookie preferences (for testing or user request)
  resetPreferences: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    window.location.reload();
  },
};
