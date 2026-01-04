import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BookingModal from './BookingModal';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

/**
 * Tours Component
 * 
 * Main catalog exhibition component.
 * Features:
 * - Horizontal scrolling category list
 * - Dynamic trip filtering
 * - Grid display of tour cards
 * - Integration with BookingModal
 * - Real-time data syncing
 */

// Default Trip Packages Data (fallback when Firebase is empty)
const defaultTripPackages = [
  {
    id: "hunza-skardu-8days",
    name: "Hunza + Skardu",
    duration: "8 Days",
    durationDays: 8,
    img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=600&q=80",
    desc: "Ultimate northern adventure covering the breathtaking valleys of Hunza and Skardu with mesmerizing landscapes.",
    highlights: ["Karimabad", "Attabad Lake", "Shangrila", "Deosai"],
    price: "85,000",
    difficulty: "Moderate",
    badge: "Best Seller",
    category: "long"
  },
  {
    id: "hunza-naran-5days",
    name: "Hunza + Naran Kaghan",
    duration: "5 Days",
    durationDays: 5,
    img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
    desc: "Explore two iconic destinations - the majestic Hunza Valley and scenic Naran Kaghan in one trip.",
    highlights: ["Eagle's Nest", "Saif ul Malook", "Lulusar Lake", "Babusar Top"],
    price: "55,000",
    difficulty: "Moderate",
    badge: "Popular",
    category: "mid"
  },
  {
    id: "fairy-meadows-5days",
    name: "Fairy Meadows",
    duration: "5 Days",
    durationDays: 5,
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    desc: "Trek to the legendary Fairy Meadows with stunning views of Nanga Parbat - the killer mountain.",
    highlights: ["Nanga Parbat View", "Camping", "Trekking", "Raikot Bridge"],
    price: "45,000",
    difficulty: "Challenging",
    badge: "Adventure",
    category: "mid"
  },
  {
    id: "kumrat-valley-4days",
    name: "Kumrat Valley",
    duration: "4 Days",
    durationDays: 4,
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
    desc: "Discover the hidden gem of KPK - lush green meadows, crystal rivers, and pristine forests.",
    highlights: ["Jahaz Banda", "Do Kala Chashma", "Katora Lake", "Pine Forests"],
    price: "35,000",
    difficulty: "Easy",
    badge: "Hidden Gem",
    category: "mid"
  },
  {
    id: "swat-kalam-3days",
    name: "Swat Kalam Malamjaba",
    duration: "3 Days",
    durationDays: 3,
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
    desc: "Experience the Switzerland of East - beautiful Swat with skiing slopes and serene valleys.",
    highlights: ["Malam Jabba Ski Resort", "Kalam Valley", "Fizagat Park", "Mingora"],
    price: "28,000",
    difficulty: "Easy",
    badge: "Family Friendly",
    category: "short"
  },
  {
    id: "neelum-valley-3days",
    name: "Neelum Valley",
    duration: "3 Days",
    durationDays: 3,
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    desc: "Explore the blue gem of Azad Kashmir - Neelum Valley's enchanting beauty awaits you.",
    highlights: ["Sharda", "Kel", "Arang Kel", "Neelum River"],
    price: "25,000",
    difficulty: "Easy",
    badge: "Scenic",
    category: "short"
  },
  {
    id: "naran-babusar-3days",
    name: "Naran Babusar Top",
    duration: "3 Days",
    durationDays: 3,
    img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80",
    desc: "Journey through one of the most beautiful mountain passes in Pakistan - Babusar Top.",
    highlights: ["Saif ul Malook", "Lulusar Lake", "Babusar Pass", "Naran Bazaar"],
    price: "22,000",
    difficulty: "Easy",
    badge: "Weekend Trip",
    category: "short"
  },
  {
    id: "malamjabba-2days",
    name: "Malamjabba",
    duration: "2 Days",
    durationDays: 2,
    img: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80",
    desc: "Pakistan's premier ski resort - perfect for a quick mountain getaway with adventure sports.",
    highlights: ["Skiing", "Chair Lift", "Snow Sports", "Mountain Views"],
    price: "18,000",
    difficulty: "Easy",
    badge: "Quick Escape",
    category: "weekend"
  },
  {
    id: "shogran-siripaye-2days",
    name: "Shogran + Siripaye",
    duration: "2 Days",
    durationDays: 2,
    img: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=600&q=80",
    desc: "Scenic hill stations with panoramic views of Makra Peak and lush green meadows.",
    highlights: ["Shogran Valley", "Siripaye Meadows", "Makra Peak View", "Horse Riding"],
    price: "16,000",
    difficulty: "Easy",
    badge: "Romantic",
    category: "weekend"
  },
  {
    id: "sharan-forest-2days",
    name: "Sharan Forest",
    duration: "2 Days",
    durationDays: 2,
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    desc: "Hidden paradise with dense pine forests, perfect for camping and nature lovers.",
    highlights: ["Pine Forest", "Camping", "Stargazing", "Wildlife"],
    price: "14,000",
    difficulty: "Easy",
    badge: "Nature",
    category: "weekend"
  },
  {
    id: "mushkpori-top-1day",
    name: "Mushkpori Top",
    duration: "1 Day",
    durationDays: 1,
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
    desc: "Highest peak in Galiyat - a thrilling day trek with breathtaking 360° mountain views.",
    highlights: ["Summit Trek", "Panoramic Views", "Nathia Gali", "Pine Trails"],
    price: "8,000",
    difficulty: "Moderate",
    badge: "Day Trek",
    category: "day"
  },
  {
    id: "umbrella-waterfall-1day",
    name: "Umbrella Waterfall",
    duration: "1 Day",
    durationDays: 1,
    img: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
    desc: "Visit the stunning umbrella-shaped waterfall in Sajikot - a perfect day trip from Islamabad.",
    highlights: ["Waterfall Visit", "Photography", "Picnic Spot", "Nature Walk"],
    price: "5,000",
    difficulty: "Easy",
    badge: "Budget",
    category: "day"
  },
  {
    id: "khewra-salt-mine-1day",
    name: "Khewra Salt Mine",
    duration: "1 Day",
    durationDays: 1,
    img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=600&q=80",
    desc: "Explore the world's second largest salt mine with its magical salt formations and mosque.",
    highlights: ["Salt Mine Tour", "Salt Mosque", "Museum", "Salt Products"],
    price: "4,500",
    difficulty: "Easy",
    badge: "Educational",
    category: "day"
  }
];

