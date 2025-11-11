'use client';

import { useState } from 'react';

export function useCarousel(
  step: number,
  numCards: number,
  cardFullSize: number
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const moveCarousel = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const maxIndex = numCards > 0 ? numCards - 1 : 0;
      setCurrentIndex((prev) => Math.min(prev + step, maxIndex));
    } else {
      setCurrentIndex((prev) => Math.max(prev - step, 0));
    }
  };

  const translateX = currentIndex * cardFullSize;
  const isAtStart = currentIndex === 0;
  // const isAtEnd = currentIndex >= numCards - 1;
  const maxIndex = Math.max(0, numCards - step);
  const isAtEnd = currentIndex >= maxIndex;

  return { currentIndex, moveCarousel, translateX, isAtStart, isAtEnd };
}
