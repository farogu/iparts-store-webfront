import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductList from '@/components/ProductList';

const Catalog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Catálogo de Productos</h1>
          <p className="text-xl text-gray-300">Encuentra la pieza perfecta para tu iPhone</p>
        </div>
      </div>

      {/* Use the existing ProductList component that integrates with Shopify */}
      <ProductList />

      <Footer />
    </div>
  );
};

export default Catalog;
