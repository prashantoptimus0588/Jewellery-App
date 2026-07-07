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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () =>
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () =>
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] bg-[#2a1314] overflow-hidden group">
      <div
        className="flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 container mx-auto px-6 flex flex-col justify-center items-start z-10">
              <div className="max-w-xl text-white">
                <span className="uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-4 block text-gray-300">
                  {slide.tagline}
                </span>
                <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-10 font-light tracking-wide text-gray-200">
                  {slide.description}
                </p>
                <Link
                  to={slide.ctaLink}
                  className="inline-block bg-white text-[#832729] font-medium px-10 py-4 rounded-sm hover:bg-[#832729] hover:text-white transition-all duration-300 shadow-lg"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#832729] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
      >
        <FaChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#832729] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
      >
        <FaChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "w-8 h-2 bg-[#832729]"
                : "w-2 h-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
