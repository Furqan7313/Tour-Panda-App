import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Hero Component
 * 
 * The primary landing section of the application.
 * Features:
 * - Dynamic background image slider with animations
 * - Animated text and call-to-action buttons
 * - Integrated "Quick Booking" form
 * - Responsive layout for mobile and desktop
 */

/**
 * Static Data: Hero Slides
 * Promotional offers displayed in the background slider.
 */
const offers = [
  {
    id: 1,
    title: "Swat Kalam",
    discount: "Family Friendly",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 2,
    title: "Fairy Meadows",
    discount: "Adventure Deal",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 3,
    title: "Hunza + Skardu",
    discount: "Best Seller",
    img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 4,
    title: "Naran Kaghan",
    discount: "Weekend Trip",
    img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1920&q=80"
  }
];

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const tourTypes = [
    "Corporate / Industrial Tour",
    "Academic (School / Colleges) Tour",
    "Local Tour",
    "Customized Tour",
    "Family Tour",
    "Individual Tour"
  ];

  const tripPackages = [
    { id: "hunza-skardu-8days", name: "Hunza + Skardu", duration: "8 Days" },
    { id: "hunza-naran-5days", name: "Hunza + Naran Kaghan", duration: "5 Days" },
    { id: "fairy-meadows-5days", name: "Fairy Meadows", duration: "5 Days" },
    { id: "kumrat-valley-4days", name: "Kumrat Valley", duration: "4 Days" },
    { id: "swat-kalam-3days", name: "Swat Kalam Malamjaba", duration: "3 Days" },
    { id: "neelum-valley-3days", name: "Neelum Valley", duration: "3 Days" },
    { id: "naran-babusar-3days", name: "Naran Babusar Top", duration: "3 Days" },
    { id: "malamjabba-2days", name: "Malamjabba", duration: "2 Days" },
    { id: "shogran-siripaye-2days", name: "Shogran + Siripaye", duration: "2 Days" },
    { id: "mushkpori-top-1day", name: "Mushkpori Top", duration: "1 Day" },
  ];

  useEffect(() => {
    // Trigger entrance animations
    setIsVisible(true);

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Form Handler: Quick Booking
   * Captures form data and saves it to the 'bookings' collection in Firestore.
   * Shows success modal upon completion.
   */
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData.entries());

    try {
      await addDoc(collection(db, "bookings"), {
        ...bookingData,
        status: "Pending",
        createdAt: serverTimestamp()
      });

      setLoading(false);
      setIsModalOpen(true);
      e.target.reset();
    } catch (error) {
      setLoading(false);
      console.error("Firebase Error:", error);
      alert("Failed to submit booking. Please check your connection.");
    }
  };

  return (
    <div className="relative min-h-screen pt-24 sm:pt-28 overflow-hidden">

      {/* Dynamic Background Slider with Enhanced Overlay */}
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
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Multi-layer gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30" />
          </div>
        ))}

        {/* Animated decorative elements */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-nature-green/10 to-transparent rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full ${index === currentSlide
              ? 'w-8 h-3 bg-primary shadow-lg shadow-primary/50'
              : 'w-3 h-3 bg-nature-green/30 hover:bg-nature-green/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className={`relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* Left Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Animated Badge */}
          <div className="inline-block">
            <span className="relative bg-gradient-to-r from-primary to-yellow-400 text-nature-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-black text-[10px] sm:text-xs shadow-lg uppercase tracking-wider sm:tracking-widest inline-flex items-center gap-1.5 sm:gap-2 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              <span className="relative flex items-center gap-1.5 sm:gap-2">
                <span className="animate-bounce">🔥</span>
                <span className="line-clamp-1">{offers[currentSlide].discount} on {offers[currentSlide].title}!</span>
              </span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-nature-green leading-[1.15] drop-shadow-sm">
            Explore Pakistan's <br className="hidden xs:block" />
            <span className="relative inline-block pb-2 pr-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-primary animate-gradient-flow italic whitespace-nowrap">
                Untamed Beauty
              </span>
              {/* Decorative underline */}
              <svg className="absolute -bottom-0.5 sm:-bottom-1 left-0 w-full h-2 sm:h-3" viewBox="0 0 200 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,0 100,5 T200,5" stroke="url(#underline-gradient)" strokeWidth="3" fill="none" className="animate-pulse" />
                <defs>
                  <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FDB813" />
                    <stop offset="50%" stopColor="#2D5A27" />
                    <stop offset="100%" stopColor="#FDB813" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-gray-700 text-base sm:text-lg lg:text-xl max-w-lg font-medium leading-relaxed">
            With <span className="text-nature-green font-bold">TourPanda.pk</span>, experience nature with professional guidance and luxury comfort.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
            <a
              href="#tours"
              className="group relative bg-gradient-to-r from-nature-green to-nature-green-light text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-xl shadow-nature-green/25 hover:shadow-2xl hover:-translate-y-1 overflow-hidden active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                View All Tours
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="#contact"
              className="group px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base border-2 border-nature-green text-nature-green hover:bg-nature-green hover:text-white transition-all duration-300 flex items-center gap-2 active:scale-[0.98]"
            >
              <span>Contact Us</span>
              <span className="transition-transform duration-300 group-hover:rotate-12">💬</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
              <div>
                <p className="font-bold text-nature-black">4.9/5 Rating</p>
                <p className="text-xs">500+ Reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-nature-green/10 rounded-full flex items-center justify-center">
                <span className="text-lg">🏆</span>
              </div>
              <div>
                <p className="font-bold text-nature-black">Award Winner</p>
                <p className="text-xs">Best Tours 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="relative mt-4 lg:mt-0">
          {/* Decorative background blur */}
          <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-primary/20 to-nature-green/20 rounded-[2rem] sm:rounded-[4rem] blur-2xl opacity-50" />

          <div className="relative bg-white/95 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl border border-white/50">
            {/* Form Header */}
            <div className="mb-4 sm:mb-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse" />
                Quick Booking
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-nature-green">Plan Your Adventure</h3>
              <p className="text-gray-500 font-medium text-xs sm:text-sm mt-1">Fill the form to get a custom quote</p>
            </div>

            <form className="space-y-3 sm:space-y-4" onSubmit={handleBooking}>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="relative group">
                  <input
                    required
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 sm:p-4 bg-gray-50/80 rounded-lg sm:rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none text-nature-black font-medium transition-all duration-300 placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>

                <div className="relative group">
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="Phone #"
                    className="w-full p-3 sm:p-4 bg-gray-50/80 rounded-lg sm:rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none text-nature-black font-medium transition-all duration-300 placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>

                <div className="relative group">
                  <input
                    required
                    name="emergencyPhone"
                    type="tel"
                    placeholder="Emergency Number"
                    className="w-full p-3 sm:p-4 bg-gray-50/80 rounded-lg sm:rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none text-nature-black font-medium transition-all duration-300 placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>

                <div className="relative group">
                  <input
                    required
                    name="cnic"
                    type="text"
                    placeholder="CNIC #"
                    className="w-full p-3 sm:p-4 bg-gray-50/80 rounded-lg sm:rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none text-nature-black font-medium transition-all duration-300 placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Guest Counts */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="relative">
                  <label className="text-[8px] sm:text-[9px] uppercase font-bold text-blue-600 px-1 mb-0.5 block tracking-wider">👨 Males</label>
                  <input
                    required
                    name="maleCount"
                    type="number"
                    placeholder="0"
                    min="0"
                    defaultValue="1"
                    className="w-full p-2.5 sm:p-3 bg-blue-50/80 rounded-lg sm:rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:bg-white outline-none text-nature-black font-bold text-center transition-all duration-300 text-sm sm:text-base"
                  />
                </div>
                <div className="relative">
                  <label className="text-[8px] sm:text-[9px] uppercase font-bold text-rose-600 px-1 mb-0.5 block tracking-wider">👩 Females</label>
                  <input
                    required
                    name="femaleCount"
                    type="number"
                    placeholder="0"
                    min="0"
                    defaultValue="0"
                    className="w-full p-2.5 sm:p-3 bg-rose-50/80 rounded-lg sm:rounded-xl border-2 border-rose-100 focus:border-rose-400 focus:bg-white outline-none text-nature-black font-bold text-center transition-all duration-300 text-sm sm:text-base"
                  />
                </div>
                <div className="relative">
                  <label className="text-[8px] sm:text-[9px] uppercase font-bold text-amber-600 px-1 mb-0.5 block tracking-wider">👶 Kids {"<"}10</label>
                  <input
                    name="childrenCount"
                    type="number"
                    placeholder="0"
                    min="0"
                    defaultValue="0"
                    className="w-full p-2.5 sm:p-3 bg-amber-50/80 rounded-lg sm:rounded-xl border-2 border-amber-100 focus:border-amber-400 focus:bg-white outline-none text-nature-black font-bold text-center transition-all duration-300 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Trip Package Selection */}
              <select
                name="tripPackage"
                className="w-full p-3 sm:p-4 bg-gradient-to-r from-nature-green/5 to-primary/5 rounded-lg sm:rounded-xl border-2 border-nature-green/30 focus:border-nature-green text-nature-black font-medium transition-all duration-300 cursor-pointer text-sm sm:text-base"
              >
                <option value="">Select Trip Package (Optional)</option>
                {tripPackages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.duration}
                  </option>
                ))}
              </select>

              <input
                name="address"
                type="text"
                placeholder="Residential Address"
                className="w-full p-3 sm:p-4 bg-gray-50/80 rounded-lg sm:rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none text-nature-black font-medium transition-all duration-300 placeholder:text-gray-400 text-sm sm:text-base"
              />

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="text-[9px] sm:text-[10px] uppercase font-bold text-nature-green px-1 mb-1 block tracking-wider">Start Date</label>
                  <input
                    required
                    name="startDate"
                    type="date"
                    className="w-full p-3 sm:p-4 bg-gray-50/80 rounded-lg sm:rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none text-nature-black font-medium transition-all duration-300 cursor-pointer text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="text-[9px] sm:text-[10px] uppercase font-bold text-nature-green px-1 mb-1 block tracking-wider">End Date</label>
                  <input
                    required
                    name="endDate"
                    type="date"
                    className="w-full p-3 sm:p-4 bg-gray-50/80 rounded-lg sm:rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none text-nature-black font-medium transition-all duration-300 cursor-pointer text-sm sm:text-base"
                  />
                </div>
              </div>

              <select
                required
                name="tourType"
                className="w-full p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-nature-green/5 rounded-lg sm:rounded-xl border-2 border-primary/30 focus:border-primary text-nature-green font-bold transition-all duration-300 cursor-pointer text-sm sm:text-base"
              >
                <option value="">Select Tour Type</option>
                {tourTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full bg-gradient-to-r from-nature-green to-nature-green-light text-white py-4 sm:py-5 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-xl overflow-hidden active:scale-[0.98] ${loading ? 'opacity-70 cursor-wait' : 'hover:shadow-2xl hover:shadow-nature-green/30 hover:-translate-y-0.5'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="hidden xs:inline">Confirm</span> Booking Request
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                {!loading && <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-400 pt-1 sm:pt-2">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure & Encrypted Booking
              </div>
            </form>
          </div>
        </div>
      </div>

      <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}