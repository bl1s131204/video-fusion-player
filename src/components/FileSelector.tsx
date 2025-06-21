
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Play } from 'lucide-react';

interface FileSelectorProps {
  onFileSelect: (file: File) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    if (videoFile) {
      onFileSelect(videoFile);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div 
      className="absolute inset-0 bg-black flex items-center justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="text-center text-white p-8 border-2 border-dashed border-gray-600 rounded-lg max-w-md">
        <div className="text-6xl mb-4">
          <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Select Video File</h2>
        <p className="text-gray-400 mb-6">
          Drag and drop a video file here, or click to browse
        </p>
        
        <div className="space-y-4">
          <label className="block">
            <input
              type="file"
              accept="video/mp4,video/mkv,video/avi,video/mov,video/webm,video/flv"
              onChange={handleFileInput}
              className="hidden"
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Choose Video File
            </Button>
          </label>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Supported formats:</p>
          <p>MP4, MKV, AVI, MOV, WEBM, FLV</p>
        </div>
      </div>
    </div>
  );
};

export default FileSelector;
