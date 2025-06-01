
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PromoBanner from './PromoBanner';
import CartButton from './CartButton';
import Logo from './navigation/Logo';
import ProductsMenu from './navigation/ProductsMenu';
import SearchBar from './navigation/SearchBar';
import MobileMenu from './navigation/MobileMenu';

interface NavigationProps {
  onProductsClick?: () => void;
  onSearchGlobal?: (query: string) => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  currentStep?: 'models' | 'parts' | 'products';
}

const Navigation = ({ 
  onProductsClick, 
  onSearchGlobal, 
  showBackButton = false, 
  onBackClick,
  currentStep 
}: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = [
    'Pantallas',
    'Baterías', 
    'Carcasas',
    'Cámaras',
    'Botones',
    'Altavoces'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearchGlobal) {
        onSearchGlobal(searchQuery.trim());
      } else {
        navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearchGlobal && e.target.value.length > 2) {
      onSearchGlobal(e.target.value);
    }
  };

  const handleProductsClick = () => {
    if (onProductsClick) {
      onProductsClick();
    } else {
      navigate('/productos');
    }
  };

  return (
    <>
      <PromoBanner />
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Logo showBackButton={showBackButton} onBackClick={onBackClick} />

            {/* Desktop Navigation - Productos */}
            <div className="hidden md:block">
              <ProductsMenu 
                onProductsClick={handleProductsClick}
                currentStep={currentStep}
                categories={categories}
              />
            </div>

            {/* Global Search Bar */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-lg mx-8">
              <SearchBar onSearchGlobal={onSearchGlobal} />
            </div>

            {/* Desktop Navigation - Contacto */}
            <div className="hidden md:block">
              <a href="/contact" className="text-gray-900 hover:text-electric-blue px-3 py-2 text-sm font-medium transition-colors">
                Contacto
              </a>
            </div>

            {/* Cart and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <CartButton />
              <MobileMenu
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                handleSearchChange={handleSearchChange}
                handleProductsClick={handleProductsClick}
                categories={categories}
                showBackButton={showBackButton}
                onBackClick={onBackClick}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
