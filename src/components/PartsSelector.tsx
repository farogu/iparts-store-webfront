import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Monitor, Battery, Camera, Smartphone, Volume2, Settings, Wrench, Cable } from 'lucide-react';

interface iPhoneModel {
  id: string;
  name: string;
  displayName: string;
  year: string;
  image: string;
}

interface PartType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  productCount: number;
  image: string;
  isPopular?: boolean;
}

interface PartsSelectorProps {
  selectedModel: iPhoneModel;
  onPartTypeSelect: (partType: PartType) => void;
  onBackToModels: () => void;
}

const PartsSelector = ({ selectedModel, onPartTypeSelect, onBackToModels }: PartsSelectorProps) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const partTypes: PartType[] = [
    {
      id: 'pantallas',
      name: 'Pantallas',
      icon: Monitor,
      description: 'Pantallas OLED, LCD y Retina de alta calidad',
      productCount: 24,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&q=80',
      isPopular: true
    },
    {
      id: 'baterias',
      name: 'Baterías',
      icon: Battery,
      description: 'Baterías originales y compatibles de larga duración',
      productCount: 18,
      image: 'https://images.unsplash.com/photo-1609592306974-5487e8ad2dbb?w=300&q=80',
      isPopular: true
    },
    {
      id: 'camaras',
      name: 'Cámaras',
      icon: Camera,
      description: 'Cámaras frontales y traseras de alta resolución',
      productCount: 15,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80',
      isPopular: true
    },
    {
      id: 'carcasas',
      name: 'Carcasas',
      icon: Smartphone,
      description: 'Carcasas traseras y marcos en diversos colores',
      productCount: 32,
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&q=80'
    },
    {
      id: 'altavoces',
      name: 'Altavoces',
      icon: Volume2,
      description: 'Altavoces internos y externos de alta fidelidad',
      productCount: 12,
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&q=80'
    },
    {
      id: 'botones',
      name: 'Botones y Controles',
      icon: Settings,
      description: 'Botones de encendido, volumen y home',
      productCount: 28,
      image: 'https://images.unsplash.com/photo-1540829917886-91ab031b1764?w=300&q=80'
    },
    {
      id: 'conectores',
      name: 'Conectores y Cables',
      icon: Cable,
      description: 'Conectores Lightning, USB-C y cables de carga',
      productCount: 16,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&q=80'
    },
    {
      id: 'otros',
      name: 'Otros',
      icon: Wrench,
      description: 'Herramientas, adhesivos y accesorios varios',
      productCount: 22,
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header con modelo seleccionado */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="outline" 
          onClick={onBackToModels}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Cambiar modelo
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Piezas para {selectedModel.name}
          </h1>
          <p className="text-gray-600">
            Selecciona el tipo de pieza que necesitas
          </p>
        </div>
        
        <div className="w-24"> {/* Spacer for balance */}</div>
      </div>

      {/* Modelo seleccionado visual */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center gap-4">
          <img 
            src={selectedModel.image} 
            alt={selectedModel.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">{selectedModel.name}</h2>
            <p className="text-gray-600">Año {selectedModel.year}</p>
          </div>
        </div>
      </div>

      {/* Tipos de piezas populares */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Piezas Más Solicitadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {partTypes.filter(part => part.isPopular).map((partType) => {
            const IconComponent = partType.icon;
            return (
              <Card 
                key={partType.id}
                className={`cursor-pointer transition-all duration-300 hover-lift group hover:shadow-xl`}
                onMouseEnter={() => setHoveredPart(partType.id)}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => onPartTypeSelect(partType)}
              >
                <CardContent className="p-6">
                  <div className="relative">
                    <img 
                      src={partType.image} 
                      alt={partType.name}
                      className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 right-2 bg-electric-blue text-white">
                      Popular
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-electric-blue/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-electric-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-electric-blue transition-colors">
                        {partType.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {partType.productCount} productos
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {partType.description}
                  </p>
                  
                  {(hoveredPart === partType.id) && (
                    <Button className="w-full bg-electric-blue hover:bg-blue-600 text-white">
                      Ver productos
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Todas las categorías */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Todas las Categorías
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {partTypes.map((partType) => {
            const IconComponent = partType.icon;
            return (
              <Card 
                key={partType.id}
                className="cursor-pointer transition-all duration-300 hover-lift group hover:shadow-lg"
                onMouseEnter={() => setHoveredPart(partType.id)}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => onPartTypeSelect(partType)}
              >
                <CardContent className="p-4 text-center">
                  <div className="p-3 bg-electric-blue/10 rounded-lg mx-auto mb-3 w-fit">
                    <IconComponent className="h-8 w-8 text-electric-blue" />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-electric-blue transition-colors mb-1">
                    {partType.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {partType.productCount} productos
                  </p>
                  {partType.isPopular && (
                    <Badge className="bg-electric-blue text-white text-xs">
                      Popular
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PartsSelector;
