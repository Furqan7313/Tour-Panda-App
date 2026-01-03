import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import BookingModal from '../Components/BookingModal';

// Trip data for details page
const tripData = {
  "hunza-skardu-8days": {
    name: "Hunza + Skardu",
    duration: "8 Days",
    price: "85,000",
    img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Ultimate northern adventure covering the breathtaking valleys of Hunza and Skardu with mesmerizing landscapes, ancient forts, and warm hospitality.",
    highlights: ["Karimabad", "Attabad Lake", "Shangrila Resort", "Deosai National Park", "Baltit Fort", "Passu Cones"]
  },
  "fairy-meadows-5days": {
    name: "Fairy Meadows",
    duration: "5 Days",
    price: "45,000",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Trek to the legendary Fairy Meadows with stunning views of Nanga Parbat - the killer mountain. An adventure for the brave at heart.",
    highlights: ["Nanga Parbat Base Camp", "Fairy Meadows Camping", "Raikot Bridge", "Jeep Safari", "Star Gazing"]
  },
  "swat-kalam-3days": {
    name: "Swat Kalam Malamjaba",
    duration: "3 Days",
    price: "28,000",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Experience the Switzerland of East - beautiful Swat with skiing slopes and serene valleys perfect for families.",
    highlights: ["Malam Jabba Ski Resort", "Kalam Valley", "Fizagat Park", "Mingora City", "Ushu Forest"]
  },
  // Tour Categories
  "corporate": {
    name: "Corporate Tours",
    duration: "Customizable",
    price: "Contact Us",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Professional team retreats and business tours designed for corporate groups. Build stronger teams while exploring Pakistan's natural beauty.",
    highlights: ["Team Building Activities", "Conference Facilities", "Luxury Accommodation", "Professional Guides", "Custom Itineraries"]
  },
  "academic": {
    name: "Academic Tours",
    duration: "Customizable",
    price: "Contact Us",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Educational excursions for schools, colleges, and universities. Combine learning with adventure for an unforgettable experience.",
    highlights: ["Educational Sites", "Historical Monuments", "Nature Studies", "Group Activities", "Safe Transport"]
  },
  "family": {
    name: "Family Tours",
    duration: "Customizable",
    price: "Contact Us",
    img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Fun adventures for all ages. Family-friendly destinations with activities that everyone can enjoy together.",
    highlights: ["Kid-Friendly Activities", "Family Rooms", "Safe Adventures", "Memorable Experiences", "All Ages Welcome"]
  },
  "individual": {
    name: "Individual Tours",
    duration: "Customizable",
    price: "Contact Us",
    img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Solo travel experiences tailored just for you. Explore at your own pace with personalized itineraries.",
    highlights: ["Personalized Plans", "Flexible Schedule", "Solo-Friendly", "Local Experiences", "Photography Tours"]
  },
  "local": {
    name: "Local Sightseeing",
    duration: "1-2 Days",
    price: "Contact Us",
    img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Discover nearby attractions and hidden gems. Perfect for quick getaways and weekend explorations.",
    highlights: ["Day Trips", "Weekend Getaways", "City Tours", "Hidden Gems", "Local Cuisine"]
  }
};

// Default data for unknown tours
const defaultTour = {
  name: "Adventure Tour",
  duration: "Customizable",
  price: "Contact Us",
  img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"
  ],
  description: "Explore Pakistan's most beautiful destinations with our expertly curated tour packages. Contact us for more details about this adventure.",
  highlights: ["Professional Guides", "Comfortable Transport", "Quality Accommodation", "All Meals Included"]
};

