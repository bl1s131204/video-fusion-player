
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCw, Settings, Download, Share2, Heart, MoreVertical, PictureInPicture2, SkipBack, SkipForward, Rewind, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import FileSelector from './FileSelector';
import SubtitleManager from './SubtitleManager';
import GestureHandler from './GestureHandler';
import SettingsPanel from './SettingsPanel';

interface VideoPlayerProps {}

const VideoPlayer: React.FC<VideoPlayerProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  
  // UI state
  const [uiMode, setUiMode] = useState<'mx' | 'youtube'>('mx');
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  // File state
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoMetadata, setVideoMetadata] = useState<{
    name: string;
    size: number;
    duration: number;
  } | null>(null);

  // Subtitle state
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [subtitleDelay, setSubtitleDelay] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);

  // Recently played
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Control visibility timer
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Load video file
  const handleFileSelect = useCallback((file: File) => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setCurrentFile(file);
    setVideoMetadata({
      name: file.name,
      size: file.size,
      duration: 0
    });

    // Save to recently played
    const recent = {
      name: file.name,
      size: file.size,
      lastPlayed: Date.now(),
      position: 0
    };
    
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(item => item.name !== file.name);
      return [recent, ...filtered].slice(0, 10);
    });

    toast({
      title: "Video loaded",
      description: `${file.name} ready to play`
    });
  }, [videoUrl, toast]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVideoMetadata(prev => prev ? {
        ...prev,
        duration: videoRef.current!.duration
      } : null);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleError = (e: any) => {
    console.error('Video error:', e);
    toast({
      title: "Playback Error",
      description: "Attempting to skip corrupted frames...",
      variant: "destructive"
    });
    
    // Try to recover from corrupted frames
    if (videoRef.current) {
      const currentPos = videoRef.current.currentTime;
      videoRef.current.currentTime = currentPos + 1; // Skip 1 second ahead
    }
  };

  // Playback controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(handleError);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const time = (value[0] / 100) * duration;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const vol = value[0] / 100;
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const changePlaybackSpeed = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const togglePictureInPicture = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (error) {
        toast({
          title: "Picture-in-Picture not supported",
          description: "Your browser doesn't support PiP mode",
          variant: "destructive"
        });
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.1));
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Format time
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // MX Player UI
  const renderMXPlayerUI = () => (
    <div className="absolute inset-0 bg-black">
      {/* Video Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="max-w-full max-h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              filter: `brightness(${brightness}%) contrast(${contrast}%)`
            }}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onError={handleError}
            onClick={resetControlsTimeout}
          />
        ) : (
          <div className="text-white text-center">
            <div className="text-6xl mb-4">📹</div>
            <div className="text-xl mb-2">No video selected</div>
            <div className="text-gray-400">Tap to select a video file</div>
          </div>
        )}

        {/* MX Player Controls Overlay */}
        {showControls && (
          <div className="absolute inset-0 bg-black/20">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUiMode('youtube')}
                    className="text-white hover:bg-white/20"
                  >
                    Switch to YouTube UI
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {videoMetadata && (
                <div className="mt-2 text-white text-sm">
                  <div className="font-medium">{videoMetadata.name}</div>
                  <div className="text-gray-300">
                    {(videoMetadata.size / (1024 * 1024)).toFixed(1)} MB • {formatTime(videoMetadata.duration)}
                  </div>
                </div>
              )}
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-black/50 hover:bg-black/70 text-white border-2 border-white/30"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>
            </div>

            {/* Side Controls */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
              >
                <RotateCw className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePictureInPicture}
                className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
              >
                <PictureInPicture2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              {/* Seek Bar */}
              <div className="mb-4">
                <Slider
                  value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-white text-sm mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipTime(-10)}
                    className="text-white hover:bg-white/20"
                  >
                    <Rewind className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipTime(10)}
                    className="text-white hover:bg-white/20"
                  >
                    <FastForward className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gesture Handler */}
      <GestureHandler
        containerRef={containerRef}
        onVolumeChange={(delta) => setVolume(prev => Math.max(0, Math.min(1, prev + delta)))}
        onBrightnessChange={(delta) => setBrightness(prev => Math.max(50, Math.min(150, prev + delta)))}
        onSeek={(delta) => skipTime(delta)}
        onShowControls={resetControlsTimeout}
      />
    </div>
  );

  // YouTube UI
  const renderYouTubeUI = () => (
    <div className={`${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setUiMode('mx')}
              className={isDarkTheme ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'}
            >
              Switch to MX UI
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={isDarkTheme ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'}
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </Button>
          </div>
        </div>
      </div>

      {/* Video Player Area */}
      <div className="aspect-video bg-black relative max-w-4xl mx-auto">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              filter: `brightness(${brightness}%) contrast(${contrast}%)`
            }}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onError={handleError}
            controls={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <div className="text-4xl mb-4">📺</div>
              <div className="text-xl mb-2">Select a video to start watching</div>
            </div>
          </div>
        )}

        {/* YouTube-style Controls */}
        {showControls && videoUrl && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full [&_[role=slider]]:bg-red-600 [&_[role=slider]]:border-red-600"
              />
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(-10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="w-16">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={playbackRate}
                  onChange={(e) => changePlaybackSpeed(Number(e.target.value))}
                  className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
                >
                  <option value={0.25} className="bg-gray-900">0.25x</option>
                  <option value={0.5} className="bg-gray-900">0.5x</option>
                  <option value={0.75} className="bg-gray-900">0.75x</option>
                  <option value={1} className="bg-gray-900">Normal</option>
                  <option value={1.25} className="bg-gray-900">1.25x</option>
                  <option value={1.5} className="bg-gray-900">1.5x</option>
                  <option value={2} className="bg-gray-900">2x</option>
                </select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePictureInPicture}
                  className="text-white hover:bg-white/20"
                >
                  <PictureInPicture2 className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info & Actions */}
      {videoMetadata && (
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-xl font-semibold mb-2">{videoMetadata.name}</h1>
          <div className="text-sm text-gray-400 mb-4">
            {(videoMetadata.size / (1024 * 1024)).toFixed(1)} MB • {formatTime(videoMetadata.duration)}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => {
                const isFav = favorites.includes(videoMetadata.name);
                if (isFav) {
                  setFavorites(prev => prev.filter(name => name !== videoMetadata.name));
                } else {
                  setFavorites(prev => [...prev, videoMetadata.name]);
                }
              }}
              className={`${favorites.includes(videoMetadata.name) ? 'text-red-500' : ''} hover:bg-gray-800`}
            >
              <Heart className="w-4 h-4 mr-2" />
              {favorites.includes(videoMetadata.name) ? 'Favorited' : 'Favorite'}
            </Button>

            <Button variant="ghost" className="hover:bg-gray-800">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button variant="ghost" className="hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>

            <Button variant="ghost" className="hover:bg-gray-800">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="w-full h-screen relative">
      {/* File Selector */}
      {!videoUrl && (
        <FileSelector onFileSelect={handleFileSelect} />
      )}

      {/* Main UI */}
      {uiMode === 'mx' ? renderMXPlayerUI() : renderYouTubeUI()}

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        brightness={brightness}
        onBrightnessChange={setBrightness}
        contrast={contrast}
        onContrastChange={setContrast}
        playbackRate={playbackRate}
        onPlaybackRateChange={changePlaybackSpeed}
        subtitleDelay={subtitleDelay}
        onSubtitleDelayChange={setSubtitleDelay}
        showSubtitles={showSubtitles}
        onToggleSubtitles={setShowSubtitles}
      />

      {/* Subtitle Manager */}
      <SubtitleManager
        subtitles={subtitles}
        currentTime={currentTime}
        subtitleDelay={subtitleDelay}
        showSubtitles={showSubtitles}
        onSubtitlesLoad={setSubtitles}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
    </div>
  );
};

export default VideoPlayer;
