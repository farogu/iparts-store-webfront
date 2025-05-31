
import Navigation from '@/components/Navigation';
import HeroBanner from '@/components/HeroBanner';
import ProductList from '@/components/ProductList';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroBanner />
      <ProductList />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
