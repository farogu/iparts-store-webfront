
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const navigate = useNavigate();

  const handleCatalogClick = () => {
    navigate('/productos');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Piezas Originales para tu 
              <span className="text-electric-blue"> iPhone</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Encuentra pantallas, baterías, cámaras y más accesorios de la más alta calidad. 
              Reparaciones profesionales garantizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-electric-blue hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold"
                onClick={handleCatalogClick}
              >
                Ver Catálogo
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white hover:bg-white px-8 py-3 text-lg font-semibold text-zinc-950"
                onClick={handleContactClick}
              >
                Contactar
              </Button>
            </div>
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-electric-blue">500+</div>
                <div className="text-sm text-gray-400">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-electric-blue">98%</div>
                <div className="text-sm text-gray-400">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-electric-blue">24h</div>
                <div className="text-sm text-gray-400">Envío</div>
              </div>
            </div>
          </div>
          <div className="lg:pl-12">
            <div className="relative">
              <img alt="Componentes iPhone" className="w-full h-auto rounded-lg shadow-2xl hover-lift" src="/lovable-uploads/1f88840e-c2ed-4975-b3d7-1e63231bc622.jpg" />
              <div className="absolute -bottom-6 -right-6 bg-electric-blue text-white p-6 rounded-lg shadow-lg py-[20px] px-[150px]">
                <div className="text-2xl font-bold">Garantía</div>
                <div className="text-sm">1 Año</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
