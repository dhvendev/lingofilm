// Format time (seconds -> MM:SS)
export const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
  
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  
  // Convert time from HH:MM:SS,MSS format to seconds
  export const timeToSeconds = (timeString) => {
    const [time, milliseconds] = timeString.split(",");
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return (
      hours * 3600 + minutes * 60 + seconds + parseInt(milliseconds, 10) / 1000
    );
  };
  
  // Parse SRT file
  export const parseSRT = async (url) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
  
      // Split by double newlines to get subtitle blocks
      const blocks = text.trim().split(/\r?\n\r?\n/);
      const subtitles = [];
  
      for (const block of blocks) {
        const lines = block.split(/\r?\n/);
        if (lines.length < 3) continue;
  
        // Get times
        const timeLine = lines[1];
        const timeMatch = timeLine.match(
          /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/
        );
        if (!timeMatch) continue;
  
        // Convert times to seconds
        const startTime = timeToSeconds(timeMatch[1]);
        const endTime = timeToSeconds(timeMatch[2]);
  
        // Get subtitle text (all remaining lines)
        const subtitleText = lines.slice(2).join(" ");
  
        subtitles.push({
          id: parseInt(lines[0], 10),
          start: startTime,
          end: endTime,
          text: subtitleText,
        });
      }
  
      return subtitles;
    } catch (error) {
      console.error("Error parsing subtitles:", error);
      return [];
    }
  };