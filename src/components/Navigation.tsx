
import { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems] = useState(3); // Simulamos items en el carrito

  const categories = [
    'Pantallas',
    'Baterías', 
    'Carcasas',
    'Cámaras',
    'Botones',
    'Altavoces'
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-black">
              i<span className="text-electric-blue">Parts</span> Store
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="/" className="text-gray-900 hover:text-electric-blue px-3 py-2 text-sm font-medium transition-colors">
                Inicio
              </a>
              <div className="relative group">
                <button className="text-gray-900 hover:text-electric-blue px-3 py-2 text-sm font-medium transition-colors">
                  Productos
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
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
              <a href="/contact" className="text-gray-900 hover:text-electric-blue px-3 py-2 text-sm font-medium transition-colors">
                Contacto
              </a>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar productos..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-electric-blue focus:ring-electric-blue"
              />
            </div>
          </div>

          {/* Cart */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-electric-blue text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full"
                />
              </div>
              <a href="/" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-electric-blue">
                Inicio
              </a>
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-900 mb-2">Productos</p>
                {categories.map((category) => (
                  <a
                    key={category}
                    href={`/catalog?category=${category.toLowerCase()}`}
                    className="block px-4 py-1 text-sm text-gray-600 hover:text-electric-blue"
                  >
                    {category}
                  </a>
                ))}
              </div>
              <a href="/contact" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-electric-blue">
                Contacto
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
