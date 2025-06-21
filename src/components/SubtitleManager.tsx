
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface SubtitleManagerProps {
  subtitles: Subtitle[];
  currentTime: number;
  subtitleDelay: number;
  showSubtitles: boolean;
  onSubtitlesLoad: (subtitles: Subtitle[]) => void;
}

const SubtitleManager: React.FC<SubtitleManagerProps> = ({
  subtitles,
  currentTime,
  subtitleDelay,
  showSubtitles,
  onSubtitlesLoad
}) => {
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');

  // Parse SRT file
  const parseSRT = (srtContent: string): Subtitle[] => {
    const blocks = srtContent.trim().split('\n\n');
    const subtitles: Subtitle[] = [];

    blocks.forEach(block => {
      const lines = block.split('\n');
      if (lines.length >= 3) {
        const timeLine = lines[1];
        const textLines = lines.slice(2);
        
        const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/);
        if (timeMatch) {
          const start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
          const end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
          
          subtitles.push({
            start,
            end,
            text: textLines.join('\n')
          });
        }
      }
    });

    return subtitles;
  };

  // Parse VTT file
  const parseVTT = (vttContent: string): Subtitle[] => {
    const lines = vttContent.split('\n');
    const subtitles: Subtitle[] = [];
    let currentBlock: string[] = [];
    let inCue = false;

    lines.forEach(line => {
      if (line.includes('-->')) {
        const timeMatch = line.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3}) --> (\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
        if (timeMatch) {
          const start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
          const end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
          
          currentBlock = [];
          inCue = true;
          subtitles.push({ start, end, text: '' });
        }
      } else if (inCue && line.trim()) {
        currentBlock.push(line);
      } else if (inCue && !line.trim()) {
        if (subtitles.length > 0) {
          subtitles[subtitles.length - 1].text = currentBlock.join('\n');
        }
        inCue = false;
      }
    });

    return subtitles;
  };

  // Handle subtitle file upload
  const handleSubtitleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let parsedSubtitles: Subtitle[] = [];

      if (file.name.endsWith('.srt')) {
        parsedSubtitles = parseSRT(content);
      } else if (file.name.endsWith('.vtt')) {
        parsedSubtitles = parseVTT(content);
      }

      onSubtitlesLoad(parsedSubtitles);
    };
    reader.readAsText(file);
  };

  // Update current subtitle based on time
  useEffect(() => {
    const adjustedTime = currentTime + subtitleDelay;
    const current = subtitles.find(sub => 
      adjustedTime >= sub.start && adjustedTime <= sub.end
    );
    
    setCurrentSubtitle(current ? current.text : '');
  }, [currentTime, subtitles, subtitleDelay]);

  return (
    <>
      {/* Subtitle Display */}
      {showSubtitles && currentSubtitle && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-black/70 text-white px-4 py-2 rounded text-center max-w-2xl">
            {currentSubtitle.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Subtitle Upload (Hidden) */}
      <input
        type="file"
        accept=".srt,.vtt"
        onChange={handleSubtitleUpload}
        className="hidden"
        id="subtitle-upload"
      />
    </>
  );
};

export default SubtitleManager;
