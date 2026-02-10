export const formatRelativeTime = (iso?: string) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (sec < 10) return "just now";
  if (sec < 60) return `${sec} sec${sec > 1 ? "s" : ""} ago`;
  if (min < 60) return `${min} min${min > 1 ? "s" : ""} ago`;
  if (hr < 24) return `${hr} hour${hr > 1 ? "s" : ""} ago`;
  if (day < 30) return `${day} day${day > 1 ? "s" : ""} ago`;
  if (month < 12) return `${month} month${month > 1 ? "s" : ""} ago`;
  return `${year} year${year > 1 ? "s" : ""} ago`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = secs.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }
  return `${minutes}:${formattedSeconds}`;
};
