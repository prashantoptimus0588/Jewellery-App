import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Hero = () => {
  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=2070&auto=format&fit=crop",
      tagline: "The Wedding Edit",
      title: "Timeless Elegance",
      description:
        "Discover the newest bridal collections by Vikas Jewellers. Masterfully crafted for your most unforgettable moments.",
      ctaText: "Explore Collection",
      ctaLink: "/products",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
      tagline: "Everyday Radiance",
      title: "Pure Gold Classics",
      description:
        "Lightweight, stunning 22k gold pieces designed for your everyday brilliance.",
      ctaText: "Shop Gold",
      ctaLink: "/products?category=gold",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070&auto=format&fit=crop",
      tagline: "New Arrivals",
      title: "The Diamond Aura",
      description:
        "Precision-cut diamonds set in pristine rose gold. Make a statement that lasts forever.",
      ctaText: "View Diamonds",
      ctaLink: "/products?category=diamond",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000); // Slightly longer for a more relaxed, elegant pace
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () =>
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () =>
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  const goToSlide = (index) => setCurrentSlide(index);

  // Swipe support for mobile
  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    setTouchStartX(null);
  };

  return (
    <section
      className="relative w-full h-[75vh] min-h-[500px] md:h-[90vh] bg-[#1a1a1a] overflow-hidden group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => {
        const isActive = currentSlide === index;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Image with subtle slow zoom (Ken Burns effect) */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              style={{
                transform: isActive ? "scale(1.05)" : "scale(1)",
                transition: "transform 6s ease-out",
              }}
            />

            {/* Refined Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent"></div>

            {/* Content Container */}
            <div className="absolute inset-0 container mx-auto px-6 md:px-12 flex flex-col justify-end md:justify-center items-center md:items-start pb-24 md:pb-0 z-10">
              <div
                className={`max-w-2xl text-center md:text-left transition-all duration-1000 delay-300 ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {/* Gold Accent Tagline */}
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <span className="hidden md:block w-12 h-[1px] bg-[#D4AF37]"></span>
                  <span className="uppercase tracking-[0.3em] text-xs sm:text-sm font-medium text-[#D4AF37]">
                    {slide.tagline}
                  </span>
                </div>

                {/* Elegant Typography */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white mb-4 md:mb-6 font-light leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>

                <p className="text-sm md:text-lg mb-8 font-light tracking-wide text-gray-200 line-clamp-3 md:line-clamp-none md:max-w-md mx-auto md:mx-0">
                  {slide.description}
                </p>

                {/* High-end minimalist CTA */}
                <Link
                  to={slide.ctaLink}
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm md:text-base font-medium tracking-widest text-white uppercase border border-white/50 overflow-hidden transition-all duration-500 hover:border-[#D4AF37]"
                >
                  <span className="absolute inset-0 w-full h-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></span>
                  <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                    {slide.ctaText}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Minimalist Nav Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white border border-white/0 hover:border-white/30 rounded-full opacity-0 md:group-hover:opacity-100 transition-all duration-500 z-20 backdrop-blur-sm"
      >
        <FaChevronLeft className="w-4 h-4 font-light" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white border border-white/0 hover:border-white/30 rounded-full opacity-0 md:group-hover:opacity-100 transition-all duration-500 z-20 backdrop-blur-sm"
      >
        <FaChevronRight className="w-4 h-4" />
      </button>

      {/* Progress Line Indicators (More modern than dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="group py-2"
          >
            <div
              className={`transition-all duration-500 h-[2px] ${
                currentSlide === index
                  ? "w-8 md:w-12 bg-[#D4AF37]"
                  : "w-4 md:w-6 bg-white/40 group-hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;