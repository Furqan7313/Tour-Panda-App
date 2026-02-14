import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar Component
 * 
 * Redesigned to match the "Ventures" aesthetic:
 * - Transparent floating header
 * - Centered navigation
 * - Clean white typography
 * - Pill-shaped action button
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Destination", href: "/#tours" },
    { name: "Tour Packages", href: "/#tours" },
    { name: "Services", href: "/#services" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled
          ? 'bg-nature-black/80 backdrop-blur-md py-4 shadow-lg'
          : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* 1. Logo Section */}
        <Link to="/" className="flex items-center gap-3 group z-50">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
            <span className="text-xl filter drop-shadow-md">🐼</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white tracking-wide leading-none group-hover:text-primary transition-colors">TourPanda</span>
          </div>
        </Link>

        {/* 2. Centered Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/90 hover:text-white transition-all hover:scale-105 tracking-wide relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* 3. Right Action Button */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/signin" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            to="/tours" // Or trigger modal if context allows, keeping strictly strictly to link for now
            className="px-6 py-2.5 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white hover:text-nature-black hover:border-white transition-all duration-300 backdrop-blur-sm"
          >
            Schedule now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white p-2 z-50 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-nature-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
        >
          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-white hover:text-primary transition-colors transform hover:scale-110"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {link.name}
              </a>
            ))}
            <div className="h-px w-12 bg-white/20 my-4"></div>
            <Link
              to="/signin"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-white/80 hover:text-white"
            >
              Log in
            </Link>
            <Link
              to="/tours"
              onClick={() => setIsOpen(false)}
              className="px-8 py-3 rounded-full bg-white text-nature-black font-bold hover:bg-primary transition-colors"
            >
              Schedule now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}