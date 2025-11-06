import { useState, useEffect } from 'react';
import '../../styles/components/_floatingPriceButton.scss';

const FloatingPriceButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToPricing = () => {
    const element = document.getElementById('pricing-comparison');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      className={`floating-price-button ${isVisible ? 'visible' : ''}`}
      onClick={scrollToPricing}
      aria-label="En Uygun Fiyat"
    >
      <span className="floating-price-button__word">EN</span>
      <span className="floating-price-button__word">UYGUN</span>
      <span className="floating-price-button__word">FİYAT</span>
    </button>
  );
};

export default FloatingPriceButton;

