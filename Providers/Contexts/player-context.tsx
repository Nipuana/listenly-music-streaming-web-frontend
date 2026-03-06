"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getFullMediaUrl } from "@/lib/utils/image-util";
import { useAuth } from "@/Providers/Contexts/auth-context";
import {
  clearPlayerStateCookie,
  getPlayerStateCookie,
  setPlayerStateCookie,
} from "@/lib/cookies/player-state-cookie";
import { addRecentSong } from "@/lib/cookies/recent-songs-cookie";
import { addSessionSong, clearSessionSongs } from "@/lib/cookies/session-songs-cookie";
import { incrementGenreCounter } from "@/lib/cookies/genre-counters-cookie";

export interface PlayerSong {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  duration?: string;
  coverImageUrl?: string;
  audioUrl?: string;
  uploadedBy?: string | { _id?: string; id?: string; [key: string]: unknown };
}

type RepeatMode = "off" | "one" | "all";

interface PlayerState {
  queue: PlayerSong[];
  currentIndex: number;
  isPlaying: boolean;
  isBarVisible: boolean;
  shuffleEnabled: boolean;
  repeatMode: RepeatMode;
  currentTime: number;
  duration: number;
  volume: number;
}

interface PersistedState {
  currentSong: PlayerSong | null;
  isPlaying: boolean;
  isBarVisible: boolean;
  shuffleEnabled: boolean;
  repeatMode: RepeatMode;
  currentTime: number;
  volume: number;
}

interface PlayerContextValue extends PlayerState {
  currentSong: PlayerSong | null;
  playQueue: (songs: PlayerSong[], startIndex?: number) => void;
  playSong: (song: PlayerSong) => void;
  togglePlay: () => void;
  setBarVisible: (visible: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

const getStoredState = (): PersistedState | null =>
  getPlayerStateCookie<PersistedState>();

const setStoredState = (state: PersistedState) => {
  setPlayerStateCookie(state);
};

const clearStoredState = () => {
  clearPlayerStateCookie();
};

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const historyRef = useRef<number[]>([]);
  const pendingSeekRef = useRef(0);
  const [queue, setQueue] = useState<PlayerSong[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBarVisible, setIsBarVisible] = useState(true);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);

  const currentSong = queue[currentIndex] || null;

  const applySource = useCallback(
    (song: PlayerSong | null, startTime = 0) => {
      if (!audioRef.current) return;
      if (!song?.audioUrl) {
        audioRef.current.pause();
        return;
      }
      const resolvedUrl = getFullMediaUrl(song.audioUrl);
      if (!resolvedUrl) return;
      audioRef.current.src = resolvedUrl;
      audioRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    },
    []
  );

  const playQueue = useCallback(
    (songs: PlayerSong[], startIndex = 0) => {
      if (!songs.length) return;
      historyRef.current = [];
      pendingSeekRef.current = 0;
      setQueue(songs);
      setCurrentIndex(startIndex);
      setIsPlaying(true);
      setCurrentTime(0);

      // Track the song being played
      const songToPlay = songs[startIndex];
      if (songToPlay) {
        addRecentSong(songToPlay);
        addSessionSong(songToPlay);
        if (songToPlay.genre) {
          incrementGenreCounter(songToPlay.genre);
        }
      }
    },
    []
  );

