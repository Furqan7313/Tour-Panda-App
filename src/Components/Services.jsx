import React, { useState, useEffect, useRef } from 'react';

/**
 * Services Component
 * 
 * Displays key features and inclusions of the tour service.
 * Features:
 * - Animated entrance for service cards
 * - Hover effects for interactive details
 * - Responsive grid layout
 */

/**
 * Static Data: Service Inclusions
 * List of features provided in tour packages.
 */
const serviceData = [
  {
    title: "Luxury Transport",
    icon: "🚐",
    desc: "Premium AC Coasters & Grand Cabins for comfortable journeys.",
    color: "from-primary to-orange-500"
  },
  {
    title: "Medical Kit",
    icon: "🏥",
    desc: "First Aid & Emergency oxygen available on all tours.",
    color: "from-nature-green to-emerald-600"
  },
  {
    title: "Accommodations",
    icon: "🏨",
    desc: "Handpicked 3-star & 4-star hotels for your comfort.",
    color: "from-primary to-yellow-600"
  },
  {
    title: "Quality Food",
    icon: "🍲",
    desc: "Hygienic Breakfast, Lunch & Dinner included.",
    color: "from-nature-green to-teal-600"
  },
  {
    title: "Professional Guide",
    icon: "🚩",
    desc: "Expert local storytellers and experienced guides.",
    color: "from-primary to-orange-600"
  },
  {
    title: "Tolls & Taxes",
    icon: "🛣️",
    desc: "No hidden costs, all taxes and tolls covered.",
    color: "from-nature-green to-green-600"
  },
  {
    title: "Photography",
    icon: "📸",
    desc: "Capturing your precious memories digitally.",
    color: "from-primary to-yellow-500"
  },
  {
    title: "Camping Gear",
    icon: "⛺",
    desc: "High-quality tents and sleeping bags provided.",
    color: "from-nature-green to-emerald-500"
  }
];

export default function Services() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sectionRef = useRef(null);

  /**
   * Effect: Scroll Visibility
   * Triggers entrance animation when the section scrolls into view.
   */
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

  return (
    <section ref={sectionRef} id="services" className="py-20 lg:py-32 relative overflow-hidden bg-nature-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"
          alt="Services Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-nature-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-nature-black via-transparent to-nature-black" />
      </div>

      {/* Decorative Background Removed */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Premium Inclusions
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
            Everything We Provide
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            From transport to accommodation, we've got every aspect of your journey covered with our premium services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {serviceData.map((service, index) => (
            <div
              key={index}
              className={`group relative p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 transition-all duration-500 cursor-pointer overflow-hidden hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 75}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-3xl lg:text-4xl mb-6 transition-all duration-500 ${hoveredIndex === index
                  ? 'bg-white/20 scale-110 rotate-6 shadow-glow-primary'
                  : 'bg-white/5'
                  }`}>
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-bold text-base lg:text-lg mb-3 text-white group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h4>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {service.desc}
                </p>

                {/* Arrow Icon */}
                <div className={`mt-6 flex items-center gap-2 text-sm font-bold transition-all duration-500 ${hoveredIndex === index ? 'text-primary opacity-100 translate-x-0' : 'text-gray-600 opacity-0 -translate-x-4'
                  }`}>
                  <span>Details</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className={`mt-20 border-t border-white/10 pt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { number: "500+", label: "Happy Travelers", icon: "😊" },
            { number: "50+", label: "Destinations", icon: "📍" },
            { number: "100%", label: "Satisfaction", icon: "⭐" },
            { number: "24/7", label: "Support", icon: "💬" }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-4"
            >
              <p className="text-3xl lg:text-4xl font-black text-white mb-2">{stat.number}</p>
              <div className="flex items-center justify-center gap-2 text-primary font-medium text-sm lg:text-base uppercase tracking-wider">
                <span>{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}