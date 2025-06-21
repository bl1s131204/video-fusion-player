
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Video, X, Folder } from 'lucide-react';

interface FileSelectionHeaderProps {
  hasVideo: boolean;
  videoName?: string;
  onFileSelect: (file: File) => void;
  onClearVideo?: () => void;
}

const FileSelectionHeader: React.FC<FileSelectionHeaderProps> = ({
  hasVideo,
  videoName,
  onFileSelect,
  onClearVideo
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset the input
    e.target.value = '';
  };

  const triggerFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/mkv,video/avi,video/mov,video/webm,video/flv,video/m4v,video/3gp,video/wmv';
    input.multiple = false;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileSelect(file);
      }
    };
    input.click();
  };

  if (!hasVideo) {
    // Full file selection interface when no video is loaded
    return (
      <div className="w-full bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-6">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Choose Video File</h2>
              <p className="text-gray-400">Select a video file from your computer to start playing</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button 
                onClick={triggerFileSelect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
              >
                <Folder className="w-5 h-5 mr-2" />
                Browse Files
              </Button>
              
              <span className="text-gray-500">or drag & drop video here</span>
            </div>
            
            <div className="text-sm text-gray-500 space-y-1">
              <p className="font-medium">Supported formats:</p>
              <p>MP4, MKV, AVI, MOV, WEBM, FLV, M4V, 3GP, WMV</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact header when video is loaded
  return (
    <div className="flex items-center justify-between bg-black/95 backdrop-blur-sm px-4 py-3 border-b border-gray-800">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Video className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-white font-medium text-sm truncate">
            Now Playing: {videoName}
          </div>
          <div className="text-gray-400 text-xs">
            Ready to play • HD Quality
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Button
          onClick={triggerFileSelect}
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-white/10 text-xs px-3 py-2"
        >
          <Folder className="w-4 h-4 mr-1" />
          Change Video
        </Button>
        
        {onClearVideo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearVideo}
            className="text-white hover:bg-white/10 w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileSelectionHeader;
