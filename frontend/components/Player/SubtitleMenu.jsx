"use client"

import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Subtitles } from "lucide-react";

export default function SubtitleMenu({ subtitles, onSubtitlesChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSubtitleClick = (type) => {
    onSubtitlesChange(type);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
        variant="ghost"
        size="icon"
      >
        <Subtitles size={20}/>
      </Button>
      
      {isMenuOpen && (
        <div 
          className="absolute bottom-full right-0 mb-2 bg-zinc-800 text-white border border-zinc-700 rounded shadow-lg z-50"
          style={{ minWidth: '120px' }}
        >
          <div 
            className={`px-3 py-2 cursor-pointer hover:bg-zinc-700 ${subtitles.rus ? "bg-zinc-700" : ""}`}
            onClick={() => handleSubtitleClick("rus")}
          >
            Русские
          </div>
          <div 
            className={`px-3 py-2 cursor-pointer hover:bg-zinc-700 ${subtitles.eng ? "bg-zinc-700" : ""}`}
            onClick={() => handleSubtitleClick("eng")}
          >
            English
          </div>
          <div 
            className={`px-3 py-2 cursor-pointer hover:bg-zinc-700 ${subtitles.dual ? "bg-zinc-700" : ""}`}
            onClick={() => handleSubtitleClick("dual")}
          >
            Dual
          </div>
          <div 
            className="px-3 py-2 cursor-pointer hover:bg-zinc-700"
            onClick={() => handleSubtitleClick("none")}
          >
            Off
          </div>
        </div>
      )}
    </div>
  );
}