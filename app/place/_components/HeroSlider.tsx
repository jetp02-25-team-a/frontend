import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroImages } from '../lib/fixtures';

const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[400px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={heroImages[current].id}
          src={heroImages[current].url}
          alt="hero"
          className="absolute w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <p className="text-white text-3xl md:text-4xl font-semibold tracking-widest drop-shadow-lg">
          {heroImages[current].caption}
        </p>
      </div>
    </div>
  );
};

export default HeroSlider;
