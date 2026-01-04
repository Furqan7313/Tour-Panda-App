import React, { useEffect } from 'react';

/**
 * SuccessModal Component
 * 
 * Displays a confirmation message after a successful action (e.g., Booking).
 * Features:
 * - Animated appearance
 * - Backdrop blur
 * - Keyboard accessibility (Escape key to close)
 * - Next steps information
 */
export default function SuccessModal({ isOpen, onClose }) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-nature-black/60 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-8 lg:p-10 rounded-[2rem] max-w-md w-full text-center shadow-2xl border border-gray-100 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-nature-green to-primary rounded-t-[2rem]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-nature-black transition-all duration-300"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Animation Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Animated rings */}
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
          <div className="absolute inset-2 bg-green-50 rounded-full animate-pulse" />
          {/* Main icon */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl lg:text-3xl font-black text-nature-green mb-3">
          Booking Confirmed! 🎉
        </h3>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Your booking request has been submitted successfully. Our team will contact you within 24 hours with further details.
        </p>

        {/* What's Next Section */}
        <div className="bg-bg-light rounded-2xl p-4 mb-6 text-left">
          <h4 className="font-bold text-nature-green text-sm mb-3">What happens next?</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>You'll receive a confirmation email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Our team will call you to finalize details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Get your personalized itinerary</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-nature-green to-nature-green-light text-white py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Great, thanks!
          </button>
          <a
            href="https://wa.me/message/HJDPGMFFZNI3H1"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-green-50 text-green-700 py-4 rounded-xl font-bold transition-all duration-300 hover:bg-green-100 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656z" />
            </svg>
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}