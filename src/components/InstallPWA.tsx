'use client';

import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Show banner after 3 seconds
      setTimeout(() => {
        setShowBanner(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS or when prompt is not available
      alert(
        'To install this app:\n\n' +
        'On iPhone/iPad:\n' +
        '1. Tap the Share button\n' +
        '2. Tap "Add to Home Screen"\n\n' +
        'On Android:\n' +
        '1. Tap the menu (⋮)\n' +
        '2. Tap "Add to Home screen"'
      );
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    }
    
    // Clear the prompt
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Floating Install Banner */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl shadow-2xl p-4 flex items-center gap-4 text-white">
            <div className="bg-white/20 p-3 rounded-xl">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Install Shop Faisu App</h3>
              <p className="text-sm text-white/90">Get the full app experience!</p>
            </div>
            <button
              onClick={handleInstall}
              className="bg-white text-emerald-600 px-6 py-2 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Fixed Install Button (Always Visible) */}
      {deferredPrompt && !showBanner && (
        <button
          onClick={handleInstall}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 flex items-center gap-2 group"
          title="Install App"
        >
          <Download className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-semibold">
            Install App
          </span>
        </button>
      )}
    </>
  );
}

// Install Button Component for Profile Page
export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert(
        'To install this app:\n\n' +
        'On iPhone/iPad:\n' +
        '1. Tap the Share button (📤)\n' +
        '2. Scroll down and tap "Add to Home Screen"\n' +
        '3. Tap "Add"\n\n' +
        'On Android:\n' +
        '1. Tap the menu (⋮) in the top-right\n' +
        '2. Tap "Add to Home screen"\n' +
        '3. Tap "Add"'
      );
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="w-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <Smartphone className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-emerald-900 dark:text-emerald-100">
            App Installed! ✓
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            You can now use the app from your home screen
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleInstall}
      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
    >
      <Download className="w-5 h-5 group-hover:animate-bounce" />
      <span>Download & Install App</span>
    </button>
  );
}
