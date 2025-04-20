import { Button } from "../ui/button";
import { formatTime } from "./utils";

export default function PlaybackControls({ isPlaying, togglePlay, seekTime, currentTime, duration }) {
  return (
    <>
      {/* Play/Pause button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
        variant="ghost"
        size="icon"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        )}
      </Button>
      
      {/* Rewind button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          seekTime(-15);
        }}
        className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
        variant="ghost"
        size="icon"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17l-5-5 5-5"/><path d="M18 17l-5-5 5-5"/></svg>
      </Button>
      
      {/* Forward button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          seekTime(15);
        }}
        className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
        variant="ghost"
        size="icon"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/></svg>
      </Button>
      
      {/* Time display */}
      <div className="text-sm text-white">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </>
  );
}