export default function TourDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get tour data or use default
  const tour = tripData[id] || { ...defaultTour, name: id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Adventure Tour' };

  return (
    <>
      <Navbar />
      <div className="pt-36 sm:pt-40 pb-20 bg-bg-light min-h-screen">
        <div className="container mx-auto px-4 sm:px-6">

          {/* Navigation Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link to="/" className="hover:text-nature-green transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/#tours" className="hover:text-nature-green transition-colors">Tours</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-nature-green font-semibold">{tour.name}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

            {/* Left Column: Details & Content */}
            <div className="lg:col-span-2">
              {/* Hero Image */}
              <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-4 shadow-2xl group">
                <img
                  src={tour.img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={tour.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Info Badge - Duration only */}
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {tour.duration}
                  </span>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-xl">
                  <span className="text-xs text-gray-500 block">Starting from</span>
                  <span className="text-2xl font-black text-nature-green">{tour.price === 'Contact Us' ? tour.price : `PKR ${tour.price}`}</span>
                </div>
              </div>

              {/* Image Gallery */}
              {tour.gallery && tour.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {tour.gallery.map((img, index) => (
                    <div key={index} className="relative h-20 sm:h-24 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow">
                      <img
                        src={img}
                        alt={`${tour.name} ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-nature-black mb-4">
                {tour.name} <span className="text-nature-green">Adventure</span>
              </h1>

              {/* Content Tabs */}
              <div className="flex border-b border-gray-200 mb-6 gap-6 overflow-x-auto no-scrollbar">
                {['overview', 'itinerary', 'services'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-base font-bold capitalize transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-nature-green' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-nature-green rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <p className="text-gray-600 leading-relaxed text-lg">{tour.description}</p>

                    <div>
                      <h4 className="font-bold text-nature-black mb-3">Trip Highlights</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {tour.highlights.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 bg-nature-green/5 px-4 py-3 rounded-xl">
                            <svg className="w-5 h-5 text-nature-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-medium text-nature-black">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: "🚐", text: "Luxury Transport (AC Coaster/Grand Cabin)" },
                      { icon: "🏥", text: "Medical Kit & First Aid" },
                      { icon: "🏨", text: "3-Star Accommodations" },
                      { icon: "🍽️", text: "Standard Food (Breakfast & Dinner)" },
                      { icon: "👨‍💼", text: "Professional Tour Guide" },
                      { icon: "💰", text: "All Tolls & Taxes Included" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-medium text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-4">
                    {[
                      { day: 1, title: "Departure & Arrival", desc: "Departure from meeting point and arrival at destination. Check-in, dinner and night stay." },
                      { day: 2, title: "Sightseeing Day", desc: "Full day local sightseeing and adventure activities with professional guides." },
                      { day: 3, title: "Return Journey", desc: "Morning breakfast, checkout and return journey with beautiful memories." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-nature-green text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                          {item.day}
                        </div>
                        <div>
                          <h5 className="font-bold text-nature-black mb-1">{item.title}</h5>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white to-gray-50 p-5 md:p-7 rounded-[2rem] shadow-2xl border border-gray-100/80 sticky top-28 overflow-hidden relative">
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-nature-green/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                {/* Header */}
                <div className="flex items-center gap-3 mb-5 relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-nature-green to-nature-green-light rounded-2xl flex items-center justify-center shadow-lg shadow-nature-green/25">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-nature-black">Reserve Your Spot</h3>
                    <p className="text-xs text-gray-400 font-medium">Book now, pay later</p>
                  </div>
                </div>

                {/* Quick Info with Icons */}
                <div className="bg-white rounded-2xl p-4 mb-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 text-nature-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Duration
                    </span>
                    <span className="font-bold text-nature-black">{tour.duration}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 text-nature-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Price
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block font-medium">Starting from</span>
                      <span className="font-black text-xl text-nature-green">{tour.price === 'Contact Us' ? tour.price : `PKR ${tour.price}`}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-gradient-to-r from-nature-green via-nature-green to-nature-green-light text-white py-4 rounded-2xl font-bold text-base md:text-lg hover:shadow-2xl hover:shadow-nature-green/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span>Book This Adventure</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  <a
                    href="https://wa.me/message/HJDPGMFFZNI3H1"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 py-3.5 rounded-2xl font-bold hover:from-green-100 hover:to-emerald-100 transition-all duration-300 flex items-center justify-center gap-2 border border-green-100"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Secure Booking</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Verified Tours</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">Top Rated</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl">
                      <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedPackage={id}
      />
    </>
  );
}