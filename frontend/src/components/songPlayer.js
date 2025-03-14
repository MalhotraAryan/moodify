import React, { useState, useRef, useEffect } from "react";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const SongPlayer = ({ songs }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Current song data
  const currentSong = songs[currentSongIndex];

  // Play or pause audio
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0);
    }
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const percentPlayed =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percentPlayed || 0);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSongEnd = () => {
    nextSong();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const clickPositionX = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const seekTime = (clickPositionX / progressBarWidth) * duration;

    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    setProgress((seekTime / duration) * 100);
  };

  // Play the new song when currentSongIndex changes
  useEffect(() => {
    // console.log(audioRef.current);
    setDuration(currentSong.duration);
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [currentSongIndex, currentSong, isPlaying]);

  return (
    <div className="song-player">
        <img
            src={currentSong.album_image}
            alt="Album Cover"
            className="album-image"/>

        {/* Current song info */}
        <div className="song-info">
            <h4>{currentSong?.song_name || "No Song Playing"}</h4>
            <p>{currentSong?.artist_name || "Unknown Artist"}</p>
        </div>

        {/* Playback controls */}
        <div className="playback-button-outer">
            <button onClick={togglePlay} className="playback-button-inner">
            {/* {isPlaying ? "Pause" : "Play"} */}
            {isPlaying ? <PauseCircleIcon className="play-icon"/> : <PlayCircleIcon className="play-icon"/>}
            </button>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-outer">
            {/* Current time */}
            <span className="progress-bar-time-left">{formatTime(currentTime)}</span>
            {/* Progress bar */}
            <div className="progress-bar-inner" onClick={handleSeek}
            >
                <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "#FFD700" }}></div>
            </div>
            {/* Remaining time */}
            <span className="progress-bar-time-right">
            {formatTime(duration - currentTime)}
            </span>
        </div>

        {/* Hidden audio element */}
        <audio
            ref={audioRef}
            src={currentSong?.audio_link || ""}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleSongEnd}
        ></audio>
        <div className="playback-button-outer">
            <button onClick={nextSong} className="playback-button-inner">
                {<SkipNextIcon className="play-icon"/>}
            </button>
        </div>
    </div>
  );
};

export default SongPlayer;
