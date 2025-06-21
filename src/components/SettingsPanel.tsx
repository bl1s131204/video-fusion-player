
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  brightness: number;
  onBrightnessChange: (value: number) => void;
  contrast: number;
  onContrastChange: (value: number) => void;
  playbackRate: number;
  onPlaybackRateChange: (value: number) => void;
  subtitleDelay: number;
  onSubtitleDelayChange: (value: number) => void;
  showSubtitles: boolean;
  onToggleSubtitles: (value: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  brightness,
  onBrightnessChange,
  contrast,
  onContrastChange,
  playbackRate,
  onPlaybackRateChange,
  subtitleDelay,
  onSubtitleDelayChange,
  showSubtitles,
  onToggleSubtitles
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Player Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Brightness */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Brightness: {brightness}%
            </label>
            <Slider
              value={[brightness]}
              onValueChange={(value) => onBrightnessChange(value[0])}
              min={50}
              max={150}
              step={5}
              className="w-full"
            />
          </div>

          {/* Contrast */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Contrast: {contrast}%
            </label>
            <Slider
              value={[contrast]}
              onValueChange={(value) => onContrastChange(value[0])}
              min={50}
              max={150}
              step={5}
              className="w-full"
            />
          </div>

          {/* Playback Speed */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Playback Speed: {playbackRate}x
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                <Button
                  key={speed}
                  variant={playbackRate === speed ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPlaybackRateChange(speed)}
                  className="text-xs"
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>

          {/* Subtitle Delay */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Subtitle Delay: {subtitleDelay}s
            </label>
            <Slider
              value={[subtitleDelay]}
              onValueChange={(value) => onSubtitleDelayChange(value[0])}
              min={-10}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Subtitle Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show Subtitles</label>
            <Button
              variant={showSubtitles ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleSubtitles(!showSubtitles)}
            >
              {showSubtitles ? "ON" : "OFF"}
            </Button>
          </div>

          {/* Subtitle Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Subtitles</label>
            <label htmlFor="subtitle-upload">
              <Button variant="outline" className="w-full" asChild>
                <span>Choose Subtitle File (.srt, .vtt)</span>
              </Button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
