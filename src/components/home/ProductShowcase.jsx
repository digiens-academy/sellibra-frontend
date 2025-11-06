import { useState, useEffect } from 'react';
import { FaPalette, FaHeart, FaStar, FaTshirt } from 'react-icons/fa';
import './ProductShowcase.css';

const ProductShowcase = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const products = [
    {
      id: 1,
      title: 'Minimal Tasarımlar',
      description: 'Sade ve şık minimal tişört tasarımları',
      image: '/example/2.jpg',
      icon: <FaTshirt />,
      category: 'Minimalist'
    },
    {
      id: 2,
      title: 'Sanatsal Desenler',
      description: 'Benzersiz sanatsal tişört koleksiyonları',
      image: '/example/1.jpg',
      icon: <FaPalette />,
      category: 'Sanatsal'
    },
    {
      id: 3,
      title: 'Trend Tasarımlar',
      description: 'En yeni trend tişört desenleri',
      image: '/example/3.jpg',
      icon: <FaStar />,
      category: 'Trend'
    },
    {
      id: 4,
      title: 'Sevimli Koleksiyonlar',
      description: 'Sevimli ve eğlenceli tişört tasarımları',
      image: '/example/4.jpg',
      icon: <FaHeart />,
      category: 'Sevimli'
    }
  ];

  const handleProductChange = (index) => {
    if (index !== activeProduct) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveProduct(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <section className="product-showcase-section">
      <div className="product-showcase-container">
        <div className="showcase-header">
          <h2 className="showcase-title">Tasarımın Ritmini <span>Sellibra</span> ile Yakala!</h2>
          <p className="showcase-subtitle">
            Kendi tasarımınızı yapın ve kendi markanızı yaratın
          </p>
        </div>
        
        <div className="product-carousel">
          <div className="product-display">
            <div className={`product-image-wrapper ${isAnimating ? 'animating' : ''}`}>
              <img 
                src={products[activeProduct].image} 
                alt={products[activeProduct].title}
                className="product-image"
              />
              <div className="product-overlay">
                <span className="product-category-badge">
                  {products[activeProduct].category}
                </span>
              </div>
            </div>
          </div>

          <div className="product-categories">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`product-category-card ${activeProduct === index ? 'active' : ''}`}
                onClick={() => handleProductChange(index)}
                onMouseEnter={() => handleProductChange(index)}
              >
                <div className="category-icon">{product.icon}</div>
                <div className="category-content">
                  <h3 className="category-title">{product.title}</h3>
                  <p className="category-description">{product.description}</p>
                </div>
                <div className="category-indicator">
                  {activeProduct === index && <div className="active-dot" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="showcase-progress">
          {products.map((_, index) => (
            <button
              key={index}
              className={`progress-dot ${activeProduct === index ? 'active' : ''}`}
              onClick={() => handleProductChange(index)}
              aria-label={`${index + 1}. ürüne git`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

