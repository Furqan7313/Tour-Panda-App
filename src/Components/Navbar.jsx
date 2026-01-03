import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  // Track scroll position for navbar background effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    // If we're on a tour details page or other route, don't track sections
    if (location.pathname !== '/' && !location.pathname.startsWith('/#')) {
      setActiveSection('');
      return;
    }

    const sections = ['home', 'tours', 'services', 'gallery', 'reviews', 'contact'];

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname]);

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
    { name: "Home", href: "/#home", section: "home" },
    { name: "Tours", href: "/#tours", section: "tours" },
    { name: "Services", href: "/#services", section: "services" },
    { name: "Gallery", href: "/#gallery", section: "gallery" },
    { name: "Reviews", href: "/#reviews", section: "reviews" },
    { name: "Contact", href: "/#contact", section: "contact" },
  ];

  // Check if a nav link is active
  const isActive = (section) => activeSection === section;

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      {/* Top Bar: Social Media & Contact */}
      <div className={`bg-nature-green text-white transition-all duration-500 ${isScrolled ? 'py-1 sm:py-1.5' : 'py-1.5 sm:py-2.5'}`}>
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center text-xs sm:text-sm">
          {/* Phone number on mobile, full contact on desktop */}
          <div className="flex items-center gap-4 md:gap-8">
            <a href="tel:+923001261257" className="flex items-center gap-1.5 sm:gap-2 font-medium group">
              <span className="text-primary transition-transform duration-300 group-hover:scale-125 text-sm sm:text-base">📞</span>
              <span className="group-hover:text-primary transition-colors duration-300 font-semibold tracking-wide text-[11px] sm:text-sm">0300 126 1257</span>
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=Tourpandaofficial@gmail.com" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 font-medium group">
              <svg className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-125" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
              <span className="group-hover:text-primary transition-colors duration-300">Tourpandaofficial@gmail.com</span>
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* ID Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full">
              <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-bold text-white/90">ID: 0243143</span>
            </div>

            {/* Social Icons */}
            <a
              href="https://www.facebook.com/tourpanda.pk"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-all duration-300 hover:scale-125 hover:-translate-y-0.5 p-1"
              aria-label="Facebook"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" /></svg>
            </a>

            <a
              href="https://www.instagram.com/tourpanda_official/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-all duration-300 hover:scale-125 hover:-translate-y-0.5 p-1"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>

            <a
              href="https://wa.me/message/HJDPGMFFZNI3H1"
              target="_blank"
              rel="noreferrer"
              className="hover:text-green-400 transition-all duration-300 hover:scale-125 hover:-translate-y-0.5 p-1"
              aria-label="WhatsApp"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.131c1.53.913 3.354 1.395 5.216 1.396 5.44 0 9.866-4.426 9.868-9.866 0-2.636-1.026-5.115-2.89-6.98-1.864-1.864-4.341-2.89-6.978-2.89-5.44 0-9.866 4.426-9.868 9.866 0 2.029.619 4.013 1.79 5.715l-.991 3.62 3.703-.971zm11.367-5.221c-.33-.165-1.951-.964-2.252-1.074-.303-.11-.522-.165-.742.165-.219.33-.851 1.074-1.044 1.292-.191.218-.383.245-.713.08-.33-.165-1.394-.513-2.656-1.638-.981-.875-1.643-1.955-1.835-2.285-.19-.33-.021-.508.145-.671.148-.147.33-.385.495-.578.163-.193.218-.33.329-.55.11-.22.055-.412-.028-.578-.082-.165-.742-1.788-1.016-2.448-.267-.644-.54-.557-.742-.567-.19-.009-.411-.011-.631-.011-.22 0-.577.082-.88.412-.302.33-1.154 1.128-1.154 2.75s1.181 3.19 1.346 3.41c.165.22 2.324 3.549 5.63 4.978.785.34 1.398.543 1.875.694.788.25 1.506.214 2.071.129.63-.094 1.951-.798 2.226-1.568.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`bg-white/98 backdrop-blur-xl border-b border-gray-100/80 transition-all duration-500 ${isScrolled ? 'py-0' : ''}`}>
        <div className={`container mx-auto px-4 sm:px-6 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'}`}>

          {/* TourPanda.pk Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex flex-col -space-y-1">
              <span className="text-primary text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] leading-none transition-all duration-300 group-hover:tracking-[0.3em]">Tour</span>
              <div className="flex items-center">
                <span className="text-nature-black text-xl sm:text-2xl font-black group-hover:text-nature-green transition-all duration-300">Panda</span>
                <span className="text-primary text-xl sm:text-2xl font-black">.pk</span>
              </div>
            </div>
            {/* Decorative Panda Icon - hidden on mobile for space */}
            <div className="hidden sm:flex w-10 h-10 bg-gradient-to-br from-nature-green to-nature-green/80 rounded-xl items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-50 shadow-lg">
              <span className="text-lg">🐼</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            {navLinks.map((link, index) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`relative px-3 xl:px-5 py-2.5 font-semibold text-sm tracking-wide transition-all duration-300 rounded-xl group ${isActive(link.section)
                    ? 'text-nature-green bg-nature-green/10'
                    : 'text-nature-black hover:text-nature-green hover:bg-bg-light'
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.name}
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-nature-green transition-all duration-300 rounded-full ${isActive(link.section) ? 'w-2/3' : 'w-0 group-hover:w-2/3'
                    }`}></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              <Link
                to="/signin"
                className="text-nature-black font-semibold text-xs sm:text-sm hover:text-nature-green transition-all duration-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-bg-light"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="relative bg-gradient-to-r from-nature-green to-nature-green-light text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-nature-green/25 hover:-translate-y-0.5 overflow-hidden group"
              >
                <span className="relative z-10">Sign Up</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>

            {/* Mobile Menu Icon */}
            <button
              className="lg:hidden text-nature-black p-2.5 rounded-xl hover:bg-bg-light transition-colors duration-300 -mr-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                  className="transition-all duration-300"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-2 sm:space-y-3 overflow-y-auto max-h-[calc(80vh-2rem)]">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className={`block text-lg sm:text-xl font-bold transition-all duration-300 py-3 px-4 rounded-xl ${isActive(link.section)
                    ? 'text-nature-green bg-nature-green/10 border-l-4 border-nature-green'
                    : 'text-nature-black hover:text-nature-green hover:translate-x-2 hover:bg-gray-50'
                  }`}
                onClick={() => setIsOpen(false)}
                style={{
                  animationDelay: `${index * 50}ms`,
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(-10px)',
                  transition: `all 0.3s ease ${index * 50}ms`
                }}
              >
                <span className="flex items-center justify-between">
                  {link.name}
                  {isActive(link.section) && (
                    <span className="w-2 h-2 bg-nature-green rounded-full animate-pulse" />
                  )}
                </span>
              </a>
            ))}
            <hr className="border-gray-100 my-4 sm:my-6" />
            <div className="flex flex-col gap-3 sm:gap-4 pt-2">
              <Link
                to="/signin"
                onClick={() => setIsOpen(false)}
                className="text-center py-3.5 sm:py-4 text-nature-black font-bold text-base sm:text-lg border-2 border-gray-200 rounded-2xl hover:border-nature-green hover:text-nature-green transition-all duration-300 active:scale-[0.98]"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="text-center py-3.5 sm:py-4 bg-gradient-to-r from-nature-green to-nature-green-light text-white rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-nature-green/20 hover:shadow-2xl transition-all duration-300 active:scale-[0.98]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[-1]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}