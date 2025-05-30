
import Navigation from '@/components/Navigation';
import HeroBanner from '@/components/HeroBanner';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroBanner />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
