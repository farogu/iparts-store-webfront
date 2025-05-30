import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, ArrowRight } from 'lucide-react';

interface iPhoneModel {
  id: string;
  name: string;
  displayName: string;
  year: string;
  image: string;
  isPopular?: boolean;
}

interface ModelSelectorProps {
  onModelSelect: (model: iPhoneModel) => void;
  selectedModel?: iPhoneModel;
}

const ModelSelector = ({ onModelSelect, selectedModel }: ModelSelectorProps) => {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const iPhoneModels: iPhoneModel[] = [
    // 2024-2025 Models
    {
      id: 'iphone-16e',
      name: 'iPhone 16e',
      displayName: '16e',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80',
      isPopular: true
    },
    {
      id: 'iphone-16-pro-max',
      name: 'iPhone 16 Pro Max',
      displayName: '16 Pro Max',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80',
      isPopular: true
    },
    {
      id: 'iphone-16-pro',
      name: 'iPhone 16 Pro',
      displayName: '16 Pro',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80',
      isPopular: true
    },
    {
      id: 'iphone-16-plus',
      name: 'iPhone 16 Plus',
      displayName: '16 Plus',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80'
    },
    {
      id: 'iphone-16',
      name: 'iPhone 16',
      displayName: '16',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80'
    },
    // 2023 Models
    {
      id: 'iphone-15-pro-max',
      name: 'iPhone 15 Pro Max',
      displayName: '15 Pro Max',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80',
      isPopular: true
    },
    {
      id: 'iphone-15-pro',
      name: 'iPhone 15 Pro',
      displayName: '15 Pro',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80'
    },
    {
      id: 'iphone-15-plus',
      name: 'iPhone 15 Plus',
      displayName: '15 Plus',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80'
    },
    {
      id: 'iphone-15',
      name: 'iPhone 15',
      displayName: '15',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80'
    },
    // 2022 Models
    {
      id: 'iphone-14-pro-max',
      name: 'iPhone 14 Pro Max',
      displayName: '14 Pro Max',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1663499482523-1c0206ad7bd4?w=300&q=80'
    },
    {
      id: 'iphone-14-pro',
      name: 'iPhone 14 Pro',
      displayName: '14 Pro',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1663499482523-1c0206ad7bd4?w=300&q=80'
    },
    {
      id: 'iphone-14-plus',
      name: 'iPhone 14 Plus',
      displayName: '14 Plus',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1663499482523-1c0206ad7bd4?w=300&q=80'
    },
    {
      id: 'iphone-14',
      name: 'iPhone 14',
      displayName: '14',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1663499482523-1c0206ad7bd4?w=300&q=80'
    },
    {
      id: 'iphone-se-3',
      name: 'iPhone SE (3ª generación)',
      displayName: 'SE (3ª gen)',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=300&q=80'
    },
    // 2021 Models
    {
      id: 'iphone-13-pro-max',
      name: 'iPhone 13 Pro Max',
      displayName: '13 Pro Max',
      year: '2021',
      image: 'https://images.unsplash.com/photo-1632633173522-c8fe2ee13b11?w=300&q=80'
    },
    {
      id: 'iphone-13-pro',
      name: 'iPhone 13 Pro',
      displayName: '13 Pro',
      year: '2021',
      image: 'https://images.unsplash.com/photo-1632633173522-c8fe2ee13b11?w=300&q=80'
    },
    {
      id: 'iphone-13-mini',
      name: 'iPhone 13 mini',
      displayName: '13 mini',
      year: '2021',
      image: 'https://images.unsplash.com/photo-1632633173522-c8fe2ee13b11?w=300&q=80'
    },
    {
      id: 'iphone-13',
      name: 'iPhone 13',
      displayName: '13',
      year: '2021',
      image: 'https://images.unsplash.com/photo-1632633173522-c8fe2ee13b11?w=300&q=80'
    },
    // 2020 Models
    {
      id: 'iphone-12-pro-max',
      name: 'iPhone 12 Pro Max',
      displayName: '12 Pro Max',
      year: '2020',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&q=80'
    },
    {
      id: 'iphone-12-pro',
      name: 'iPhone 12 Pro',
      displayName: '12 Pro',
      year: '2020',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&q=80'
    },
    {
      id: 'iphone-12-mini',
      name: 'iPhone 12 mini',
      displayName: '12 mini',
      year: '2020',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&q=80'
    },
    {
      id: 'iphone-12',
      name: 'iPhone 12',
      displayName: '12',
      year: '2020',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&q=80'
    },
    {
      id: 'iphone-se-2',
      name: 'iPhone SE (2ª generación)',
      displayName: 'SE (2ª gen)',
      year: '2020',
      image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=300&q=80'
    },
    // 2019 Models
    {
      id: 'iphone-11-pro-max',
      name: 'iPhone 11 Pro Max',
      displayName: '11 Pro Max',
      year: '2019',
      image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300&q=80'
    },
    {
      id: 'iphone-11-pro',
      name: 'iPhone 11 Pro',
      displayName: '11 Pro',
      year: '2019',
      image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300&q=80'
    },
    {
      id: 'iphone-11',
      name: 'iPhone 11',
      displayName: '11',
      year: '2019',
      image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300&q=80'
    },
    // 2018 Models
    {
      id: 'iphone-xs-max',
      name: 'iPhone XS Max',
      displayName: 'XS Max',
      year: '2018',
      image: 'https://images.unsplash.com/photo-1542119303-3905eed262db?w=300&q=80'
    },
    {
      id: 'iphone-xs',
      name: 'iPhone XS',
      displayName: 'XS',
      year: '2018',
      image: 'https://images.unsplash.com/photo-1542119303-3905eed262db?w=300&q=80'
    },
    {
      id: 'iphone-xr',
      name: 'iPhone XR',
      displayName: 'XR',
      year: '2018',
      image: 'https://images.unsplash.com/photo-1542119303-3905eed262db?w=300&q=80'
    },
    // 2017 Models
    {
      id: 'iphone-x',
      name: 'iPhone X',
      displayName: 'X',
      year: '2017',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Selecciona tu modelo de iPhone
        </h1>
        <p className="text-lg text-gray-600">
          Encuentra las piezas perfectas para tu dispositivo
        </p>
      </div>

      {/* Modelos Populares */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-electric-blue" />
          Modelos Más Populares
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {iPhoneModels.filter(model => model.isPopular).map((model) => (
            <Card 
              key={model.id}
              className={`cursor-pointer transition-all duration-300 hover-lift group ${
                selectedModel?.id === model.id 
                  ? 'ring-2 ring-electric-blue bg-blue-50' 
                  : 'hover:shadow-lg'
              }`}
              onMouseEnter={() => setHoveredModel(model.id)}
              onMouseLeave={() => setHoveredModel(null)}
              onClick={() => onModelSelect(model)}
            >
              <CardContent className="p-4">
                <div className="relative">
                  <img 
                    src={model.image} 
                    alt={model.name}
                    className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-electric-blue text-white">
                    Popular
                  </Badge>
                </div>
                <h3 className="font-semibold text-center text-gray-900 group-hover:text-electric-blue transition-colors">
                  iPhone {model.displayName}
                </h3>
                <p className="text-sm text-gray-500 text-center">{model.year}</p>
                {(hoveredModel === model.id || selectedModel?.id === model.id) && (
                  <div className="mt-3 flex justify-center">
                    <Button size="sm" className="bg-electric-blue hover:bg-blue-600 text-white">
                      Seleccionar
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Todos los Modelos */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Todos los Modelos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {iPhoneModels.map((model) => (
            <Card 
              key={model.id}
              className={`cursor-pointer transition-all duration-300 hover-lift group ${
                selectedModel?.id === model.id 
                  ? 'ring-2 ring-electric-blue bg-blue-50' 
                  : 'hover:shadow-lg'
              }`}
              onMouseEnter={() => setHoveredModel(model.id)}
              onMouseLeave={() => setHoveredModel(null)}
              onClick={() => onModelSelect(model)}
            >
              <CardContent className="p-3">
                <img 
                  src={model.image} 
                  alt={model.name}
                  className="w-full h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="font-medium text-center text-sm text-gray-900 group-hover:text-electric-blue transition-colors">
                  iPhone {model.displayName}
                </h3>
                <p className="text-xs text-gray-500 text-center">{model.year}</p>
                {model.isPopular && (
                  <Badge className="w-full mt-2 bg-electric-blue text-white text-xs justify-center">
                    Popular
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;
