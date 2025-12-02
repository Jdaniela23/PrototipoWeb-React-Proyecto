// useScrollToTop.js
import { useState, useEffect } from 'react';

export const useScrollToTop = (threshold = 100) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > threshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    toggleVisibility(); // Comprueba al inicio
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return { isVisible, scrollToTop };
};