  const playSong = useCallback(
    (song: PlayerSong) => {
      // Track the song being played
      addRecentSong(song);
      addSessionSong(song);
      if (song.genre) {
        incrementGenreCounter(song.genre);
      }
      playQueue([song], 0);
    },
    [playQueue]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const setBarVisible = useCallback((visible: boolean) => {
    setIsBarVisible(visible);
  }, []);

  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffleEnabled((prev) => !prev);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      switch (prev) {
        case "off":
          return "one";
        case "one":
          return "all";
        case "all":
        default:
          return "off";
      }
    });
  }, []);

  const getNextIndex = useCallback(
    () => {
      if (queue.length === 0) return -1;
      if (shuffleEnabled) {
        if (queue.length === 1) return currentIndex;
        let nextIndex = currentIndex;
        while (nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * queue.length);
        }
        return nextIndex;
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex < queue.length) return nextIndex;

      // when at end of queue
      if (repeatMode === "all" && queue.length > 0) {
        return 0;
      }

      return -1;
    },
    [queue.length, shuffleEnabled, currentIndex, repeatMode]
  );

  const playNext = useCallback(
    () => {
      const nextIndex = getNextIndex();
      if (nextIndex === -1) {
        setIsPlaying(false);
        return;
      }
      historyRef.current.push(currentIndex);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
      setCurrentTime(0);

      // Track the new song being played
      const nextSong = queue[nextIndex];
      if (nextSong) {
        addRecentSong(nextSong);
        addSessionSong(nextSong);
        if (nextSong.genre) {
          incrementGenreCounter(nextSong.genre);
        }
      }
    },
    [currentIndex, getNextIndex, queue]
  );

  const playPrevious = useCallback(() => {
    let newIndex = currentIndex;
    if (historyRef.current.length > 0) {
      newIndex = historyRef.current.pop() as number;
    } else if (currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return; // No previous song
    }

    setCurrentIndex(newIndex);
    setIsPlaying(true);
    setCurrentTime(0);

    // Track the song being played
    const prevSong = queue[newIndex];
    if (prevSong) {
      addRecentSong(prevSong);
      addSessionSong(prevSong);
      if (prevSong.genre) {
        incrementGenreCounter(prevSong.genre);
      }
    }
  }, [currentIndex, queue]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => undefined);
        return;
      }
      // if repeatMode is "all" the getNextIndex helper will wrap back,
      // so playNext handles it automatically
      playNext();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playNext, repeatMode]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (!currentSong) return;

    const startTime = pendingSeekRef.current || 0;
    applySource(currentSong, startTime);
    pendingSeekRef.current = 0;
  }, [currentSong, applySource]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (!currentSong?.audioUrl) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isPlaying) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      audioRef.current?.pause();
      setQueue([]);
      setCurrentIndex(0);
      setIsPlaying(false);
      setIsBarVisible(true);
      setCurrentTime(0);
      setDuration(0);
      historyRef.current = [];
      pendingSeekRef.current = 0;
      clearStoredState();
      clearSessionSongs();
      return;
    }

    const stored = getStoredState();
    if (!stored || !stored.currentSong) return;

    setQueue([stored.currentSong]);
    setCurrentIndex(0);
    setShuffleEnabled(!!stored.shuffleEnabled);
    setRepeatMode(stored.repeatMode === "one" || stored.repeatMode === "all" ? stored.repeatMode : "off");
    setCurrentTime(stored.currentTime || 0);
    setDuration(0);
    setIsPlaying(!!stored.isPlaying);
    setIsBarVisible(stored.isBarVisible ?? true);
    setVolume(stored.volume ?? 0.7);

    pendingSeekRef.current = stored.currentTime || 0;
    applySource(stored.currentSong, stored.currentTime || 0);
  }, [applySource, isAuthenticated, loading]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    setStoredState({
      currentSong,
      isPlaying,
      isBarVisible,
      shuffleEnabled,
      repeatMode,
      currentTime,
      volume,
    });
  }, [currentSong, isPlaying, isBarVisible, shuffleEnabled, repeatMode, currentTime, volume, isAuthenticated, loading]);

  const value = useMemo(
    () => ({
      queue,
      currentIndex,
      isPlaying,
      isBarVisible,
      shuffleEnabled,
      repeatMode,
      currentTime,
      duration,
      volume,
      currentSong,
      playQueue,
      playSong,
      togglePlay,
      setBarVisible,
      playNext,
      playPrevious,
      seekTo,
      toggleShuffle,
      cycleRepeatMode,
      setVolume,
    }),
    [
      queue,
      currentIndex,
      isPlaying,
      isBarVisible,
      shuffleEnabled,
      repeatMode,
      currentTime,
      duration,
      currentSong,
      playQueue,
      playSong,
      togglePlay,
      setBarVisible,
      playNext,
      playPrevious,
      seekTo,
      toggleShuffle,
      cycleRepeatMode,
      volume,
      setVolume,
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
