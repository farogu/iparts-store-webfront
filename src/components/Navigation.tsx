
import { useState } from 'react';
import { Search, Menu, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import PromoBanner from './PromoBanner';
import CartButton from './CartButton';

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
            {/* Logo y botón de retroceso */}
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackClick}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="flex-shrink-0 flex items-center">
                <a href="/" className="flex items-center">
                  <h1 className="text-xl md:text-2xl font-bold text-black">
                    i<span className="text-electric-blue">Parts</span> Store
                  </h1>
                </a>
              </div>
            </div>

            {/* Desktop Navigation - Productos */}
            <div className="hidden md:block">
              <div className="relative group">
                <button 
                  className="text-gray-900 hover:text-electric-blue px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                  onClick={handleProductsClick}
                >
                  Productos
                  {currentStep && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {currentStep === 'models' && 'Seleccionar modelo'}
                      {currentStep === 'parts' && 'Seleccionar pieza'}
                      {currentStep === 'products' && 'Productos'}
                    </Badge>
                  )}
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={handleProductsClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-electric-blue"
                  >
                    Buscar por modelo
                  </button>
                  {categories.map((category) => (
                    <a
                      key={category}
                      href={`/catalog?category=${category.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-electric-blue"
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar por modelo, pieza o código..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-electric-blue focus:ring-electric-blue"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </form>
            </div>

            {/* Desktop Navigation - Contacto */}
            <div className="hidden md:block">
              <a href="/contact" className="text-gray-900 hover:text-electric-blue px-3 py-2 text-sm font-medium transition-colors">
                Contacto
              </a>
            </div>

            {/* Cart and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <CartButton />

              {/* Mobile menu */}
              <div className="md:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 bg-white">
                    <div className="flex flex-col space-y-6 pt-6">
                      {/* Mobile Search */}
                      <form onSubmit={handleSearch} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          placeholder="Buscar productos..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          className="pl-10 w-full"
                        />
                      </form>

                      {/* Mobile Navigation Links */}
                      <div className="space-y-4">
                        <a 
                          href="/" 
                          className="block text-lg font-medium text-gray-900 hover:text-electric-blue transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Inicio
                        </a>
                        <div>
                          <button 
                            className="block text-lg font-medium text-gray-900 hover:text-electric-blue transition-colors mb-3"
                            onClick={() => {
                              handleProductsClick();
                              setIsMenuOpen(false);
                            }}
                          >
                            Productos
                          </button>
                          <div className="pl-4 space-y-2">
                            <button
                              onClick={() => {
                                handleProductsClick();
                                setIsMenuOpen(false);
                              }}
                              className="block text-base text-gray-600 hover:text-electric-blue transition-colors"
                            >
                              Buscar por modelo
                            </button>
                            {categories.map((category) => (
                              <a
                                key={category}
                                href={`/catalog?category=${category.toLowerCase()}`}
                                className="block text-base text-gray-600 hover:text-electric-blue transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {category}
                              </a>
                            ))}
                          </div>
                        </div>
                        <a 
                          href="/contact" 
                          className="block text-lg font-medium text-gray-900 hover:text-electric-blue transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Contacto
                        </a>
                      </div>

                      {/* Quick Actions */}
                      <div className="border-t pt-6">
                        {showBackButton && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              onBackClick?.();
                              setIsMenuOpen(false);
                            }}
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                          </Button>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
