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
    // Dark mode customized colors
    const colors = {
      'Best Seller': 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
      'Popular': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      'Adventure': 'bg-gradient-to-r from-red-500 to-rose-500 text-white',
      'Hidden Gem': 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
      'Family Friendly': 'bg-gradient-to-r from-pink-500 to-rose-400 text-white',
      'Scenic': 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
      'Weekend Trip': 'bg-gradient-to-r from-nature-green to-emerald-400 text-white',
      'Quick Escape': 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
      'Romantic': 'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
      'Nature': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      'Day Trek': 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
      'Budget': 'bg-gradient-to-r from-primary to-yellow-500 text-nature-black',
      'Educational': 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
    };
    return colors[badge] || 'bg-gray-700 text-white';
  };

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Moderate': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Challenging': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <section ref={sectionRef} id="tours" className="py-20 lg:py-32 relative overflow-hidden bg-nature-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1548685121-72a93974d619?q=80&w=2000&auto=format&fit=crop"
          alt="Tours Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-nature-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-nature-black via-transparent to-nature-black" />
      </div>

      {/* Decorative Background Elements Removed */}

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-primary px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Pakistan's Premier Tours
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary">Breathtaking</span> Destinations
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-light">
            From day adventures to week-long expeditions, discover Pakistan's natural beauty with curated packages designed for every traveler.
          </p>
        </div>

        {/* Tour Categories - Horizontal Scrolling Cards */}
        <div className={`mb-24 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <span className="w-10 h-10 bg-white/10 text-primary rounded-xl flex items-center justify-center text-sm border border-white/10 backdrop-blur-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              Top Categories
            </h3>
          </div>

          <div
            ref={categoryScrollRef}
            className="flex gap-5 lg:gap-6 overflow-x-auto pb-6 scroll-smooth scrollbar-hide px-2 items-stretch"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tourCategories.map((cat, index) => (
              <Link
                key={cat.id}
                to={`/tour/${cat.id}`}
                className="group relative flex-shrink-0 w-64 lg:w-72 bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(253,184,19,0.1)]"
              >
                <div className="relative h-48 overflow-hidden rounded-[2rem] m-2">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nature-black/90 via-transparent to-transparent opacity-90" />
                </div>
                <div className="px-5 pb-5 pt-2">
                  <h4 className="font-bold text-lg mb-1 text-white group-hover:text-primary transition-colors">{cat.name}</h4>
                  <p className="text-gray-400 text-xs line-clamp-2">{cat.desc}</p>
                </div>
              </Link>
            ))}

            {/* Custom Tour Card */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative flex-shrink-0 w-64 lg:w-72 bg-gradient-to-br from-primary/20 to-nature-green/20 border border-primary/30 rounded-[2rem] overflow-hidden flex flex-col justify-center items-center text-center p-6 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_0_30px_rgba(253,184,19,0.2)]"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-yellow-500 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-nature-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-1 text-white">Make Your Own</h4>
              <p className="text-sm text-gray-300 mb-5">Design a custom itinerary tailored to your preferences.</p>
              <span className="bg-primary text-nature-black px-6 py-2 rounded-full text-xs font-bold group-hover:bg-white transition-colors">Start Planning</span>
            </button>
          </div>
        </div>

        {/* Trip Packages Section */}
        <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Section Title & Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div>
              <h3 className="text-3xl font-black text-white mb-2">Available Packages</h3>
              <p className="text-gray-400 text-sm">Choose from {tripPackages.length} curated experiences</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 border ${activeFilter === filter.id
                    ? 'bg-primary text-nature-black border-primary shadow-[0_0_15px_rgba(253,184,19,0.4)]'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-primary/50 hover:text-white'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trips Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredTrips.map((trip, index) => (
              <div
                key={trip.id}
                className={`group bg-white/5 border border-white/10 backdrop-blur-sm rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-2 flex flex-col ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={trip.img}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={trip.name}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nature-black via-transparent to-transparent opacity-90" />

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`${getBadgeColor(trip.badge)} text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg`}>
                      {trip.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end text-white">
                    <div>
                      <p className="text-xs font-bold text-primary mb-0.5 uppercase tracking-wider">Starting From</p>
                      <p className="font-black text-xl">PKR {trip.price}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-bold">{trip.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-white text-xl leading-tight group-hover:text-primary transition-colors">
                      {trip.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${getDifficultyStyle(trip.difficulty)}`}>
                      {trip.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                      <span className="text-primary">★</span> 4.9
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed font-light">
                    {trip.desc}
                  </p>

                  <div className="mt-auto flex gap-3">
                    <Link
                      to={`/tour/${trip.id}`}
                      className="flex-1 py-3.5 text-center text-sm font-bold text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleBookNow(trip.id)}
                      className="flex-1 py-3.5 text-center text-sm font-bold text-nature-black bg-primary rounded-xl hover:bg-white hover:text-primary transition-colors shadow-lg hover:shadow-primary/40"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTrips.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10 mt-10">
              <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">No trips found</h4>
              <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-24 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-[3rem] p-10 lg:p-16 overflow-hidden text-center border border-primary/20">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-3xl lg:text-5xl font-black text-white mb-6">
                Still dreaming of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">perfect trip?</span>
              </h3>
              <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
                Our travel experts can build a completely custom itinerary just for you. Tell us where you want to go, and we'll handle the rest.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-3 bg-primary text-nature-black px-10 py-4 rounded-full font-bold transition-all hover:scale-105 hover:bg-white hover:text-primary shadow-[0_0_20px_rgba(253,184,19,0.3)]"
                >
                  Start Custom Plan
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
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