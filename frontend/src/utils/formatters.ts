/**
 * Formats a duration in seconds to standard mm:ss format (e.g. 185 -> "3:05")
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

/**
 * Parses a string duration "mm:ss" to total seconds (e.g. "3:45" -> 225)
 */
export const parseDurationToSeconds = (durationStr?: string, defaultSeconds = 180): number => {
  if (!durationStr) return defaultSeconds;
  const parts = durationStr.split(":");
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10);
    const secs = parseInt(parts[1], 10);
    if (!isNaN(mins) && !isNaN(secs) && (mins > 0 || secs > 0)) {
      return mins * 60 + secs;
    }
  }
  return defaultSeconds;
};

/**
 * Formats dates into human-readable local date string
 */
export const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};
