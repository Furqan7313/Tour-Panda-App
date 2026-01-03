import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: "Home", href: "/#home" },
      { name: "Featured Tours", href: "/#tours" },
      { name: "Our Services", href: "/#services" },
      { name: "Gallery", href: "/#gallery" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Use", href: "#" },
      { name: "Contact Support", href: "/#contact" },
    ],
    tourTypes: [
      { name: "Corporate Tours", href: "/tour/corporate-industrial" },
      { name: "Academic Tours", href: "/tour/academic-tour" },
      { name: "Family Tours", href: "/tour/family-tour" },
      { name: "Custom Tours", href: "/tour/customized-tour" },
    ]
  };

  const socialLinks = [
    {
      name: "Facebook",
      abbr: "FB",
      href: "https://www.facebook.com/tourpanda.pk",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
        </svg>
      )
    },
    {
      name: "Instagram",
      abbr: "IG",
      href: "https://www.instagram.com/tourpanda_official/",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      name: "WhatsApp",
      abbr: "WA",
      href: "https://wa.me/message/HJDPGMFFZNI3H1",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656z" />
        </svg>
      )
    },
  ];

  return (
    <footer className="bg-nature-black text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-nature-green/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Top Wave Decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-nature-green to-primary" />

      <div className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">

          {/* Brand Column - Takes 2 columns on large screens */}
          <div className="col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Logo */}
            <Link to="/" className="inline-block group">
              <div className="flex flex-col -space-y-1">
                <span className="text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] leading-none">Tour</span>
                <div className="flex items-center">
                  <span className="text-white text-2xl sm:text-3xl font-black group-hover:text-primary transition-colors duration-300">Panda</span>
                  <span className="text-primary text-2xl sm:text-3xl font-black">.pk</span>
                </div>
              </div>
            </Link>

            <p className="text-gray-400 leading-relaxed max-w-sm text-sm sm:text-base">
              Redefining the way you explore Pakistan's natural beauty with seamless digital itineraries and luxury experiences.
            </p>

            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group active:scale-95"
                  aria-label={social.name}
                >
                  <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>

            {/* Contact Info - Hidden on mobile, shown above in brand section on desktop */}
            <div className="hidden lg:flex flex-col gap-3 pt-4">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=Tourpandaofficial@gmail.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors duration-300 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors duration-300">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" fill="currentColor" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-medium">Email</span>
                  <span className="text-sm">Tourpandaofficial@gmail.com</span>
                </div>
              </a>
              <a href="tel:+923001261257" className="flex items-center gap-3 text-gray-400 hover:text-nature-green transition-colors duration-300 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-nature-green/20 transition-colors duration-300">
                  <span>📞</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-medium">Helpline</span>
                  <span className="text-sm font-semibold">0300 126 1257</span>
                </div>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <span>📍</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-medium">Head Office</span>
                  <span className="text-sm">Garden Town, Lahore</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <span>🆔</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-medium">ID No</span>
                  <span className="text-sm font-semibold">0243143</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tour Types */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-nature-green rounded-full" />
              Tour Types
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {footerLinks.tourTypes.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full" />
              Newsletter
            </h4>
            <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
              Subscribe for travel guides and exclusive deals.
            </p>
            <form className="space-y-2 sm:space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 p-3 sm:p-4 pr-12 rounded-xl outline-none focus:border-primary transition-all duration-300 text-white placeholder:text-gray-500 text-sm sm:text-base"
                  required
                />
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ✉️
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-yellow-500 text-nature-black py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>

            {/* Trust Badge */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              We respect your privacy
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6 sm:mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
            © {currentYear} <span className="text-primary font-bold">TourPanda.pk</span>. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
            {footerLinks.support.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-primary transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="absolute right-4 sm:right-6 bottom-20 sm:bottom-24">
          <a
            href="#home"
            className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-nature-black rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95"
            aria-label="Back to top"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}