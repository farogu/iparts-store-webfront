
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Logo = ({ showBackButton, onBackClick }: LogoProps) => {
  return (
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
  );
};

export default Logo;
