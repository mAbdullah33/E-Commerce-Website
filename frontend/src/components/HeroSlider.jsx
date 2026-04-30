import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=80',
    badge: 'New Collection 2025',
    headline: 'Transform Your Walls',
    subHeadline: 'Premium PVC Panels',
    description: 'Elegant, durable, and waterproof wall panels for every interior.',
    cta: { label: 'Shop PVC Panels', to: '/products/pvc-panels' },
    ctaSecondary: { label: 'View Hot Sale', to: '/hot-sale' },
    accent: 'from-amber-600 to-orange-500',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1400&q=80',
    badge: '🔥 Up to 30% Off',
    headline: 'Hot Sale Designs',
    subHeadline: 'Limited Time Offer',
    description: 'Grab our most popular designs at unbeatable prices. Stock limited!',
    cta: { label: 'Grab the Deal', to: '/hot-sale' },
    ctaSecondary: { label: 'All Products', to: '/products/pvc-panels' },
    accent: 'from-rose-600 to-pink-500',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80',
    badge: 'Premium Quality',
    headline: 'Hard Panels',
    subHeadline: 'Commercial Grade',
    description: 'Extra-durable hard panels engineered for commercial and residential use.',
    cta: { label: 'Shop Hard Panels', to: '/products/hard-panels' },
    ctaSecondary: { label: 'Learn More', to: '/' },
    accent: 'from-slate-700 to-gray-600',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] max-h-[780px] overflow-hidden bg-gray-900">
      {/* Background image with overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
        key={slide.id}
      >
        <img
          src={slide.image}
          alt={slide.headline}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className={`relative z-10 h-full flex items-center transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            {/* Badge */}
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${slide.accent} mb-4 tracking-wider uppercase`}>
              {slide.badge}
            </span>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {slide.headline}
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-4">
              {slide.subHeadline}
            </h2>

            {/* Description */}
            <p className="text-gray-200 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to={slide.cta.to}
                className={`px-7 py-3.5 bg-gradient-to-r ${slide.accent} text-white font-bold rounded-xl hover:opacity-90 transition-all hover:scale-105 shadow-lg text-sm sm:text-base`}
              >
                {slide.cta.label}
              </Link>
              <Link
                to={slide.ctaSecondary.to}
                className="px-7 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm sm:text-base"
              >
                {slide.ctaSecondary.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2.5 bg-amber-400' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-20 text-white/60 text-sm font-mono">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}