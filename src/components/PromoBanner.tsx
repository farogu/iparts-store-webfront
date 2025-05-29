
import { Truck } from 'lucide-react';

const PromoBanner = () => {
  return (
    <div className="bg-electric-blue text-white py-2 px-4 text-center text-sm font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Truck className="h-4 w-4" />
        <span>¡Envío GRATIS en compras mayores a $1,000 MXN!</span>
      </div>
    </div>
  );
};

export default PromoBanner;
