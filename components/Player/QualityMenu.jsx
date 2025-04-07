import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";

export default function QualityMenu({ currentQuality, onQualityChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
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

  const qualities = [
    { label: "1080p", value: "1080" },
    { label: "720p", value: "720" },
    { label: "480p", value: "480" },
    { label: "360p", value: "360" }
  ];

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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </Button>
      
      {isMenuOpen && (
        <div 
          className="absolute bottom-full right-0 mb-2 bg-zinc-800 text-white border border-zinc-700 rounded shadow-lg z-50"
          style={{ minWidth: '120px' }}
        >
          {qualities.map((quality) => (
            <div 
              key={quality.value}
              className={`px-3 py-2 cursor-pointer hover:bg-zinc-700 ${currentQuality === quality.value ? "bg-zinc-700" : ""}`}
              onClick={() => {
                onQualityChange(quality.value);
                setIsMenuOpen(false);
              }}
            >
              {quality.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}