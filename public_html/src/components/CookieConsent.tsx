import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = 'cookie_consent_status';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentStatus) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    // Enable Google Analytics
    window.gtag?.('consent', 'update', {
      'analytics_storage': 'granted'
    });
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setIsVisible(false);
    // Disable Google Analytics
    window.gtag?.('consent', 'update', {
      'analytics_storage': 'denied'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa{' '}
            <Link 
              to="/politica-de-cookies" 
              className="text-[#2E86C1] hover:underline font-medium"
            >
              política de cookies
            </Link>.
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleReject}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Recusar
            </Button>
            <Button 
              onClick={handleAccept}
              className="bg-[#2E86C1] hover:bg-[#2E86C1]/90 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Aceitar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 