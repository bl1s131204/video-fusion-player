
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Monitor, Palette, Volume2, Gauge, Type, RotateCw } from 'lucide-react';

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
  rotation?: number;
  onRotationChange?: (value: number) => void;
  volume?: number;
  onVolumeChange?: (value: number) => void;
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
  onToggleSubtitles,
  rotation = 0,
  onRotationChange,
  volume = 100,
  onVolumeChange
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'subtitles' | 'advanced'>('video');

  if (!isOpen) return null;

  const resetVideoSettings = () => {
    onBrightnessChange(100);
    onContrastChange(100);
    if (onRotationChange) onRotationChange(0);
  };

  const resetAudioSettings = () => {
    if (onVolumeChange) onVolumeChange(100);
    onPlaybackRateChange(1);
  };

  const resetSubtitleSettings = () => {
    onSubtitleDelayChange(0);
    onToggleSubtitles(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Player Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {[
            { id: 'video', label: 'Video', icon: Monitor },
            { id: 'audio', label: 'Audio', icon: Volume2 },
            { id: 'subtitles', label: 'Subtitles', icon: Type },
            { id: 'advanced', label: 'Advanced', icon: Gauge }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === id 
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/50' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'video' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-blue-400" />
                  Video Settings
                </h3>
                <Button variant="outline" size="sm" onClick={resetVideoSettings}>
                  Reset
                </Button>
              </div>

              {/* Brightness */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Brightness</label>
                  <span className="text-sm text-gray-400">{brightness}%</span>
                </div>
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => onBrightnessChange(value[0])}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Contrast</label>
                  <span className="text-sm text-gray-400">{contrast}%</span>
                </div>
                <Slider
                  value={[contrast]}
                  onValueChange={(value) => onContrastChange(value[0])}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Rotation */}
              {onRotationChange && (
                <div>
                  <label className="block text-sm font-medium mb-3">Video Rotation</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 90, 180, 270].map(angle => (
                      <Button
                        key={angle}
                        variant={rotation === angle ? "default" : "outline"}
                        size="sm"
                        onClick={() => onRotationChange(angle)}
                        className="flex items-center justify-center"
                      >
                        <RotateCw className="w-4 h-4 mr-1" />
                        {angle}°
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Volume2 className="w-5 h-5 mr-2 text-green-400" />
                  Audio Settings
                </h3>
                <Button variant="outline" size="sm" onClick={resetAudioSettings}>
                  Reset
                </Button>
              </div>

              {/* Volume */}
              {onVolumeChange && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Master Volume</label>
                    <span className="text-sm text-gray-400">{Math.round(volume)}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => onVolumeChange(value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              {/* Playback Speed */}
              <div>
                <label className="block text-sm font-medium mb-3">Playback Speed</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
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
                <div className="text-xs text-gray-400">
                  Current: {playbackRate}x speed
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subtitles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Type className="w-5 h-5 mr-2 text-yellow-400" />
                  Subtitle Settings
                </h3>
                <Button variant="outline" size="sm" onClick={resetSubtitleSettings}>
                  Reset
                </Button>
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

              {/* Subtitle Delay */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Subtitle Delay</label>
                  <span className="text-sm text-gray-400">{subtitleDelay.toFixed(1)}s</span>
                </div>
                <Slider
                  value={[subtitleDelay]}
                  onValueChange={(value) => onSubtitleDelayChange(value[0])}
                  min={-10}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Negative values make subtitles appear earlier
                </div>
              </div>

              {/* Subtitle Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Upload Subtitle File</label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".srt,.vtt,.ass,.ssa"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Handle subtitle file upload
                        console.log('Subtitle file selected:', file.name);
                      }
                    }}
                  />
                  <Button variant="outline" className="w-full" asChild>
                    <span>Choose Subtitle File (.srt, .vtt, .ass)</span>
                  </Button>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Gauge className="w-5 h-5 mr-2 text-purple-400" />
                  Advanced Settings
                </h3>
              </div>

              {/* Hardware Acceleration */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium block">Hardware Acceleration</label>
                  <p className="text-xs text-gray-400">Use GPU for video decoding</p>
                </div>
                <Button variant="default" size="sm">
                  Enabled
                </Button>
              </div>

              {/* Auto Resume */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium block">Auto Resume</label>
                  <p className="text-xs text-gray-400">Resume from last position</p>
                </div>
                <Button variant="default" size="sm">
                  ON
                </Button>
              </div>

              {/* Buffer Size */}
              <div>
                <label className="block text-sm font-medium mb-2">Buffer Size</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm">
                  <option>Auto (Recommended)</option>
                  <option>Small (1MB)</option>
                  <option>Medium (5MB)</option>
                  <option>Large (10MB)</option>
                </select>
              </div>

              {/* Reset All Settings */}
              <div className="pt-4 border-t border-gray-800">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    resetVideoSettings();
                    resetAudioSettings();
                    resetSubtitleSettings();
                  }}
                >
                  Reset All Settings to Default
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
