
import React, { useEffect, RefObject } from 'react';

interface GestureHandlerProps {
  containerRef: RefObject<HTMLDivElement>;
  onVolumeChange: (delta: number) => void;
  onBrightnessChange: (delta: number) => void;
  onSeek: (delta: number) => void;
  onShowControls: () => void;
}

const GestureHandler: React.FC<GestureHandlerProps> = ({
  containerRef,
  onVolumeChange,
  onBrightnessChange,
  onSeek,
  onShowControls
}) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let isGesturing = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isGesturing = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isGesturing || e.touches.length !== 1) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      const containerRect = container.getBoundingClientRect();
      const isLeftSide = startX < containerRect.width / 2;

      // Prevent default scrolling
      e.preventDefault();

      // Horizontal swipe - seek
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        const seekDelta = deltaX > 0 ? 10 : -10;
        onSeek(seekDelta);
        isGesturing = false;
      }
      // Vertical swipe
      else if (Math.abs(deltaY) > 50) {
        const delta = deltaY > 0 ? -0.05 : 0.05;
        
        if (isLeftSide) {
          // Left side - brightness
          onBrightnessChange(delta * 100);
        } else {
          // Right side - volume
          onVolumeChange(delta);
        }
        isGesturing = false;
      }
    };

    const handleTouchEnd = () => {
      isGesturing = false;
    };

    const handleClick = () => {
      onShowControls();
    };

    // Mouse events for desktop
    let mouseStartX = 0;
    let mouseStartY = 0;
    let isMouseGesturing = false;

    const handleMouseDown = (e: MouseEvent) => {
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
      isMouseGesturing = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseGesturing) return;

      const deltaX = e.clientX - mouseStartX;
      const deltaY = e.clientY - mouseStartY;

      if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
        const containerRect = container.getBoundingClientRect();
        const isLeftSide = mouseStartX < containerRect.width / 2;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal - seek
          const seekDelta = deltaX > 0 ? 10 : -10;
          onSeek(seekDelta);
        } else {
          // Vertical
          const delta = deltaY > 0 ? -0.05 : 0.05;
          
          if (isLeftSide) {
            onBrightnessChange(delta * 100);
          } else {
            onVolumeChange(delta);
          }
        }
        isMouseGesturing = false;
      }
    };

    const handleMouseUp = () => {
      isMouseGesturing = false;
    };

    // Add event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('click', handleClick);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
    };
  }, [containerRef, onVolumeChange, onBrightnessChange, onSeek, onShowControls]);

  return null;
};

export default GestureHandler;
