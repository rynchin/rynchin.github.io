import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { getNowPlaying } from "../services/spotify";
import "./SpotifyNowPlaying.css";

// Constants
const REFRESH_INTERVAL = 30000; // 30 seconds
const PROGRESS_INTERVAL = 1000; // 1 second

// Utility functions
const isTouchDevice = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

const formatTime = (ms) => {
  if (!ms) return "0:00";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Music icon
const MusicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="music-icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
  </svg>
);

// Progress bar
const ProgressBar = ({ currentProgress, duration }) => {
  const progressPercentage = useMemo(() => {
    if (!duration || !currentProgress) return 0;
    return Math.min((currentProgress / duration) * 100, 100);
  }, [currentProgress, duration]);

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="progress-time">
        {formatTime(currentProgress)} / {formatTime(duration)}
      </div>
    </div>
  );
};

// Now playing content
const NowPlayingContent = ({
  nowPlaying,
  currentProgress,
  isTouch,
  spotifyUrl,
}) => (
  <div className="now-playing">
    <div className="now-playing-header">
      <span className="now-playing-text">Now Playing</span>
    </div>

    {nowPlaying.albumImageUrl && (
      <img
        src={nowPlaying.albumImageUrl}
        alt={`${nowPlaying.album} cover`}
        className="album-art"
        loading="lazy"
      />
    )}

    <div className="song-info">
      <div className="song-title">{nowPlaying.title}</div>
      <div className="song-artist">{nowPlaying.artist}</div>
      <div className="song-album">{nowPlaying.album}</div>

      {nowPlaying.progressMs && nowPlaying.durationMs && (
        <ProgressBar
          currentProgress={currentProgress}
          duration={nowPlaying.durationMs}
        />
      )}
    </div>

    {isTouch && (
      <a
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="listen-on-spotify"
        onClick={(e) => e.stopPropagation()}
      >
        Listen on Spotify
      </a>
    )}
  </div>
);

// Not playing content
const NotPlayingContent = ({ isTouch }) => (
  <div className="not-playing">
    <span className="not-playing-text">Not currently playing</span>
    {isTouch && (
      <a
        href="https://open.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="listen-on-spotify"
        onClick={(e) => e.stopPropagation()}
      >
        Open Spotify
      </a>
    )}
  </div>
);

const SpotifyNowPlaying = () => {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const containerRef = useRef(null);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const data = await getNowPlaying();
      setNowPlaying(data);
      setCurrentProgress(data.progressMs || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching now playing:", error);
      setNowPlaying({ isPlaying: false });
      setLoading(false);
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isTouch) setIsVisible(true);
  }, [isTouch]);

  const handleMouseLeave = useCallback(() => {
    if (!isTouch) setIsVisible(false);
  }, [isTouch]);

  const handleClick = useCallback(
    (e) => {
      if (isTouch) {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    },
    [isTouch]
  );

  const spotifyUrl = useMemo(
    () => nowPlaying?.songUrl || "https://open.spotify.com",
    [nowPlaying?.songUrl]
  );

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  useEffect(() => {
    if (!isTouch || !isVisible) return;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isTouch, isVisible]);

  useEffect(() => {
    if (!nowPlaying?.isPlaying || !nowPlaying?.durationMs) return;

    const progressInterval = setInterval(() => {
      setCurrentProgress((prev) => {
        const newProgress = prev + PROGRESS_INTERVAL;

        if (newProgress >= nowPlaying.durationMs) {
          fetchNowPlaying();
          return nowPlaying.durationMs;
        }

        return newProgress;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(progressInterval);
  }, [nowPlaying?.isPlaying, nowPlaying?.durationMs, fetchNowPlaying]);

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="spotify-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="social-link spotify-link" onClick={handleClick}>
          <MusicIcon />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="spotify-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={isTouch && isVisible ? "#" : spotifyUrl}
        target={isTouch && isVisible ? "_self" : "_blank"}
        rel="noopener noreferrer"
        className="social-link spotify-link"
        onClick={handleClick}
      >
        <MusicIcon />
      </a>

      {isVisible && nowPlaying && (
        <div className="spotify-popup">
          {nowPlaying.isPlaying ? (
            <NowPlayingContent
              nowPlaying={nowPlaying}
              currentProgress={currentProgress}
              isTouch={isTouch}
              spotifyUrl={spotifyUrl}
            />
          ) : (
            <NotPlayingContent isTouch={isTouch} />
          )}
        </div>
      )}
    </div>
  );
};

export default SpotifyNowPlaying;
