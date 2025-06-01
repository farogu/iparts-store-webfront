
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, Menu } from 'lucide-react';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProductsClick: () => void;
  categories: string[];
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const MobileMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleSearchChange,
  handleProductsClick,
  categories,
  showBackButton,
  onBackClick
}: MobileMenuProps) => {
  return (
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
  );
};

export default MobileMenu;
