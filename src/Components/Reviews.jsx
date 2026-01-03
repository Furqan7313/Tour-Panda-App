import React, { useState, useEffect, useRef } from 'react';

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

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={sectionRef} id="reviews" className="py-20 lg:py-28 bg-gradient-to-b from-bg-light to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-nature-green/10 rounded-full blur-3xl" />
        {/* Quote mark decorations */}
        <div className="absolute top-20 left-10 text-9xl text-primary/5 font-serif select-none">"</div>
        <div className="absolute bottom-20 right-10 text-9xl text-nature-green/5 font-serif select-none rotate-180">"</div>
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 bg-primary rounded-full" />
            Testimonials
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-nature-green mb-4">What Our Travelers Say</h2>
          <p className="text-gray-500 text-lg">Real experiences from real adventurers who trusted TourPanda.pk</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`group relative bg-white p-8 rounded-3xl border border-gray-100 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${index === activeIndex ? 'ring-2 ring-primary shadow-xl shadow-primary/10' : ''
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-2 w-12 h-12 bg-gradient-to-br from-primary to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4 pt-2">
                {[...Array(5)].map((_, starIndex) => (
                  <svg
                    key={starIndex}
                    className={`w-5 h-5 transition-all duration-300 ${starIndex < item.rating
                        ? 'text-primary fill-primary'
                        : 'text-gray-200 fill-gray-200'
                      }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Tour Badge */}
              <span className="inline-block bg-nature-green/10 text-nature-green text-xs font-bold px-3 py-1 rounded-full mb-4">
                {item.tour}
              </span>

              {/* Testimonial Text */}
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                "{item.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-nature-black text-lg">{item.name}</h4>
                  <p className="text-gray-500 text-sm">{item.role}</p>
                </div>

                {/* Verified Badge */}
                <div className="ml-auto">
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className={`mt-16 flex flex-wrap justify-center items-center gap-8 lg:gap-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <p className="text-4xl font-black text-nature-green">4.9</p>
            <p className="text-gray-500 text-sm">Average Rating</p>
          </div>
          <div className="h-12 w-px bg-gray-200 hidden lg:block" />
          <div className="text-center">
            <p className="text-4xl font-black text-nature-green">500+</p>
            <p className="text-gray-500 text-sm">Happy Travelers</p>
          </div>
          <div className="h-12 w-px bg-gray-200 hidden lg:block" />
          <div className="text-center">
            <p className="text-4xl font-black text-nature-green">100%</p>
            <p className="text-gray-500 text-sm">Would Recommend</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-nature-green to-nature-green-light text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <span>Start Your Journey</span>
            <span className="text-xl">🚀</span>
          </a>
        </div>
      </div>
    </section>
  );
}