import React from 'react';
import '../../styles/components/PricingComparison.scss';

const PricingComparison = () => {
  const products = [
    {
      id: 1,
      name: 'Comfort Colors 1717',
      image: '/tshirts/ComfortColors1717.webp',
      description: 'Premium kaliteli, yumuşak dokuya sahip comfort fit tişört',
      prices: {
        sellibra: 9,
        printful: 13.75,
        printify: 12.41,
        gelato: 14.95
      }
    },
    {
      id: 2,
      name: 'Bella Canvas 3001',
      image: '/tshirts/Bellacanvas3001.jpg',
      description: 'Soft, hafif ve modern fit yapıya sahip premium tişört',
      prices: {
        sellibra: 7.5,
        printful: 12.25,
        printify: 11.29,
        gelato: 10.42
      }
    },
    {
      id: 3,
      name: 'Gildan 18000',
      image: '/tshirts/Gildan18000.jpg',
      description: 'Dayanıklı, klasik kesim ve ekonomik sweatshirt',
      prices: {
        sellibra: 9.75,
        printful: 17.25,
        printify: 17.97,
        gelato: 16.47
      }
    }
  ];

  const calculateSavings = (sellibraPrice, competitorPrices) => {
    const avgCompetitorPrice = (competitorPrices.printful + competitorPrices.printify + competitorPrices.gelato) / 3;
    const savingsPercent = ((avgCompetitorPrice - sellibraPrice) / avgCompetitorPrice * 100).toFixed(0);
    return savingsPercent;
  };

  return (
    <section className="pricing-comparison">
      <div className="pricing-comparison__container">
        <div className="pricing-comparison__header">
          <h2 className="pricing-comparison__title">
            Fiyat Avantajımızı Keşfedin
          </h2>
          <p className="pricing-comparison__subtitle">
            <span>Sellibra</span> ile diğer platformlara göre çok daha uygun fiyatlarla kaliteli ürünlere ulaşın
          </p>
        </div>

        <div className="pricing-comparison__grid">
          {products.map((product) => {
            const savings = calculateSavings(product.prices.sellibra, product.prices);
            return (
              <div key={product.id} className="pricing-card">
                <div className="pricing-card__image-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="pricing-card__image"
                  />
                  <div className="pricing-card__badge">
                    %{savings} Tasarruf
                  </div>
                </div>

                <div className="pricing-card__content">
                  <h3 className="pricing-card__name">{product.name}</h3>
                  <p className="pricing-card__description">{product.description}</p>

                  <div className="pricing-card__prices">
                    <div className="price-item price-item--featured">
                      <span className="price-item__label">Sellibra</span>
                      <span className="price-item__value">${product.prices.sellibra}</span>
                    </div>
                    
                    <div className="price-item">
                      <span className="price-item__label"><del>Printful</del></span>
                      <span className="price-item__value"><del>${product.prices.printful}</del></span>
                    </div>
                    
                    <div className="price-item">
                      <span className="price-item__label"><del>Printify</del></span>
                      <span className="price-item__value"><del>${product.prices.printify}</del></span>
                    </div>
                    
                    <div className="price-item">
                      <span className="price-item__label"><del>Gelato</del></span>
                      <span className="price-item__value"><del>${product.prices.gelato}</del></span>
                    </div>
                  </div>

                  <div className="pricing-card__footer">
                    <div className="pricing-card__saving">
                      <svg 
                        className="pricing-card__icon" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      <span>En Uygun Fiyat Garantisi</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;

