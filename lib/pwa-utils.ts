/**
 * Utility to trigger the PWA install prompt manually.
 * Dispatching this custom event is caught by the PWAInstallPrompt component.
 */
export const triggerPWAInstall = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
    }
};
