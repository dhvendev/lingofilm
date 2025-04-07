"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import Hls from "hls.js";
import { X } from "lucide-react";

import ProgressBar from "./ProgressBar";
import PlaybackControls from "./PlaybackControls";
import VolumeControl from "./VolumeControl";
import SubtitleMenu from "./SubtitleMenu";
import QualityMenu from "./QualityMenu";
import Subtitles from "./Subtitles";
import TopControls from "./TopControls";
import BottomControls from "./BottomControls";
import { formatTime, parseSRT, timeToSeconds } from "./utils";

export default function Player() {
  // URLs for video and subtitles
  const src =
    "https://s3.lingofilm.ru/films/harry-potter-and-the-deathly-hallows-part-1-2010/480/movie.m3u8";
  const rus_sub =
    "https://s3.lingofilm.ru/films/harry-potter-and-the-deathly-hallows-part-1-2010/subtitles/rus.srt";
  const eng_sub =
    "https://s3.lingofilm.ru/films/harry-potter-and-the-deathly-hallows-part-1-2010/subtitles/eng.srt";

  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [quality, setQuality] = useState("480");
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [subtitles, setSubtitles] = useState({
    rus: false,
    eng: false,
    dual: false,
  });
  const [isHlsLoaded, setIsHlsLoaded] = useState(false);
  const [currentSubtitles, setCurrentSubtitles] = useState({
    rus: [],
    eng: [],
  });

  // Refs
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const hlsRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const lastMouseMoveRef = useRef(0);
  const wasPlayingRef = useRef(false);

  // Auto-hide controls panel
  useEffect(() => {
    if (!showPlayer) return;

    const handleMouseMove = () => {
      lastMouseMoveRef.current = Date.now();
      
      if (!showControls) {
        setShowControls(true);
      }
      
      // Reset current timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      // Set new timeout
      controlsTimeoutRef.current = setTimeout(() => {
        // Check if 3 seconds have passed since last mouse movement
        if (Date.now() - lastMouseMoveRef.current >= 3000 && isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const handleMouseLeave = () => {
      if (isPlaying && showControls) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    // Reset timeout when playback is stopped
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }

    const playerContainer = playerContainerRef.current;
    if (playerContainer) {
      playerContainer.addEventListener("mousemove", handleMouseMove);
      playerContainer.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (playerContainer) {
        playerContainer.removeEventListener("mousemove", handleMouseMove);
        playerContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [showPlayer, isPlaying, showControls]);

  // Initialize HLS after component mounting
  useEffect(() => {
    if (!showPlayer || !videoRef.current) return;

    const video = videoRef.current;
    let hls = null;

    const initializeHls = () => {
      try {
        if (Hls.isSupported()) {
          // Destroy existing hls instance if it exists
          if (hlsRef.current) {
            hlsRef.current.destroy();
          }

          hls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });

          hlsRef.current = hls;

          const videoSrc = src.replace("480", quality);

          // Set event handlers
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            console.log("HLS Media attached");
            hls.loadSource(videoSrc);
          });

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log("HLS Manifest parsed");
            setIsHlsLoaded(true);
            if (wasPlayingRef.current && video.paused) {
              video
                .play()
                .catch((err) => console.error("Error playing video:", err));
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.error("HLS network error:", data);
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.error("HLS media error:", data);
                  hls.recoverMediaError();
                  break;
                default:
                  console.error("HLS fatal error:", data);
                  hls.destroy();
                  initializeHls();
                  break;
              }
            } else {
              console.warn("HLS non-fatal error:", data);
            }
          });

          // Attach media element
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Native HLS support for Safari
          video.src = src.replace("480", quality);
          video.addEventListener("loadedmetadata", () => {
            setIsHlsLoaded(true);
            if (wasPlayingRef.current) {
              video
                .play()
                .catch((err) => console.error("Error playing video:", err));
            }
          });
        } else {
          console.error("HLS is not supported in this browser");
        }
      } catch (error) {
        console.error("Error initializing HLS:", error);
      }
    };

    initializeHls();

    // Cleanup on unmount
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [showPlayer, quality, src]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!showPlayer) return;

    const handleKeyDown = (e) => {
      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case " ":
          // Space - pause/play
          togglePlay();
          e.preventDefault();
          break;
        case "ArrowRight":
          // Right arrow - fast forward 15 sec
          seekTime(15);
          e.preventDefault();
          break;
        case "ArrowLeft":
          // Left arrow - rewind 15 sec
          seekTime(-15);
          e.preventDefault();
          break;
        case "m":
          // M - mute/unmute
          toggleMute();
          e.preventDefault();
          break;
        case "f":
          // F - fullscreen mode
          toggleFullScreen();
          e.preventDefault();
          break;
        case "ArrowUp":
          // Up arrow - increase volume
          setVolume(Math.min(volume + 5, 100));
          if (isMuted) setIsMuted(false);
          e.preventDefault();
          break;
        case "ArrowDown":
          // Down arrow - decrease volume
          setVolume(Math.max(volume - 5, 0));
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPlayer, volume, isMuted, isPlaying]);

  // Load subtitles when settings change
  useEffect(() => {
    if (!showPlayer || !isHlsLoaded) return;

    const loadSubtitles = async () => {
      try {
        // Load Russian subtitles if needed
        if (subtitles.rus || subtitles.dual) {
          const rusSubtitles = await parseSRT(rus_sub);
          setCurrentSubtitles((prev) => ({ ...prev, rus: rusSubtitles }));
        }

        // Load English subtitles if needed
        if (subtitles.eng || subtitles.dual) {
          const engSubtitles = await parseSRT(eng_sub);
          setCurrentSubtitles((prev) => ({ ...prev, eng: engSubtitles }));
        }
      } catch (error) {
        console.error("Error loading subtitles:", error);
      }
    };

    loadSubtitles();
  }, [subtitles, showPlayer, isHlsLoaded, rus_sub, eng_sub]);

  // Event handlers for player
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showPlayer) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      wasPlayingRef.current = true;
    };

    const handlePause = () => {
      setIsPlaying(false);
      wasPlayingRef.current = false;
    };

    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume * 100);
      setIsMuted(video.muted);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [showPlayer]);

  // More robust handling of clicks on words
  useEffect(() => {
    if (!showPlayer) return;

    const handleSubtitleWordClick = (event) => {
      // Check if the target element is a word in subtitles
      if (event.target.classList.contains("subtitle-word")) {
        const word = event.target.textContent.trim().replace(/[.,!?;:]/g, "");
        console.log(`Clicked word: ${word}`);

        // Here you can add logic to display translations
        // For example, opening a modal with translations
      }
    };

    // Add handler to container
    document.addEventListener("click", handleSubtitleWordClick);

    return () => {
      document.removeEventListener("click", handleSubtitleWordClick);
    };
  }, [showPlayer]);

  // Apply volume to video
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    video.volume = volume / 100;
    video.muted = isMuted;
  }, [volume, isMuted]);

  // Handle video quality change
  const handleQualityChange = (newQuality) => {
    if (quality === newQuality) return;

    try {
      const video = videoRef.current;
      if (!video) return;

      const currentTime = video.currentTime;
      wasPlayingRef.current = !video.paused;

      setQuality(newQuality);
      setIsHlsLoaded(false);

      // Save current time to restore after quality change
      video.addEventListener(
        "loadedmetadata",
        function onceLoaded() {
          video.removeEventListener("loadedmetadata", onceLoaded);
          video.currentTime = currentTime;
          if (wasPlayingRef.current) {
            video
              .play()
              .catch((err) => console.error("Error resuming playback:", err));
          }
        },
        { once: true }
      );
    } catch (error) {
      console.error("Error changing quality:", error);
    }
  };

  // Handle subtitle change
  const handleSubtitlesChange = (type) => {
    try {
      if (type === "rus") {
        setSubtitles({ rus: !subtitles.rus, eng: subtitles.eng, dual: false });
      } else if (type === "eng") {
        setSubtitles({ rus: subtitles.rus, eng: !subtitles.eng, dual: false });
      } else if (type === "dual") {
        setSubtitles({ rus: true, eng: true, dual: !subtitles.dual });
      } else if (type === "none") {
        setSubtitles({ rus: false, eng: false, dual: false });
      }
    } catch (error) {
      console.error("Error changing subtitles:", error);
    }
  };

  // Play/pause
  const togglePlay = () => {
    try {
      const video = videoRef.current;
      if (!video) return;

      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch((err) => console.error("Error playing video:", err));
      }
    } catch (error) {
      console.error("Error toggling play state:", error);
    }
  };

  // Mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Seek to specified time
  const seekTime = (seconds) => {
    try {
      const video = videoRef.current;
      if (!video) return;
      
      const newTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
      video.currentTime = newTime;
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

  // Toggle fullscreen
  const toggleFullScreen = () => {
    try {
      const container = playerContainerRef.current;
      if (!container) return;

      if (!isFullScreen) {
        if (container.requestFullscreen) {
          container
            .requestFullscreen()
            .catch((err) => console.error("Error entering fullscreen:", err));
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document
            .exitFullscreen()
            .catch((err) => console.error("Error exiting fullscreen:", err));
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    try {
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      }
    } catch (error) {
      console.error("Error changing volume:", error);
    }
  };

  // Open player
  const openPlayer = () => {
    setShowPlayer(true);
  };

  // Close player
  const closePlayer = () => {
    try {
      setShowPlayer(false);
      setIsPlaying(false);
      setIsHlsLoaded(false);

      if (videoRef.current) {
        videoRef.current.pause();
      }

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      // Clear subtitles
      setCurrentSubtitles({ rus: [], eng: [] });
    } catch (error) {
      console.error("Error closing player:", error);
    }
  };

  // Handle video click properly (fix bug where time resets on click)
  const handleVideoClick = (e) => {
    // Prevent the click from being processed if we're dragging the progress bar
    e.stopPropagation();
    togglePlay();
  };

  return (
    <>
      {!showPlayer ? (
        <Button variant="default" className="primary1 rounded" onClick={openPlayer}>
          Смотреть
        </Button>
      ) : (
        <div
          ref={playerContainerRef}
          className="fixed inset-0 bg-black z-50 flex flex-col cursor-default"
          style={{ cursor: showControls ? "default" : "none" }}
        >
          <div className="relative w-full h-full flex flex-col">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full"
              playsInline
              crossOrigin="anonymous"
              onClick={handleVideoClick}
            ></video>

            {/* Subtitles component */}
            <Subtitles
              subtitles={subtitles}
              currentSubtitles={currentSubtitles}
              currentTime={currentTime}
            />

            {/* Top controls (title and close button) */}
            <TopControls 
              showControls={showControls} 
              title="Harry Potter and the Deathly Hallows"
              onClose={closePlayer}
            />

            {/* Bottom controls panel */}
            <BottomControls showControls={showControls}>
              <ProgressBar 
                videoRef={videoRef} 
                duration={duration} 
                currentTime={currentTime} 
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <PlaybackControls 
                    isPlaying={isPlaying}
                    togglePlay={togglePlay}
                    seekTime={seekTime}
                    currentTime={currentTime}
                    duration={duration}
                  />
                </div>
              
                <div className="flex items-center space-x-2">
                  <SubtitleMenu 
                    subtitles={subtitles}
                    onSubtitlesChange={handleSubtitlesChange}
                  />
                  
                  <QualityMenu 
                    currentQuality={quality}
                    onQualityChange={handleQualityChange}
                  />
                  
                  <VolumeControl 
                    volume={volume}
                    isMuted={isMuted}
                    onVolumeChange={handleVolumeChange}
                    toggleMute={toggleMute}
                  />
                  
                  <Button
                    onClick={toggleFullScreen}
                    className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
                    variant="ghost"
                    size="icon"
                  >
                    {isFullScreen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                    )}
                  </Button>
                </div>
              </div>
            </BottomControls>
          </div>
        </div>
      )}
    </>
  );
}