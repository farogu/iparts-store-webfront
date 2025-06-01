
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearchGlobal?: (query: string) => void;
}

const SearchBar = ({ onSearchGlobal }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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

  return (
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
  );
};

export default SearchBar;
