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
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
          style={{ aspectRatio: '16/10' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
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
        className={`group relative overflow-hidden rounded-2xl transition-all duration-500 flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${isPlaceholder ? 'cursor-default' : 'cursor-pointer hover:shadow-2xl hover:-translate-y-1'
          } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ aspectRatio: '16/10' }}
      >
        {isPlaceholder ? (
          /* Placeholder Design */
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <div className="absolute inset-4 border-2 border-dashed border-gray-200 rounded-xl group-hover:border-nature-green/30 transition-colors duration-500" />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-gray-400 group-hover:text-nature-green transition-colors">
                  {getMediaIcon(mediaType)}
                </span>
              </div>
              <p className="text-gray-500 font-bold text-sm">{item.location}</p>
              <span className="mt-2 text-[10px] font-bold px-3 py-1 bg-gray-100 text-gray-400 rounded-full capitalize">
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

            <div className="absolute inset-0 bg-gradient-to-t from-nature-black/80 via-nature-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* Media Type Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-lg">
              <span className="text-nature-green">{getMediaIcon(mediaType)}</span>
              <span className="text-xs font-bold text-nature-black capitalize">{mediaType}</span>
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{item.location}</span>
              </div>
              <h4 className="text-white font-bold text-lg">{item.title}</h4>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
              <span className="bg-white/95 backdrop-blur-sm text-nature-green px-5 py-2.5 rounded-full font-bold shadow-xl flex items-center gap-2 text-sm hover:bg-primary hover:text-white transition-colors duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View {mediaType === 'photo' ? 'Photo' : 'Video'}
              </span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <section ref={sectionRef} id="gallery" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nature-green/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-nature-green/10 text-nature-green px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 bg-nature-green rounded-full animate-pulse" />
            Visual Journey
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-nature-green mb-4">Our Travel Gallery</h2>
          <p className="text-gray-500 text-lg">
            {galleryItems.length > 0
              ? "Photos, videos & reels from breathtaking destinations"
              : "Amazing travel moments coming soon"
            }
          </p>

          {/* Media count badges */}
          {galleryItems.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              {['photo', 'video', 'reel'].map(type => {
                const count = galleryItems.filter(item => (item.type || 'photo') === type).length;
                if (count === 0) return null;
                return (
                  <div key={type} className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-100">
                    <span className="text-nature-green">{getMediaIcon(type)}</span>
                    <span className="text-sm font-bold text-nature-black">{count} {type}{count > 1 ? 's' : ''}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-primary rounded-full" />
            <div className="h-1.5 w-6 bg-primary rounded-full" />
            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-primary rounded-full" />
          </div>
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
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-nature-green hover:bg-nature-green hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { goToNextSlide(); setIsPaused(true); setTimeout(() => setIsPaused(false), 10000); }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-nature-green hover:bg-nature-green hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Carousel Track */}
              <div className="overflow-hidden rounded-2xl" ref={carouselRef}>
                <div
                  className="flex gap-6 transition-transform duration-700 ease-out"
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
                        ? 'w-8 h-2 bg-nature-green'
                        : 'w-2 h-2 bg-gray-300 hover:bg-nature-green/50'
                        }`}
                    />
                  ))}
                </div>
              )}

              {/* Auto-scroll indicator */}
              {displayItems.length > itemsPerView && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isPaused
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-nature-green/10 text-nature-green'
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
                          <div className="absolute inset-0 border-2 border-nature-green border-t-transparent rounded-full animate-spin" />
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
              <div className={`mt-10 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-gradient-to-br from-nature-green/5 to-primary/5 rounded-2xl p-6 md:p-8 inline-block max-w-xl border border-nature-green/10">
                  <p className="text-gray-600 mb-4">
                    Our team is capturing stunning photos, videos & reels from Pakistan's beautiful destinations.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a
                      href="https://www.instagram.com/tourpanda_official/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-lg transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Follow Our Journey
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
          className="fixed inset-0 z-[200] bg-nature-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
            onClick={() => setSelectedItem(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {galleryItems.length > 1 && (
            <>
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
            </>
          )}

          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {(selectedItem.type === 'video' || selectedItem.type === 'reel') ? (
              <video
                src={selectedItem.url}
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
                controls
                autoPlay
              />
            ) : (
              <img
                src={selectedItem.url}
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
                alt={selectedItem.title}
              />
            )}

            <div className="mt-6 text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-3">
                <span>{getMediaIcon(selectedItem.type || 'photo')}</span>
                <span className="text-sm font-bold capitalize">{selectedItem.type || 'photo'}</span>
              </div>
              <h3 className="text-2xl font-bold">{selectedItem.title}</h3>
              <p className="text-white/60 flex items-center justify-center gap-2 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {selectedItem.location}
              </p>
              <p className="text-white/40 text-sm mt-2">
                {selectedIndex + 1} of {galleryItems.length}
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
      `}</style>
    </section>
  );
}