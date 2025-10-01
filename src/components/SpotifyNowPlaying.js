import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getNowPlaying } from "../services/spotify";
import "./SpotifyNowPlaying.css";

const REFRESH_INTERVAL = 30000; // 30 seconds
const PROGRESS_INTERVAL = 1000; // 1 second

const formatTime = (ms) => {
  if (!ms) return "0:00";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SpotifyNowPlaying = () => {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);

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

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  // Live progress simulation
  useEffect(() => {
    if (!nowPlaying?.isPlaying || !nowPlaying?.durationMs) return;

    const progressInterval = setInterval(() => {
      setCurrentProgress((prev) => {
        const newProgress = prev + PROGRESS_INTERVAL;

        // Auto-refetch when song ends
        if (newProgress >= nowPlaying.durationMs) {
          fetchNowPlaying();
          return nowPlaying.durationMs;
        }

        return newProgress;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(progressInterval);
  }, [nowPlaying?.isPlaying, nowPlaying?.durationMs, fetchNowPlaying]);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  const spotifyUrl = useMemo(
    () => nowPlaying?.songUrl || "https://open.spotify.com",
    [nowPlaying?.songUrl]
  );

  const progressPercentage = useMemo(() => {
    if (!nowPlaying?.durationMs || !currentProgress) return 0;
    return Math.min((currentProgress / nowPlaying.durationMs) * 100, 100);
  }, [currentProgress, nowPlaying?.durationMs]);

  if (loading) {
    return (
      <div
        className="social-link spotify-link"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        🎵
      </div>
    );
  }

  return (
    <div
      className="spotify-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="social-link spotify-link"
      >
        🎵
      </a>

      {isVisible && nowPlaying && (
        <div className="spotify-popup">
          {nowPlaying.isPlaying ? (
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
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="progress-time">
                      {formatTime(currentProgress)} /{" "}
                      {formatTime(nowPlaying.durationMs)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="not-playing">
              <span className="not-playing-text">Not currently playing</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotifyNowPlaying;
