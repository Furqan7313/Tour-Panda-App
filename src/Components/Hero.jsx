import React, { useState, useEffect } from 'react';
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import SuccessModal from './SuccessModal';

/**
 * Hero Component - Final Polish
 * 
 * - Branding: Colors updated to use Primary (Gold) and Nature Green for better contrast.
 * - UX: Buttons refined for touch targets and visual hierarchy.
 * - Layout: Navbar padding safely handled.
 * - Mobile: Slider visibility optimized.
 */

const offers = [
  {
    id: 1,
    title: "Hunza Valley",
    location: "Gilgit Baltistan",
    desc: "Experience the magic of the ancient Silk Road and majestic peaks.",
    img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 2,
    title: "Fairy Meadows",
    location: "Diamer District",
    desc: "Trek to the legendary meadows at the base of Nanga Parbat.",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 3,
    title: "Skardu",
    location: "Baltistan",
    desc: "Gateway to K2 and home to the world's most beautiful cold desert.",
    img: "https://images.unsplash.com/photo-1627827871302-3c48525b6a5d?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 4,
    title: "Naran Kaghan",
    location: "Khyber Pakhtunkhwa",
    desc: "Lush green valleys, roaring rivers, and serene alpine lakes.",
    img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1920&q=80"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-slide logic
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData.entries());
    const user = auth.currentUser;

    try {
      await addDoc(collection(db, "bookings"), {
        ...bookingData,
        destination: offers[currentSlide].title,
        userId: user ? user.uid : null,
        userEmail: user ? user.email : null,
        status: "Pending",
        createdAt: serverTimestamp()
      });

      setLoading(false);
      setIsBookingModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const currentOffer = offers[currentSlide];
  const nextOffer = offers[(currentSlide + 1) % offers.length];

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-nature-black text-white flex flex-col justify-center">

      {/* 1. Background Layer */}
      <div className="absolute inset-0 z-0">
        {offers.map((offer, index) => (
          <div
            key={offer.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
          >
            <img
              src={offer.img}
              alt={offer.title}
              className="w-full h-full object-cover"
            />
            {/* Overlays for Contrast - Enhanced for better text readability */}
            <div className="absolute inset-0 bg-nature-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-nature-black/90 via-nature-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-nature-black/90 via-transparent to-nature-black/20" />
          </div>
        ))}
      </div>

      {/* 2. Main Content Grid - Padded for Fixed Navbar */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-28 sm:pt-36 lg:pt-32 pb-12 flex flex-col justify-center h-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT COLUMN */}
          <div className="max-w-2xl animate-fade-in-up mt-8 lg:mt-0">

            {/* Location Tag */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="p-1.5 bg-primary/10 rounded-full backdrop-blur-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-primary drop-shadow-md">
                {currentOffer.location}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
              The Journey Beyond <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary/50 to-primary">
                Your Imaginary
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed mb-8 sm:mb-10 max-w-lg font-light drop-shadow-lg">
              {currentOffer.desc} Discover thousands of beautiful places in Northern Pakistan with wonderful experiences you can imagine.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-10 sm:mb-16">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="group h-12 sm:h-14 px-8 bg-primary text-nature-black rounded-full font-bold hover:bg-white hover:text-primary transition-all duration-300 shadow-[0_0_20px_rgba(253,184,19,0.3)] hover:shadow-[0_0_30px_rgba(253,184,19,0.6)] transform hover:-translate-y-1 active:scale-[0.98] flex items-center gap-2"
              >
                <span>Plan My Trip</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>

              <a
                href="#tours"
                className="group h-12 sm:h-14 px-6 rounded-full flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-nature-black transition-all">
                  <svg className="w-3 h-3 text-white group-hover:text-nature-black transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <span className="font-semibold tracking-wide text-sm text-white group-hover:text-primary transition-colors">Explore Tours</span>
              </a>
            </div>

            {/* Bottom Info Cards */}
            <div className="hidden sm:flex flex-wrap gap-4">
              <div className="bg-nature-black/40 backdrop-blur-lg border border-white/10 p-4 sm:p-5 rounded-2xl max-w-[180px] hover:bg-nature-black/60 transition-colors group cursor-default">
                <h4 className="font-bold text-white mb-2 text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                  Excellence
                </h4>
                <p className="text-[11px] text-gray-300 leading-normal">Striving for exceptional quality in every aspect of your journey.</p>
              </div>
              <div className="bg-nature-black/40 backdrop-blur-lg border border-white/10 p-4 sm:p-5 rounded-2xl max-w-[180px] hover:bg-nature-black/60 transition-colors group cursor-default">
                <h4 className="font-bold text-white mb-2 text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-nature-green inline-block"></span>
                  Sustainable
                </h4>
                <p className="text-[11px] text-gray-300 leading-normal">Promoting responsible travel practices for a better future.</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Slider */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full perspective-1000 flex items-center justify-center lg:justify-end mt-4 lg:mt-0">

            {/* Slider Track */}
            <div className="relative w-full max-w-sm lg:max-w-none flex justify-center lg:justify-end items-center lg:gap-8">

              {/* Active Card */}
              <div
                onClick={() => setIsBookingModalOpen(true)}
                className="relative w-[240px] h-[320px] sm:w-[280px] sm:h-[400px] lg:w-[320px] lg:h-[450px] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 transform hover:scale-[1.02] z-20 group cursor-pointer border-[4px] border-white/20 hover:border-primary/50 bg-nature-black"
              >
                <img
                  src={currentOffer.img}
                  alt={currentOffer.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nature-black/90 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-6 left-6 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md w-fit">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    {currentOffer.location}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-lg">{currentOffer.title}</h3>
                </div>
              </div>

              {/* Next Slide Preview (Desktop only) */}
              <div
                onClick={nextSlide}
                className="hidden lg:block relative w-[180px] h-[280px] rounded-[1.5rem] overflow-hidden shadow-xl transition-all duration-500 opacity-60 hover:opacity-100 cursor-pointer transform translate-x-4 hover:translate-x-0 z-10"
              >
                <img
                  src={nextOffer.img}
                  alt={nextOffer.title}
                  className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-all" />
              </div>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-0 sm:right-[-24px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-nature-black hover:scale-110 transition-all text-white border border-white/20"
                aria-label="Next destination"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>

            </div>

            {/* Slide Indicators */}
            <div className="absolute -bottom-6 lg:bottom-4 right-1/2 lg:right-20 translate-x-1/2 lg:translate-x-0 flex gap-2.5">
              {offers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentSlide(idx); setIsAutoPlaying(false); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-primary shadow-[0_0_10px_rgba(253,184,19,0.5)]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-nature-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-6 sm:p-8 relative animate-scale-in">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="text-center mb-6">
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">Plan Your Trip</span>
              <h3 className="text-2xl font-black text-nature-black mt-3">Start Your Journey</h3>
              <p className="text-gray-500 text-sm mt-1">Get a custom itinerary for <span className="font-bold text-nature-black">{offers[currentSlide].title}</span></p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <input required name="fullName" type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all" />
                <input required name="phone" type="tel" placeholder="Phone Number" className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" name="startDate" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm" />
                  <input type="number" name="guests" placeholder="Guests" min="1" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-nature-black font-black rounded-xl shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Sending...' : 'Request Free Quote'}
                {!loading && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} />

    </div>
  );
}