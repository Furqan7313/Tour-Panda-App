import React from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import Tours from './Components/Tours';
import Services from './Components/Services';
import Gallery from './Components/Gallery';
import Reviews from './Components/Reviews';
import Contact from './Components/Contact';
import Footer from './Components/Footer';

const App = () => {
  return (
    <div className="min-h-screen bg-bg-light font-sans selection:bg-primary selection:text-white">

      {/* Navigation */}
      <Navbar />

      {/* Main Content - Landing Page Sections */}
      <main>
        <section id="home"><Hero /></section>
        <section id="tours"><Tours /></section>
        <section id="services"><Services /></section>
        <section id="gallery"><Gallery /></section>
        <section id="reviews"><Reviews /></section>
        <section id="contact"><Contact /></section>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Floating Button - Enhanced */}
      <a
        href="https://wa.me/message/HJDPGMFFZNI3H1"
        target="_blank"
        rel="noreferrer"
        className="group fixed bottom-8 right-8 z-[150] flex items-center gap-3"
        aria-label="Chat on WhatsApp"
      >
        {/* Tooltip */}
        <span className="hidden sm:block bg-white text-nature-black px-4 py-2 rounded-full font-bold text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
          Chat with us!
        </span>

        {/* Button */}
        <div className="relative">
          {/* Pulse Animation */}
          <span className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-30" />

          {/* Main Button */}
          <div className="relative bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white p-4 rounded-full shadow-lg shadow-[#25D366]/40 hover:shadow-xl hover:shadow-[#25D366]/50 hover:scale-110 transition-all duration-300">
            <svg
              className="w-7 h-7 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.131c1.53.913 3.354 1.395 5.216 1.396 5.44 0 9.866-4.426 9.868-9.866 0-2.636-1.026-5.115-2.89-6.98-1.864-1.864-4.341-2.89-6.978-2.89-5.44 0-9.866 4.426-9.868 9.866 0 2.029.619 4.013 1.79 5.715l-.991 3.62 3.703-.971zm11.367-5.221c-.33-.165-1.951-.964-2.252-1.074-.303-.11-.522-.165-.742.165-.219.33-.851 1.074-1.044 1.292-.191.218-.383.245-.713.08-.33-.165-1.394-.513-2.656-1.638-.981-.875-1.643-1.955-1.835-2.285-.19-.33-.021-.508.145-.671.148-.147.33-.385.495-.578.163-.193.218-.33.329-.55.11-.22.055-.412-.028-.578-.082-.165-.742-1.788-1.016-2.448-.267-.644-.54-.557-.742-.567-.19-.009-.411-.011-.631-.011-.22 0-.577.082-.88.412-.302.33-1.154 1.128-1.154 2.75s1.181 3.19 1.346 3.41c.165.22 2.324 3.549 5.63 4.978.785.34 1.398.543 1.875.694.788.25 1.506.214 2.071.129.63-.094 1.951-.798 2.226-1.568.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z" />
            </svg>
          </div>
        </div>
      </a>

    </div>
  );
};

export default App;