
import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';

interface UIToggleProps {
  currentMode: 'mx' | 'youtube';
  onModeChange: (mode: 'mx' | 'youtube') => void;
  className?: string;
}

const UIToggle: React.FC<UIToggleProps> = ({ currentMode, onModeChange, className = '' }) => {
  return (
    <div className={`flex items-center bg-black/80 rounded-full p-1 ${className}`}>
      <Button
        variant={currentMode === 'mx' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('mx')}
        className={`rounded-full px-3 py-1 text-xs transition-all ${
          currentMode === 'mx' 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'text-white hover:bg-white/20'
        }`}
      >
        <Smartphone className="w-3 h-3 mr-1" />
        MX Player
      </Button>
      
      <Button
        variant={currentMode === 'youtube' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('youtube')}
        className={`rounded-full px-3 py-1 text-xs transition-all ${
          currentMode === 'youtube' 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'text-white hover:bg-white/20'
        }`}
      >
        <Monitor className="w-3 h-3 mr-1" />
        YouTube
      </Button>
    </div>
  );
};

export default UIToggle;
