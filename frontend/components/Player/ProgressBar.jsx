"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "../ui/slider";

export default function ProgressBar({ videoRef, duration, currentTime }) {
  const [isDragging, setIsDragging] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const progressBarRef = useRef(null);

  // Update seek position when currentTime changes (but only if not dragging)
  useEffect(() => {
    if (!isDragging && duration > 0) {
      setSeekPosition((currentTime / duration) * 100);
    }
  }, [currentTime, duration, isDragging]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragChange = (values) => {
    if (isDragging) {
      const [newPosition] = values;
      setSeekPosition(newPosition);
    }
  };

  const handleDragEnd = () => {
    try {
      const video = videoRef.current;
      if (!video || !duration) return;
      
      // Apply the seek position when dragging ends
      video.currentTime = (seekPosition / 100) * duration;
      setIsDragging(false);
    } catch (error) {
      console.error("Error seeking:", error);
      setIsDragging(false);
    }
  };

  // Handle click on progress bar track (for direct seeking)
  const handleTrackClick = (e) => {
    if (!progressBarRef.current || !videoRef.current || !duration) return;
    
    // Prevent default to avoid any conflicts
    e.preventDefault();
    e.stopPropagation();
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    // Set time directly
    videoRef.current.currentTime = Math.max(0, Math.min(duration, newTime));
  };

  return (
    <div 
      className="w-full mb-2" 
      ref={progressBarRef}
      onClick={handleTrackClick}
    >
      <Slider
        value={[seekPosition]}
        min={0}
        max={100}
        step={0.1}
        onValueChange={handleDragChange}
        onValueCommit={handleDragEnd}
        onPointerDown={handleDragStart}
        className="w-full h-1 cursor-pointer"
      />
    </div>
  );
}