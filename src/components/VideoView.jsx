import { useEffect, useRef, useState, useContext } from 'react';
import ImageVideoViewSkeleton from './ImageVideoViewSkeleton';
import IconButton from './IconButton';
import SVGOutlineReset from './svgs/outline/SVGOutlineReset';
import SVGOutlineCollapseArrow from './svgs/outline/SVGOutlineCollapseArrow';
import SVGOutlineExpandArrow from './svgs/outline/SVGOutlineExpandArrow';
import SVGOutlineMute from './svgs/outline/SVGOutlineMute';
import SVGOutlineUnmute from './svgs/outline/SVGOutlineUnmute';
import SVGOutlinePlay from './svgs/outline/SVGOutlinePlay';
import SVGOutlinePause from './svgs/outline/SVGOutlinePause';
import { FullscreenContext } from '../common/contexts';
import Slider from './Slider';
import { formatDuration } from '../common/helpers';

function VideoView({ images, videos, isMasonryView }) {
  const ref = useRef();
  const parentRef = useRef();
  const sliderRef = useRef();
  const timeoutRef = useRef();

  const { isFullscreen } = useContext(FullscreenContext);
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
    if (ref && ref.current) ref.current.play();
  }

  function handleVideoEnd() {
    if (!isMasonryView) {
      clearTimeout(timeoutRef.current);
      setIsPaused(true);
      setIsDone(true);
      setShowControlsView(true);
    }
  }

  useEffect(() => {
    if (!isFullscreen && isDone) {
      setShowControlsView(true);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const progress = (elapsedDuration / videos[0].duration) * 100;
    if (sliderRef.current) {
      sliderRef.current.style.background = `linear-gradient(to right, var(--color-rose-500) ${progress}%, var(--color-neutral-700) ${progress}%)`;
    }
  }, [elapsedDuration]);

  return (
    <div
      className={`relative flex justify-center`}
      onMouseMove={isMasonryView ? null : () => handleMouseMove()}
      onMouseLeave={isMasonryView ? null : () => handleMouseLeave()}
      ref={parentRef}
    >
      {isLoadingFile && (
        <ImageVideoViewSkeleton
          isMasonryView={isMasonryView}
          width={videos[0].width}
          height={videos[0].height}
        />
      )}
      <video
        ref={ref}
        width=""
        height=""
        controls={false}
        poster={`${!isMasonryView && images[0] ? `https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/images/${images[0].name}` : ''}`}
        style={{ aspectRatio: `${videos[0].width}/${videos[0].height}` }}
        className={`rounded-lg bg-black ${isLoadingFile ? 'hidden' : 'block'} full relative`}
        autoPlay={isMasonryView ? false : true}
        loop={isMasonryView ? true : false}
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
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/videos/${videos[0].name}`}
          type="video/mp4"
        />
        <source
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/videos/${videos[0].name}`}
          type="video/m4v"
        />
        <source
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/videos/${videos[0].name}`}
          type="video/mov"
        />
      </video>
      {!isLoadingFile && (
        <div
          className={`absolute bottom-0 left-0 flex w-full flex-col gap-4 rounded-b-lg bg-black/50 p-4 backdrop-blur ${showControlsView ? 'opacity-100' : 'opacity-0'}`}
        >
          <Slider
            max={videos[0].duration}
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
              {formatDuration(videos[0].duration)}
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

export default VideoView;
