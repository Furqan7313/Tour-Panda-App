import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

/**
 * Gallery Component
 * 
 * Displays a carousel of media items (photos, videos, reels).
 * Features:
 * - Real-time updates from Firebase
 * - Infinite auto-scroll carousel
 * - Lightbox view with keyboard navigation
 * - Responsive grid layout
 */

// Placeholder templates - shown when gallery is empty
const placeholderTemplates = [
  { id: 'ph-1', title: 'Awaiting Media', location: 'Gallery Item 1', type: 'photo' },
  { id: 'ph-2', title: 'Awaiting Media', location: 'Gallery Item 2', type: 'video' },
  { id: 'ph-3', title: 'Awaiting Media', location: 'Gallery Item 3', type: 'photo' },
  { id: 'ph-4', title: 'Awaiting Media', location: 'Gallery Item 4', type: 'reel' },
  { id: 'ph-5', title: 'Awaiting Media', location: 'Gallery Item 5', type: 'photo' },
  { id: 'ph-6', title: 'Awaiting Media', location: 'Gallery Item 6', type: 'video' },
];

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const autoScrollInterval = useRef(null);

  // Fetch gallery items from Firebase
  useEffect(() => {
    const galleryQ = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(galleryQ, (snap) => {
      const firebaseItems = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setGalleryItems(firebaseItems);
      setLoading(false);
    }, (error) => {
      console.log("Gallery error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Visibility observer
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

  // Determine what to display
  const displayItems = galleryItems.length > 0 ? galleryItems : placeholderTemplates;
  const isShowingPlaceholders = galleryItems.length === 0;
  const itemsPerView = 3;
  const totalSlides = Math.ceil(displayItems.length / itemsPerView);

  /**
   * Auto-scroll Logic
   * Advances the carousel slide index.
   * Handles wrapping around to the first slide.
   */
  const goToNextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-scroll timer (5 seconds)
  useEffect(() => {
    if (!isPaused && displayItems.length > itemsPerView) {
      autoScrollInterval.current = setInterval(() => {
        goToNextSlide();
      }, 5000);
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isPaused, displayItems.length, goToNextSlide]);

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedItem) return;
      if (e.key === 'Escape') setSelectedItem(null);
      if (e.key === 'ArrowRight') navigateNext();
      if (e.key === 'ArrowLeft') navigatePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, selectedIndex]);

  /**
   * Opens the full-screen media viewer.
   * Ignores placeholder items.
   */
  const openLightbox = (item, index) => {
    if (item.id?.startsWith('ph-')) return;
    setSelectedItem(item);
    setSelectedIndex(index);
  };

  const navigateNext = () => {
    if (galleryItems.length === 0) return;
    const nextIndex = (selectedIndex + 1) % galleryItems.length;
    setSelectedIndex(nextIndex);
    setSelectedItem(galleryItems[nextIndex]);
  };

  const navigatePrev = () => {
    if (galleryItems.length === 0) return;
    const prevIndex = (selectedIndex - 1 + galleryItems.length) % galleryItems.length;
    setSelectedIndex(prevIndex);
    setSelectedItem(galleryItems[prevIndex]);
  };

  // Get media type icon
  const getMediaIcon = (type) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        );
      case 'reel':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 animate-pulse"
          style={{ aspectRatio: '16/10' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        </div>
      ))}
    </div>
  );

  // Render individual gallery item
  const renderGalleryItem = (item, index) => {
    const isPlaceholder = item.id?.startsWith('ph-') || isShowingPlaceholders;
    const mediaType = item.type || 'photo';

    return (
      <div
        key={item.id || index}
        onClick={() => openLightbox(item, index)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`group relative overflow-hidden rounded-[2rem] transition-all duration-500 flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${isPlaceholder ? 'cursor-default' : 'cursor-pointer hover:shadow-[0_10px_40px_-10px_rgba(253,184,19,0.2)] hover:-translate-y-2'
          } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ aspectRatio: '16/10' }}
      >
        {isPlaceholder ? (
          /* Placeholder Design */
          <>
            <div className="absolute inset-0 bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <div className="absolute inset-4 border-2 border-dashed border-white/10 rounded-[1.5rem] group-hover:border-primary/50 transition-colors duration-500" />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform backdrop-blur-md border border-white/10">
                <span className="text-gray-400 group-hover:text-primary transition-colors">
                  {getMediaIcon(mediaType)}
                </span>
              </div>
              <p className="text-gray-300 font-bold text-sm tracking-wide">{item.location}</p>
              <span className="mt-3 text-[10px] font-bold px-3 py-1 bg-white/10 text-primary border border-primary/20 rounded-full capitalize">
                {mediaType}
              </span>
            </div>
          </>
        ) : (
          /* Actual Media */
          <>
            {mediaType === 'video' || mediaType === 'reel' ? (
              <video
                src={item.url}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
              />
            ) : (
              <img
                src={item.url}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={item.title}
                loading="lazy"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-nature-black/90 via-nature-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* Media Type Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-1.5 shadow-lg">
              <span className="text-primary">{getMediaIcon(mediaType)}</span>
              <span className="text-xs font-bold text-white capitalize">{mediaType}</span>
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{item.location}</span>
              </div>
              <h4 className="text-white font-bold text-xl leading-tight">{item.title}</h4>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 pointer-events-none">
              <span className="bg-primary/90 text-nature-black px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 text-sm backdrop-blur-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View Content
              </span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <section ref={sectionRef} id="gallery" className="py-20 lg:py-32 relative overflow-hidden bg-nature-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519681393798-3828fb4090bb?q=80&w=2000&auto=format&fit=crop"
          alt="Gallery Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-nature-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-nature-black via-transparent to-nature-black" />
      </div>

      {/* Decorative Elements Removed */}

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-primary px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Visual Journey
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            Our Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Gallery</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-light">
            {galleryItems.length > 0
              ? "Immerse yourself in the breathtaking landscapes and vibrant culture of Pakistan through our lens."
              : "Amazing travel moments coming soon"
            }
          </p>

          {/* Media count badges */}
          {galleryItems.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {['photo', 'video', 'reel'].map(type => {
                const count = galleryItems.filter(item => (item.type || 'photo') === type).length;
                if (count === 0) return null;
                return (
                  <div key={type} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md transition-all hover:bg-white/10 hover:border-primary/30">
                    <span className="text-primary">{getMediaIcon(type)}</span>
                    <span className="text-sm font-bold text-gray-200 capitalize">{count} {type}{count > 1 ? 's' : ''}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Content based on state */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Arrows */}
              {displayItems.length > itemsPerView && (
                <>
                  <button
                    onClick={() => { goToPrevSlide(); setIsPaused(true); setTimeout(() => setIsPaused(false), 10000); }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-14 h-14 bg-nature-black/50 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-nature-black hover:border-primary transition-all duration-300 hover:scale-110 shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { goToNextSlide(); setIsPaused(true); setTimeout(() => setIsPaused(false), 10000); }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-14 h-14 bg-nature-black/50 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-nature-black hover:border-primary transition-all duration-300 hover:scale-110 shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Carousel Track */}
              <div className="overflow-hidden rounded-3xl" ref={carouselRef}>
                <div
                  className="flex gap-6 transition-transform duration-700 ease-out py-4 px-2"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {displayItems.map((item, index) => renderGalleryItem(item, index))}
                </div>
              </div>

              {/* Pagination Dots */}
              {totalSlides > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(totalSlides)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => { goToSlide(index); setIsPaused(true); setTimeout(() => setIsPaused(false), 10000); }}
                      className={`transition-all duration-300 rounded-full ${currentSlide === index
                        ? 'w-10 h-2 bg-primary shadow-[0_0_10px_rgba(253,184,19,0.5)]'
                        : 'w-2 h-2 bg-white/20 hover:bg-primary/50'
                        }`}
                    />
                  ))}
                </div>
              )}

              {/* Auto-scroll indicator */}
              {displayItems.length > itemsPerView && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${isPaused
                      ? 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                      : 'bg-primary/10 border-primary/20 text-primary'
                      }`}
                  >
                    {isPaused ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Resume Auto-scroll
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 relative">
                          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                        Auto-scrolling (5s)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* CTA for Placeholders */}
            {isShowingPlaceholders && (
              <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-[2rem] p-8 md:p-12 inline-block max-w-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="text-2xl font-bold text-white mb-4">Capturing the Magic</h4>
                  <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                    Our team is currently on location capturing stunning photos, videos & reels from Pakistan's most beautiful destinations. Follow our social media for daily updates!
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a
                      href="https://www.instagram.com/tourpanda_official/"
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Follow on Instagram
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[200] bg-nature-black/98 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:rotate-90 border border-white/10"
            onClick={() => setSelectedItem(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {galleryItems.length > 1 && (
            <>
              <button
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:-translate-x-1"
                onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:translate-x-1"
                onClick={(e) => { e.stopPropagation(); navigateNext(); }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div
            className="max-w-6xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {(selectedItem.type === 'video' || selectedItem.type === 'reel') ? (
              <video
                src={selectedItem.url}
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                controls
                autoPlay
              />
            ) : (
              <img
                src={selectedItem.url}
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                alt={selectedItem.title}
              />
            )}

            <div className="mt-8 text-center text-white animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full mb-4 backdrop-blur-md">
                <span className="text-primary">{getMediaIcon(selectedItem.type || 'photo')}</span>
                <span className="text-sm font-bold capitalize tracking-wide">{selectedItem.type || 'photo'}</span>
              </div>
              <h3 className="text-3xl font-black mb-2">{selectedItem.title}</h3>
              <p className="text-gray-400 flex items-center justify-center gap-2 text-lg">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {selectedItem.location}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}