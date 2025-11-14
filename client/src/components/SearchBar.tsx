import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isSticky: boolean;
}

export function SearchBar({ value, onChange, isSticky }: SearchBarProps) {
  return (
    <div
      className={`transition-all duration-300 ${
        isSticky
          ? 'fixed top-4 left-1/2 -translate-x-1/2 z-[60] shadow-sticky'
          : 'relative'
      }`}
    >
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Pokémon..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-14 pr-14 py-6 rounded-full !rounded-full bg-card border-card-border text-base focus-visible:ring-2 focus-visible:ring-primary overflow-hidden"
          data-testid="input-search"
        />
        {value && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
            data-testid="button-clear-search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