// Default Tour Categories Data (fallback when Firebase is empty)
const defaultTourCategories = [
  {
    id: "corporate",
    name: "Corporate Tours",
    desc: "Team building & business retreats",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "academic",
    name: "Academic Tours",
    desc: "Educational trips for schools & colleges",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "family",
    name: "Family Tours",
    desc: "Fun adventures for all ages",
    img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "individual",
    name: "Individual Tours",
    desc: "Solo travel experiences",
    img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "local",
    name: "Local Sightseeing",
    desc: "Discover nearby attractions",
    img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80"
  }
];

// Filter Options
const filterOptions = [
  { id: 'all', label: 'All Trips', icon: null },
  { id: 'day', label: 'Day Trips', icon: null },
  { id: 'weekend', label: 'Weekend', icon: null },
  { id: 'short', label: '3-4 Days', icon: null },
  { id: 'mid', label: '5-6 Days', icon: null },
  { id: 'long', label: 'Week+', icon: null },
];

export default function Tours() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [tripPackages, setTripPackages] = useState(defaultTripPackages);
  const [tourCategories, setTourCategories] = useState(defaultTourCategories);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const categoryScrollRef = useRef(null);

  // Fetch trips and categories from Firebase
  useEffect(() => {
    // Fetch trips
    const tripsQ = query(collection(db, "trips"), orderBy("createdAt", "desc"));
    const unsubTrips = onSnapshot(tripsQ, (snap) => {
      const firebaseTrips = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      if (firebaseTrips.length > 0) {
        setTripPackages(firebaseTrips);
      }
      setLoading(false);
    }, (error) => {
      console.log("Using default trips:", error);
      setLoading(false);
    });

    // Fetch categories
    const catsQ = query(collection(db, "categories"));
    const unsubCats = onSnapshot(catsQ, (snap) => {
      const firebaseCats = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      if (firebaseCats.length > 0) {
        setTourCategories(firebaseCats);
      }
    }, (error) => {
      console.log("Using default categories:", error);
    });

    return () => {
      unsubTrips();
      unsubCats();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  /**
   * Effect: Category Auto-Scroll
   * Creates a gentle back-and-forth scrolling animation for the category list.
   * Pauses on mouse hover.
   */
  useEffect(() => {
    const scrollContainer = categoryScrollRef.current;
    if (!scrollContainer) return;

    let scrollDirection = 1;
    let scrollAmount = 0;

    const autoScroll = setInterval(() => {
      if (!scrollContainer) return;

      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      scrollAmount += scrollDirection * 1;

      if (scrollAmount >= maxScroll) {
        scrollDirection = -1;
      } else if (scrollAmount <= 0) {
        scrollDirection = 1;
      }

      scrollContainer.scrollLeft = scrollAmount;
    }, 30);

    // Pause on hover
    const handleMouseEnter = () => clearInterval(autoScroll);
    const handleMouseLeave = () => {
      scrollAmount = scrollContainer.scrollLeft;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(autoScroll);
      scrollContainer?.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  /**
   * Filter Logic
   * Returns subset of trips matching the selected category.
   */
  const filteredTrips = activeFilter === 'all'
    ? tripPackages
    : tripPackages.filter(trip => trip.category === activeFilter);

  const handleBookNow = (packageId) => {
    setSelectedPackage(packageId);
    setIsModalOpen(true);
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'Best Seller': 'bg-gradient-to-r from-amber-500 to-orange-500',
      'Popular': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'Adventure': 'bg-gradient-to-r from-red-500 to-rose-500',
      'Hidden Gem': 'bg-gradient-to-r from-emerald-500 to-teal-500',
      'Family Friendly': 'bg-gradient-to-r from-pink-500 to-rose-400',
      'Scenic': 'bg-gradient-to-r from-purple-500 to-indigo-500',
      'Weekend Trip': 'bg-gradient-to-r from-nature-green to-nature-green-light',
      'Quick Escape': 'bg-gradient-to-r from-cyan-500 to-blue-500',
      'Romantic': 'bg-gradient-to-r from-rose-500 to-pink-500',
      'Nature': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'Day Trek': 'bg-gradient-to-r from-orange-500 to-amber-500',
      'Budget': 'bg-gradient-to-r from-primary to-primary-dark',
      'Educational': 'bg-gradient-to-r from-indigo-500 to-purple-500',
    };
    return colors[badge] || 'bg-gray-500';
  };

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Moderate': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Challenging': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <section ref={sectionRef} id="tours" className="py-20 lg:py-28 bg-gradient-to-b from-white via-bg-light/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-nature-green/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative">

        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 lg:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-nature-green/10 text-nature-green px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-2 h-2 bg-nature-green rounded-full animate-pulse" />
            Pakistan's Premier Tours
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-nature-black mb-4 tracking-tight">
            Explore <span className="text-nature-green">Breathtaking</span> Destinations
          </h2>
          <p className="text-gray-500 text-base lg:text-lg leading-relaxed mb-6">
            From day adventures to week-long expeditions, discover Pakistan's natural beauty with curated packages designed for every traveler
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Verified Tours</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">ID: 0243143</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold">5★ Rated</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <svg className="w-4 h-4 text-nature-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold">Garden Town, Lahore</span>
            </div>
          </div>
        </div>

        {/* Tour Categories - Horizontal Scrolling Cards */}
        <div className={`mb-14 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl lg:text-2xl font-black text-nature-black flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-nature-green to-nature-green-light rounded-xl flex items-center justify-center shadow-lg shadow-nature-green/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              Tour Categories
            </h3>
          </div>

          {/* Scrollable Container - Auto scrolls */}
          <div
            ref={categoryScrollRef}
            className="flex gap-4 lg:gap-5 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-nature-green/30 scrollbar-track-transparent hover:scrollbar-thumb-nature-green/50"
          >
            {tourCategories.map((cat, index) => (
              <Link
                key={cat.id}
                to={`/tour/${cat.id}`}
                className="group flex-shrink-0 w-48 sm:w-56 lg:w-64 bg-white rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-nature-green/15 hover:-translate-y-2 snap-start border border-gray-100 hover:border-nature-green/30"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Container */}
                <div className="relative h-28 sm:h-32 lg:h-36 overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-md">
                    <span className="text-[9px] lg:text-[10px] font-bold text-nature-green uppercase tracking-wider">Category</span>
                  </div>

                  {/* Arrow icon on hover */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-4 h-4 text-nature-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Content Below Image */}
                <div className="p-3 lg:p-4">
                  <h4 className="font-bold text-nature-black text-sm lg:text-base mb-1 group-hover:text-nature-green transition-colors duration-300 line-clamp-1">
                    {cat.name}
                  </h4>
                  <p className="text-gray-500 text-[11px] lg:text-xs font-medium line-clamp-2 mb-2">{cat.desc}</p>

                  {/* Arrow CTA */}
                  <div className="flex items-center gap-1.5 text-nature-green font-semibold text-[11px] lg:text-xs group-hover:gap-2.5 transition-all duration-300">
                    <span>View Tours</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}

            {/* Custom Tour Card - Opens Booking Modal */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative flex-shrink-0 w-48 sm:w-56 lg:w-64 h-44 sm:h-48 lg:h-56 rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2 snap-start flex flex-col items-center justify-center text-center p-5 border-2 border-primary/30 cursor-pointer"
            >
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-20 h-20 border-2 border-nature-black rounded-full" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-nature-black rounded-full" />
              </div>

              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-nature-black/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <svg className="w-7 h-7 lg:w-8 lg:h-8 text-nature-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4 className="font-black text-nature-black text-base lg:text-lg mb-1">Custom Tour</h4>
              <p className="text-nature-black/70 text-xs lg:text-sm font-medium">Design your dream adventure</p>

              {/* CTA hint */}
              <div className="mt-3 px-4 py-1.5 bg-nature-black/20 rounded-full text-nature-black text-xs font-bold group-hover:bg-nature-black group-hover:text-primary transition-all duration-300">
                Book Now
              </div>
            </button>
          </div>
        </div>

        {/* Trip Packages Section */}
        <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Section Title & Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <h3 className="text-xl lg:text-2xl font-black text-nature-black">
                Trip Packages
              </h3>
              <span className="bg-nature-green text-white text-xs font-bold px-3 py-1 rounded-full">
                {tripPackages.length} Tours
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${activeFilter === filter.id
                    ? 'bg-nature-green text-white shadow-lg shadow-nature-green/25'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-nature-green/30 hover:text-nature-green'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trips Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {filteredTrips.map((trip, index) => (
              <div
                key={trip.id}
                className={`group relative bg-white rounded-[1.5rem] overflow-hidden transition-all duration-500 border border-gray-100 hover:border-transparent flex flex-col shadow-sm hover:shadow-2xl hover:shadow-nature-green/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {/* Image Container */}
                <div className="relative h-44 lg:h-48 overflow-hidden">
                  <img
                    src={trip.img}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={trip.name}
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Badges Row */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    {/* Category Badge */}
                    <span className={`${getBadgeColor(trip.badge)} text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-sm`}>
                      {trip.badge}
                    </span>

                    {/* Difficulty Badge */}
                    <span className={`${getDifficultyStyle(trip.difficulty)} text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-sm`}>
                      {trip.difficulty}
                    </span>
                  </div>

                  {/* Bottom Info on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-white/70 text-[10px] font-medium uppercase tracking-wider">From</span>
                        <p className="text-white font-black text-xl">PKR {trip.price}</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-white text-xs font-bold">{trip.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-5 flex-grow flex flex-col">
                  <h4 className="font-bold text-nature-black text-base lg:text-lg mb-2 group-hover:text-nature-green transition-colors duration-300 line-clamp-1">
                    {trip.name}
                  </h4>
                  <p className="text-gray-500 text-sm mb-4 flex-grow leading-relaxed line-clamp-2">
                    {trip.desc}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {trip.highlights.slice(0, 3).map((highlight, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                    {trip.highlights.length > 3 && (
                      <span className="text-[10px] bg-nature-green/10 text-nature-green px-2 py-0.5 rounded-md font-semibold">
                        +{trip.highlights.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Link
                      to={`/tour/${trip.id}`}
                      className="flex-1 text-center py-2.5 text-nature-green border-2 border-nature-green/20 rounded-xl font-bold text-sm hover:bg-nature-green/5 hover:border-nature-green/40 transition-all duration-300"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleBookNow(trip.id)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-nature-green to-nature-green-light text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-nature-green/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                      <span className="relative">Book Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTrips.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-nature-black mb-2">No trips found</h4>
              <p className="text-gray-500">Try selecting a different filter</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 lg:mt-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative bg-gradient-to-br from-nature-green via-nature-green-light to-nature-green rounded-[2rem] p-8 md:p-12 lg:p-16 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">
                Can't Find Your Perfect Adventure?
              </h3>
              <p className="text-white/80 text-base lg:text-lg mb-8 leading-relaxed">
                Tell us your dream destination and preferences. Our travel experts will craft a personalized itinerary just for you!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-3 bg-white text-nature-green px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100"
                >
                  <span>Request Custom Tour</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/message/HJDPGMFFZNI3H1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-white font-semibold hover:text-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPackage(null);
        }}
        preSelectedPackage={selectedPackage}
      />
    </section>
  );
}