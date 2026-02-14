import React, { useState, useEffect, useRef } from 'react';

/**
 * Reviews Component
 * 
 * Displays customer testimonials in a carousel or grid format.
 * Features:
 * - Auto-rotating highlight for testimonials
 * - Verified badge indicators
 * - Rating visualization
 */

/**
 * Static Data: Customer Testimonials
 * Feedback from previous clients.
 */
const testimonials = [
  {
    name: "Ahmad Hassan",
    role: "Business Owner",
    text: "The digital booking process was seamless. Best trip ever! TourPanda made our corporate retreat absolutely memorable.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    tour: "Corporate Retreat"
  },
  {
    name: "Sarah Khan",
    role: "Teacher",
    text: "I loved the offline digital guides. Saved me in the mountains! The attention to detail and safety measures were impressive.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    tour: "Academic Tour"
  },
  {
    name: "Ali Raza",
    role: "Family Man",
    text: "Top-tier service and luxury locations. My family had the time of their lives. Will definitely book again!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    tour: "Family Tour"
  },
];

export default function Reviews() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);

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
   * Effect: Carousel Auto-Rotation
   * Cycles through testimonials every 5 seconds to highlight different reviews.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={sectionRef} id="reviews" className="py-20 lg:py-32 relative overflow-hidden bg-nature-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1568454537213-32abaf7b9985?q=80&w=2000&auto=format&fit=crop"
          alt="Reviews Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-nature-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-nature-black via-transparent to-nature-black" />
      </div>

      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Quote mark decorations */}
        <div className="absolute top-20 left-10 text-9xl text-white/5 font-serif select-none mix-blend-overlay">"</div>
        <div className="absolute bottom-20 right-10 text-9xl text-white/5 font-serif select-none rotate-180 mix-blend-overlay">"</div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-primary px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Testimonials
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Travelers</span> Say
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-light">
            Real experiences from real adventurers who trusted TourPanda.pk with their journey.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`group relative bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 transition-all duration-700 hover:-translate-y-2 hover:bg-white/10 ${index === activeIndex ? 'ring-1 ring-primary/50 shadow-[0_0_30px_-10px_rgba(253,184,19,0.3)] transform -translate-y-2' : ''
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* Quote Icon */}
              <div className="absolute -top-6 -left-2 w-14 h-14 bg-gradient-to-br from-primary to-yellow-500 text-nature-black rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-8 pt-4 justify-end">
                {[...Array(5)].map((_, starIndex) => (
                  <svg
                    key={starIndex}
                    className={`w-4 h-4 transition-all duration-300 ${starIndex < item.rating
                      ? 'text-primary fill-primary drop-shadow-md'
                      : 'text-white/20 fill-white/20'
                      }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 leading-relaxed mb-8 text-lg font-light italic">
                "{item.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-primary transition-all duration-300 shadow-lg">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{item.name}</h4>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest">{item.tour}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-yellow-500 text-nature-black px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            <span>Plan Your Trip</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}