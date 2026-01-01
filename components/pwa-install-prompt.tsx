'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, Download } from 'lucide-react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const checkDismissal = useCallback(() => {
    return localStorage.getItem('pwa-prompt-dismissed') === 'true';
  }, []);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Custom event to trigger prompt from other components
    const triggerHandler = () => {
      // Always show prompt when manually triggered, even if no system prompt is available
      // This allows us to show manual instructions
      setShowPrompt(true);
    };
    window.addEventListener('trigger-pwa-install', triggerHandler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('trigger-pwa-install', triggerHandler);
    };
  }, []);

  useEffect(() => {
    if (deferredPrompt && !showPrompt && !checkDismissal()) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 45000);

      return () => clearTimeout(timer);
    }
  }, [deferredPrompt, showPrompt, checkDismissal]);

  const [showInstructions, setShowInstructions] = useState(false);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);

    // If accepted, we can stop showing the prompt entirely
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show automatically again
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-5 backdrop-blur-sm bg-white/95">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-14 h-14 flex-shrink-0">
              <div className="absolute inset-0 bg-primary/10 rounded-xl blur-lg animate-pulse" />
              <div className="relative bg-white rounded-xl border border-gray-100 p-2 shadow-sm overflow-hidden flex items-center justify-center">
                <Image
                  src="/icon-192x192.png"
                  alt="IRS App Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {isStandalone ? "App Installed" : "Install IRS App"}
              </h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {isStandalone
                  ? "Infinite Rig Services is installed on this device."
                  : deferredPrompt
                    ? "Add to home screen for faster access."
                    : isIOS
                      ? "Install on your iPhone/iPad:"
                      : "To install this app:"}
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Content based on State */}
        {isStandalone ? (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
            You are already using the installed version.
          </div>
        ) : (
          <>
            {/* Show buttons unless we are in "instruction mode" which we can track with state, 
              OR just show instructions IF prompt is missing? 
              Let's accept the user's request for a button. 
          */}

            {showInstructions ? (
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 animate-in fade-in zoom-in duration-300">
                {isIOS ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span>Tap the <span className="font-bold">Share</span> button below</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span>Select <span className="font-bold">Add to Home Screen</span></span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span>Open your browser menu (⋮)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span>Select <span className="font-bold">Install App</span> or <span className="font-bold">Add to Home screen</span></span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleDismiss}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all font-semibold text-sm"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Install Now
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
