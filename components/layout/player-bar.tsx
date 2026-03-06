"use client";

import { useMemo } from "react";
import { ChevronUp, Pause, Play, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlayer } from "@/Providers/Contexts/player-context";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { useSidebarState } from "@/Providers/Contexts/SidebarContext";

const formatTime = (time: number) => {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function PlayerBar() {
  const { isAuthenticated } = useAuth();
  const { collapsed, isMounted } = useSidebarState();
  const {
    currentSong,
    isPlaying,
    isBarVisible,
    shuffleEnabled,
    repeatMode,
    currentTime,
    duration,
    volume,
    togglePlay,
    setBarVisible,
    playNext,
    playPrevious,
    seekTo,
    toggleShuffle,
    cycleRepeatMode,
    setVolume,
  } = usePlayer();

  const repeatLabel = useMemo(() => {
    if (repeatMode === "one") return "Repeat one";
    if (repeatMode === "all") return "Repeat all";
    return "Repeat off";
  }, [repeatMode]);

  const shuffleLabel = useMemo(() => {
    return shuffleEnabled ? "Shuffle on" : "Shuffle off";
  }, [shuffleEnabled]);

  if (!isAuthenticated || !currentSong) return null;

  const sidebarOffset = isMounted ? (collapsed ? 64 : 256) : 0;

  return (
    <>
      <div
        className={`fixed bottom-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md transition-transform duration-300 ease-out ${
          isBarVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ left: sidebarOffset }}
      >
        <div className="flex flex-col gap-2 px-4 py-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={getSongCoverUrl(currentSong.coverImageUrl || "")}
              alt={currentSong.title || "Now playing"}
              className="h-12 w-12 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {currentSong.title || "Unknown title"}
              </p>
              <p className="truncate text-xs text-foreground-muted">
                {currentSong.artist || "Unknown artist"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleShuffle()}
                  className={`relative ${shuffleEnabled ? "text-primary bg-primary/15 ring-1 ring-primary/60" : "text-foreground-muted"}`}
                  aria-label={shuffleLabel}
                >
                  <Shuffle className="h-4 w-4" />
                  {shuffleEnabled && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary shadow" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{shuffleLabel}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => playPrevious()}
                  aria-label="Previous"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Previous</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => togglePlay()}
                  className="h-10 w-10 rounded-full"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{isPlaying ? "Pause" : "Play"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => playNext()}
                  aria-label="Next"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Next</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => cycleRepeatMode()}
                  className={`relative ${repeatMode !== "off" ? "text-primary" : "text-foreground-muted"}`}
                  aria-label={repeatLabel}
                >
                  <Repeat className="h-4 w-4" />
                  {repeatMode === "one" && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      1
                    </span>
                  )}
                  {repeatMode === "all" && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      A
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{repeatLabel}</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setBarVisible(false)}
                  aria-label="Hide player"
                >
                  <ChevronUp className="h-4 w-4 rotate-180" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Hide player</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-12 text-xs text-foreground-muted">{formatTime(currentTime)}</span>
          <Slider
            value={[Math.min(currentTime, duration || 0)]}
            min={0}
            max={duration || 0}
            step={1}
            onValueChange={(value) => seekTo(value[0] || 0)}
            className="flex-1"
          />
          <span className="w-12 text-xs text-foreground-muted">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-foreground-muted" />
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(value) => setVolume(value[0] || 0)}
            className="w-24"
          />
        </div>
        </div>
      </div>

      <div
        className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-out ${
          isBarVisible ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg bg-gradient-primary text-primary-foreground"
              onClick={() => setBarVisible(true)}
              aria-label="Show player"
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Show player</TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
