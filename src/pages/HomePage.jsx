import { useEffect } from 'react';
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import Testimonial from '../components/home/Testimonial';
import Footer from '../components/home/Footer';

const HomePage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default HomePage;

