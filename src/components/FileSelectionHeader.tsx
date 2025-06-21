
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Video, X } from 'lucide-react';

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

  if (!hasVideo) {
    // Full file selection interface when no video is loaded
    return (
      <div className="w-full bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="mb-4">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-white mb-1">Choose Video File</h2>
              <p className="text-gray-400 text-sm">Select a video to start playing</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="video/mp4,video/mkv,video/avi,video/mov,video/webm,video/flv,video/m4v,video/3gp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              </label>
              
              <span className="text-gray-500 text-sm">or drag & drop video here</span>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Supported: MP4, MKV, AVI, MOV, WEBM, FLV
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact header when video is loaded
  return (
    <div className="flex items-center justify-between bg-black/95 backdrop-blur-sm px-4 py-2 border-b border-gray-800">
      <div className="flex items-center space-x-3">
        <Video className="w-5 h-5 text-blue-400" />
        <div>
          <div className="text-white font-medium text-sm truncate max-w-xs">
            Now Playing: {videoName}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="video/mp4,video/mkv,video/avi,video/mov,video/webm,video/flv,video/m4v,video/3gp"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/10 text-xs px-3"
          >
            Change Video
          </Button>
        </label>
        
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
