
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ModelSelector from '@/components/ModelSelector';
import PartsSelector from '@/components/PartsSelector';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

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
}

type FlowStep = 'models' | 'parts' | 'products';

const ProductFlow = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('models');
  const [selectedModel, setSelectedModel] = useState<iPhoneModel | null>(null);
  const [selectedPartType, setSelectedPartType] = useState<PartType | null>(null);
  const navigate = useNavigate();

  const handleModelSelect = (model: iPhoneModel) => {
    console.log('Modelo seleccionado:', model);
    setSelectedModel(model);
    setCurrentStep('parts');
    
    // WooCommerce Integration Comment:
    // Aquí puedes hacer una llamada a la API de WooCommerce para obtener
    // las categorías de productos disponibles para este modelo específico
    // Ejemplo: fetchAvailablePartsForModel(model.id)
  };

  const handlePartTypeSelect = (partType: PartType) => {
    console.log('Tipo de pieza seleccionado:', partType, 'para modelo:', selectedModel);
    setSelectedPartType(partType);
    
    // WooCommerce Integration Comment:
    // Redirigir al catálogo con filtros aplicados
    // Los parámetros del modelo y tipo de pieza se pueden pasar como query params
    navigate(`/catalog?model=${selectedModel?.id}&category=${partType.id}`);
  };

  const handleBackToModels = () => {
    setCurrentStep('models');
    setSelectedModel(null);
    setSelectedPartType(null);
  };

  const handleGlobalSearch = (query: string) => {
    console.log('Búsqueda global:', query);
    
    // WooCommerce Integration Comment:
    // Implementar búsqueda global que incluya:
    // - Nombre del producto
    // - SKU/Código de pieza  
    // - Descripción
    // - Compatibilidad con modelo
    // Redirigir a resultados con: navigate(`/catalog?search=${encodeURIComponent(query)}`)
    navigate(`/catalog?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onProductsClick={() => {
          setCurrentStep('models');
          setSelectedModel(null);
          setSelectedPartType(null);
        }}
        onSearchGlobal={handleGlobalSearch}
        showBackButton={currentStep !== 'models'}
        onBackClick={handleBackToModels}
        currentStep={currentStep}
      />
      
      <main className="min-h-[calc(100vh-64px)]">
        {currentStep === 'models' && (
          <ModelSelector 
            onModelSelect={handleModelSelect}
            selectedModel={selectedModel || undefined}
          />
        )}
        
        {currentStep === 'parts' && selectedModel && (
          <PartsSelector
            selectedModel={selectedModel}
            onPartTypeSelect={handlePartTypeSelect}
            onBackToModels={handleBackToModels}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductFlow;

/*
WooCommerce Integration Instructions:

1. BACKEND SETUP:
   - Create custom taxonomy for iPhone models in WooCommerce
   - Add custom fields to products: compatible_models, part_type
   - Set up product categories matching the part types (pantallas, baterias, etc.)

2. API ENDPOINTS NEEDED:
   - GET /wp-json/wc/v3/products?meta_key=compatible_models&meta_value={model_id}
   - GET /wp-json/wc/v3/products?category={part_type}&meta_key=compatible_models&meta_value={model_id}
   - GET /wp-json/wc/v3/products?search={query}

3. JAVASCRIPT INTEGRATION:
   - Replace console.log calls with actual API calls
   - Use fetch() or axios to communicate with WooCommerce API
   - Handle loading states and error handling
   - Cache frequently accessed data (models, categories)

4. URL STRUCTURE FOR SEO:
   - /productos/iphone-15-pro/pantallas/
   - /productos/iphone-14/baterias/
   - /buscar?q={query}

5. RESPONSIVE CONSIDERATIONS:
   - All components are mobile-first
   - Touch-friendly buttons and cards
   - Swipe gestures for mobile navigation (optional)
   - Optimized images with lazy loading

6. PERFORMANCE OPTIMIZATIONS:
   - Implement virtual scrolling for large product lists
   - Use React.memo for component optimization
   - Add skeleton loaders during API calls
   - Implement infinite scroll for product listings
*/
