import React, { useState, useEffect, useRef } from 'react';

const galleryImages = [
  { url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80", title: "Northern Areas", location: "Hunza Valley" },
  { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80", title: "Misty Mountains", location: "Naran Kaghan" },
  { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80", title: "Forest Trails", location: "Fairy Meadows" },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80", title: "Alpine Lakes", location: "Shogran" },
  { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", title: "Lake Views", location: "Saif ul Malook" },
  { url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80", title: "River Side", location: "Swat Valley" },
];

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImg) return;
      if (e.key === 'Escape') setSelectedImg(null);
      if (e.key === 'ArrowRight') navigateNext();
      if (e.key === 'ArrowLeft') navigatePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImg, selectedIndex]);

  const openLightbox = (img, index) => {
    setSelectedImg(img);
    setSelectedIndex(index);
  };

  const navigateNext = () => {
    const nextIndex = (selectedIndex + 1) % galleryImages.length;
    setSelectedIndex(nextIndex);
    setSelectedImg(galleryImages[nextIndex]);
  };

  const navigatePrev = () => {
    const prevIndex = (selectedIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedIndex(prevIndex);
    setSelectedImg(galleryImages[prevIndex]);
  };

  return (
    <section ref={sectionRef} id="gallery" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-nature-green/10 text-nature-green px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 bg-nature-green rounded-full" />
            Visual Journey
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-nature-green mb-4">Our Travel Gallery</h2>
          <p className="text-gray-500 text-lg">Glimpses of breathtaking destinations captured by our travelers</p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-primary rounded-full" />
            <div className="h-1.5 w-6 bg-primary rounded-full" />
            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-primary rounded-full" />
          </div>
        </div>

        {/* Gallery Grid - Masonry-like Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              onClick={() => openLightbox(img, index)}
              className={`group relative cursor-pointer overflow-hidden rounded-3xl shadow-lg transition-all duration-700 ${index === 0 || index === 5 ? 'lg:row-span-1' : ''
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${index * 100}ms`,
                aspectRatio: index === 0 || index === 3 ? '4/5' : '4/3'
              }}
            >
              {/* Image */}
              <img
                src={img.url}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={img.title}
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-nature-black/80 via-nature-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{img.location}</span>
                </div>
                <h4 className="text-white font-bold text-xl">{img.title}</h4>
              </div>

              {/* View Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                <span className="bg-white/95 backdrop-blur-sm text-nature-green px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-primary hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  View Full Image
                </span>
              </div>

              {/* Corner Badge */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                <span className="text-nature-green font-bold text-sm">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button className="group inline-flex items-center gap-3 bg-bg-light hover:bg-nature-green text-nature-green hover:text-white px-8 py-4 rounded-full font-bold transition-all duration-300 border-2 border-nature-green/20 hover:border-nature-green">
            <span>View Full Gallery</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Enhanced Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[200] bg-nature-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-up"
          onClick={() => setSelectedImg(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
            onClick={() => setSelectedImg(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Arrows */}
          <button
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            onClick={(e) => { e.stopPropagation(); navigateNext(); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Container */}
          <div
            className="max-w-5xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImg.url}
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              alt={selectedImg.title}
            />

            {/* Image Info */}
            <div className="mt-6 text-center text-white">
              <h3 className="text-2xl font-bold">{selectedImg.title}</h3>
              <p className="text-white/60 flex items-center justify-center gap-2 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {selectedImg.location}
              </p>
              <p className="text-white/40 text-sm mt-2">
                {selectedIndex + 1} of {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}