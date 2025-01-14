import { useState, useEffect, useRef, useCallback } from "react";

// CSSをつけたい。
// import styled from "styled-components"
// const StyledButton = styled.button`
//   margin: auto;
//   border-radius: 9999px;
//   border: none;
//   display: block;
//   width: 120px;
//   height: 60px;
//   font-weight: bold;
//   cursor: pointer; 
//   background-color: ${ ({ isSelected }) => isSelected ? "pink" : "" };
// `


// どこにも参照されていないからコメントアウトする。
// import { BsSkipBackward } from "react-icons/bs";

// 参照されているが半濁になる？　
// しかもコメントアウトしても曲のインスタンスがある。　
// なぜ？　webpack compiled successfully　となるのか？
// 親でインポートしてるからか？
// でも、コメントアウトしたらvolumeが効いたので良しとする。
// import { tracks } from "../data/tracks";

// volume
import {IoMdVolumeHigh, IoMdVolumeOff, IoMdVolumeLow } from "react-icons/io"

// icons
import {
  IoPlayBackSharp,
  IoPlayForwardSharp,
  IoPlaySkipBackSharp,
  IoPlaySkipForwardSharp,
  IoPlaySharp,
  IoPauseSharp
} from 'react-icons/io5';


const Controls = ({ audioRef, progressBarRef, duration, setTimeProgress, tracks, trackIndex, setTrackIndex, setCurrentTrack }) => {
  // set variable and state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);
  const playAnimationRef = useRef();

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const repeat = useCallback(() => {
    // console.log('run');
    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);
    progressBarRef.current.value = currentTime;
    progressBarRef.current.style.setProperty(
      '--range-progress',
      `${(progressBarRef.current.value / duration) * 100}%`
    );
    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [audioRef, progressBarRef, duration, setTimeProgress])

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      // これと、
      // playAnimationRef.current = requestAnimationFrame(repeat);
    } else {
      audioRef.current.pause();
      // これを削除して、
      // cancelAnimationFrame(playAnimationRef.current)
    }
    // これをこっちに移動する意味がわからない。
    // useCallback()関数が再生を開始したらずっと動き続けていることに違和感がある。
    // とりあえず従うか。
    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [volume, isPlaying, audioRef, repeat]);

  useEffect(() => {
    if (audioRef) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);

  const skipForward = () => {
    audioRef.current.currentTime += 15;
  };

  const skipBackward = () => {
    audioRef.current.currentTime -= 15;
  };

  const handlePrevious = () => {
    if (trackIndex === 0) {
      let lastTrackIndex = tracks.length -1;
      setTrackIndex(lastTrackIndex);
      setCurrentTrack(tracks[lastTrackIndex]);
    } else {
      setTrackIndex((prev) => prev - 1);
      setCurrentTrack(tracks[trackIndex - 1]);
    }
  };

  const handleNext = () => {
    if (trackIndex >= tracks.length - 1) {
      setTrackIndex(0);
      setCurrentTrack(tracks[0]);
    } else {
      setTrackIndex((prev) => prev + 1);
      setCurrentTrack(tracks[trackIndex + 1]);
    }
  };

  useEffect(() => {
    if (audioRef) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume])

  // set css


  return (
    <div className="controls-wrapper">
      <div className="controls">
        <button onClick={handlePrevious}>
          <IoPlaySkipBackSharp />
        </button>
        <button onClick={skipBackward}>
          <IoPlayBackSharp />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
        </button>
        <button onClick={skipForward}> 
          <IoPlayForwardSharp />
        </button>
        <button onClick={handleNext}>
          <IoPlaySkipForwardSharp />
        </button>
      </div>

      <div className="volume-wrapper">
        <div className="volume">
          <button onClick={() => setMuteVolume((prev) => !prev)}>
            {muteVolume || volume < 5 ? (
              <IoMdVolumeOff />
            ) : volume < 40 ? (
              <IoMdVolumeLow />
            ) : (
              <IoMdVolumeHigh />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(e.target.value)} 
            style={{
              background: `linear-gradient(to right, #f50 ${volume}%, #ccc ${volume}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;