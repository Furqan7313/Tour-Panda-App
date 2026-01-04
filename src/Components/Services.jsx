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
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Medical Kit",
    icon: "🏥",
    desc: "First Aid & Emergency oxygen available on all tours.",
    color: "from-red-500 to-rose-600"
  },
  {
    title: "Accommodations",
    icon: "🏨",
    desc: "Handpicked 3-star & 4-star hotels for your comfort.",
    color: "from-purple-500 to-violet-600"
  },
  {
    title: "Quality Food",
    icon: "🍲",
    desc: "Hygienic Breakfast, Lunch & Dinner included.",
    color: "from-orange-500 to-amber-600"
  },
  {
    title: "Professional Guide",
    icon: "🚩",
    desc: "Expert local storytellers and experienced guides.",
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "Tolls & Taxes",
    icon: "🛣️",
    desc: "No hidden costs, all taxes and tolls covered.",
    color: "from-cyan-500 to-teal-600"
  },
  {
    title: "Photography",
    icon: "📸",
    desc: "Capturing your precious memories digitally.",
    color: "from-pink-500 to-rose-600"
  },
  {
    title: "Camping Gear",
    icon: "⛺",
    desc: "High-quality tents and sleeping bags provided.",
    color: "from-yellow-500 to-orange-600"
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
    <section ref={sectionRef} id="services" className="py-20 lg:py-28 bg-gradient-to-b from-white to-bg-light relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-nature-green/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Premium Inclusions
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-nature-green mb-4">
            Everything We Provide
          </h2>
          <p className="text-gray-500 text-lg">
            From transport to accommodation, we've got every aspect of your journey covered
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {serviceData.map((service, index) => (
            <div
              key={index}
              className={`group relative p-6 lg:p-8 bg-white rounded-3xl border border-gray-100 transition-all duration-500 cursor-pointer overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 75}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Decorative Circle */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150" />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-3xl lg:text-4xl mb-4 lg:mb-6 transition-all duration-500 ${hoveredIndex === index
                  ? 'bg-white/20 scale-110 rotate-6'
                  : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </span>
                </div>

                {/* Title */}
                <h4 className={`font-bold text-base lg:text-lg mb-2 transition-colors duration-500 ${hoveredIndex === index ? 'text-white' : 'text-nature-green'
                  }`}>
                  {service.title}
                </h4>

                {/* Description */}
                <p className={`text-sm leading-relaxed transition-colors duration-500 ${hoveredIndex === index ? 'text-white/80' : 'text-gray-500'
                  }`}>
                  {service.desc}
                </p>

                {/* Arrow Icon */}
                <div className={`mt-4 flex items-center gap-1 text-sm font-bold transition-all duration-500 ${hoveredIndex === index ? 'text-white opacity-100 translate-x-0' : 'text-primary opacity-0 -translate-x-4'
                  }`}>
                  <span>Learn more</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className={`mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { number: "500+", label: "Happy Travelers", icon: "😊" },
            { number: "50+", label: "Destinations", icon: "📍" },
            { number: "100%", label: "Satisfaction", icon: "⭐" },
            { number: "24/7", label: "Support", icon: "💬" }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-2xl lg:text-3xl font-black text-nature-green">{stat.number}</p>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}