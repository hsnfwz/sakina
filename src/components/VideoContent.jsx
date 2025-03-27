import { useEffect, useRef, useState, useContext } from 'react';
import IconButton from './IconButton';
import SVGOutlineReset from './svgs/outline/SVGOutlineReset';
import SVGOutlineCollapseArrow from './svgs/outline/SVGOutlineCollapseArrow';
import SVGOutlineExpandArrow from './svgs/outline/SVGOutlineExpandArrow';
import SVGOutlineMute from './svgs/outline/SVGOutlineMute';
import SVGOutlineUnmute from './svgs/outline/SVGOutlineUnmute';
import SVGOutlinePlay from './svgs/outline/SVGOutlinePlay';
import SVGOutlinePause from './svgs/outline/SVGOutlinePause';
import Slider from './Slider';
import { formatDuration } from '../common/helpers';

function VideoContent({ video, isPreview, isAutoPlay }) {
  const ref = useRef();
  const parentRef = useRef();
  const sliderRef = useRef();
  const timeoutRef = useRef();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(true);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [showControlsView, setShowControlsView] = useState(false);

  const [elapsedDuration, setElapsedDuration] = useState(0);

  function handleMouseMove() {
    if (!isDone) {
      if (!showControlsView) {
        setShowControlsView(true);
      }
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowControlsView(false);
      }, 3000);
    }
  }

  function handleMouseLeave() {
    if (!isDone) {
      setShowControlsView(false);
      clearTimeout(timeoutRef.current);
    }
  }

  function handleVideoStart() {
    setIsLoadingFile(false);
    if (ref && ref.current && isAutoPlay) ref.current.play();
  }

  function handleVideoEnd() {
    if (!isPreview) {
      clearTimeout(timeoutRef.current);
      setIsPaused(true);
      setIsDone(true);
      setShowControlsView(true);
    }
  }

  useEffect(() => {
    if (!isPreview) {
      const handleEvent = () => {
        if (document.fullscreenElement) {
          setIsFullscreen(true);
        } else {
          setIsFullscreen(false);
        }
      };

      document.addEventListener('fullscreenchange', handleEvent);

      return () => {
        document.removeEventListener('fullscreenchange', handleEvent);
      };
    }
  }, []);

  useEffect(() => {
    if (!isFullscreen && isDone) {
      setShowControlsView(true);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const progress = (elapsedDuration / video.duration) * 100;
    if (sliderRef.current) {
      sliderRef.current.style.background = `linear-gradient(to right, var(--color-rose-500) ${progress}%, var(--color-neutral-700) ${progress}%)`;
    }
  }, [elapsedDuration]);

  return (
    <div
      className={`relative flex h-full w-full justify-center`}
      onMouseMove={isPreview ? null : () => handleMouseMove()}
      onMouseLeave={isPreview ? null : () => handleMouseLeave()}
      ref={parentRef}
    >
      <video
        ref={ref}
        // width={video.video_orientation === 'LANDSCAPE' ? 1920 : 1080}
        // height={video.video_orientation === 'PORTRAIT' ? 1080 : 1920}
        controls={false}
        poster={`${!isPreview && video.video_thumbnail_file_name ? `https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/images/${video.video_thumbnail_file_name}` : ''}`}
        // style={{ aspectRatio: `${video.video_orientation === 'LANDSCAPE' ? '16 / 9' : '9 / 16'}` }}
        className={`bg-black ${isLoadingFile ? 'hidden' : 'block'} relative w-full`}
        autoPlay={isAutoPlay}
        loop={isAutoPlay}
        muted={isMuted}
        onEnded={handleVideoEnd}
        onCanPlay={handleVideoStart}
        onTimeUpdate={(event) => {
          setElapsedDuration(event.target.currentTime);
        }}
        onClick={() => {
          if (isPaused) {
            ref.current.play();
          } else {
            ref.current.pause();
          }

          if (isDone) setIsDone(false);

          setIsPaused(!isPaused);
        }}
        onDoubleClick={() => {
          if (isFullscreen) {
            document.exitFullscreen();
          } else {
            parentRef.current.requestFullscreen();
          }
        }}
      >
        <source
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/videos/${video.video_file_name}`}
          type="video/mp4"
        />
        <source
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/videos/${video.video_file_name}`}
          type="video/m4v"
        />
        <source
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/videos/${video.video_file_name}`}
          type="video/mov"
        />
      </video>
      {!isLoadingFile && (
        <div
          className={`absolute bottom-0 left-0 flex w-full flex-col gap-4 bg-black/50 p-4 backdrop-blur ${showControlsView ? 'opacity-100' : 'opacity-0'}`}
        >
          <Slider
            max={video.video_duration}
            value={elapsedDuration}
            handleInput={(event) => {
              setElapsedDuration(event.target.value);

              ref.current.currentTime = event.target.value;

              if (!isPaused) ref.current.play();
              if (isDone) setIsDone(false);
            }}
            sliderRef={sliderRef}
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2 self-start">
              {isDone && (
                <IconButton
                  handleClick={() => {
                    ref.current.play();
                    setIsPaused(!isPaused);
                    setIsDone(false);
                  }}
                >
                  <SVGOutlineReset />
                </IconButton>
              )}
              {!isDone && (
                <>
                  <IconButton
                    handleClick={() => {
                      if (isPaused) {
                        ref.current.play();
                      } else {
                        ref.current.pause();
                      }

                      setIsPaused(!isPaused);
                    }}
                  >
                    {isPaused ? <SVGOutlinePlay /> : <SVGOutlinePause />}
                  </IconButton>
                  <IconButton
                    handleClick={() => {
                      if (isMuted) {
                        ref.current.muted = false;
                      } else {
                        ref.current.muted = true;
                      }

                      setIsMuted(!isMuted);
                    }}
                  >
                    {isMuted ? <SVGOutlineMute /> : <SVGOutlineUnmute />}
                  </IconButton>
                </>
              )}
            </div>
            <p>
              {formatDuration(elapsedDuration)} /{' '}
              {formatDuration(video.video_duration)}
            </p>
            <div className="self-end">
              <IconButton
                handleClick={() => {
                  if (isFullscreen) {
                    document.exitFullscreen();
                  } else {
                    parentRef.current.requestFullscreen();
                  }
                }}
              >
                {isFullscreen ? (
                  <SVGOutlineCollapseArrow />
                ) : (
                  <SVGOutlineExpandArrow />
                )}
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoContent;
