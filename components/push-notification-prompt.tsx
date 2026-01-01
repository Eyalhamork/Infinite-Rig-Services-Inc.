"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, X, Check, Loader2 } from "lucide-react";
import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push-notifications";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PushNotificationPromptProps {
  variant?: "banner" | "card" | "minimal";
  onDismiss?: () => void;
}

export default function PushNotificationPrompt({
  variant = "card",
  onDismiss,
}: PushNotificationPromptProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSupport();
    checkSubscription();
  }, []);

  async function checkSupport() {
    const supported = isPushSupported();
    setIsSupported(supported);

    if (supported && typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }

    // Check if user has dismissed the prompt before
    const dismissedKey = localStorage.getItem("push-prompt-dismissed");
    if (dismissedKey) {
      setDismissed(true);
    }
  }

  async function checkSubscription() {
    if (!isPushSupported()) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  }

  async function handleSubscribe() {
    setLoading(true);
    setError(null);

    try {
      const subscriptionJson = await subscribeToPush();

      if (!subscriptionJson) {
        throw new Error("Failed to create subscription");
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Save subscription to backend
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscriptionJson,
          userId: user?.id || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save subscription");
      }

      setIsSubscribed(true);
      setPermission("granted");
    } catch (err: any) {
      console.error("Subscription error:", err);
      setError(err.message || "Failed to enable notifications");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsubscribe() {
    setLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Delete from backend
        await fetch(
          `/api/push/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`,
          {
            method: "DELETE",
          }
        );

        // Unsubscribe locally
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
    } catch (err: any) {
      console.error("Unsubscribe error:", err);
      setError(err.message || "Failed to disable notifications");
    } finally {
      setLoading(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem("push-prompt-dismissed", "true");
    setDismissed(true);
    onDismiss?.();
  }

  // Don't render if not supported or dismissed
  if (!isSupported || dismissed || permission === "denied") {
    return null;
  }

  // Already subscribed - show status badge for minimal variant
  if (isSubscribed && variant === "minimal") {
    return (
      <button
        onClick={handleUnsubscribe}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Bell className="w-4 h-4" />
        )}
        Notifications On
      </button>
    );
  }

  // Not subscribed - show enable button for minimal variant
  if (!isSubscribed && variant === "minimal") {
    return (
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <BellOff className="w-4 h-4" />
        )}
        Enable Notifications
      </button>
    );
  }

  // Banner variant
  if (variant === "banner") {
    if (isSubscribed) return null;

    return (
      <div className="bg-gradient-to-r from-primary/10 to-orange-100 border-b border-primary/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-navy-900">Stay Updated</p>
              <p className="text-sm text-gray-600">
                Get notified about project updates and messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-2 max-w-7xl mx-auto">{error}</p>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-navy-900 mb-1">
              {isSubscribed ? "Notifications Enabled" : "Enable Notifications"}
            </h3>
            <p className="text-gray-500 text-sm">
              {isSubscribed
                ? "You'll receive updates about projects, messages, and important alerts."
                : "Get instant updates about project status, new messages, and important alerts."}
            </p>
          </div>
        </div>
        {!isSubscribed && (
          <button
            onClick={handleDismiss}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        {isSubscribed ? (
          <button
            onClick={handleUnsubscribe}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
            Disable Notifications
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
            Enable Notifications
          </button>
        )}
      </div>
    </div>
  );
}
