import { useEffect } from "react";
import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import ProductShowcase from "../components/home/ProductShowcase";
import EtsyInfo from "../components/home/EtsyInfo";
import SellibraFeatures from "../components/home/SellibraFeatures";
import PricingComparison from "../components/home/PricingComparison";
import Testimonial from "../components/home/Testimonial";
import Footer from "../components/home/Footer";
import FloatingPriceButton from "../components/home/FloatingPriceButton";

const HomePage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <div className="home-content-container">
        <div className="home-content-grid">
          <PricingComparison />
          <ProductShowcase />
          <SellibraFeatures />
          <EtsyInfo />
          <Testimonial />
        </div>
      </div>
      <Footer />
      <FloatingPriceButton />
    </div>
  );
};

export default HomePage;
