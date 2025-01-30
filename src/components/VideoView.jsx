import { useEffect, useRef, useState, useContext } from "react";
import ImageVideoViewSkeleton from "./ImageVideoViewSkeleton";
import IconButton from "./IconButton";
import SVGRestart from "./svg/SVGRestart";
import SVGArrowsIn from "./svg/SVGArrowsIn";
import SVGArrowsOut from "./svg/SVGArrowsOut";
import SVGSoundOff from "./svg/SVGSoundOff";
import SVGSoundOn from "./svg/SVGSoundOn";
import SVGPlay from "./svg/SVGPlay";
import SVGPause from "./svg/SVGPause";
import { FullscreenContext } from "../common/contexts";
import Slider from "./Slider";
import { formatDuration } from "../common/helpers";

function VideoView({ images, videos, isMasonryView, showControls }) {
  const ref = useRef();
  const parentRef = useRef();
  const sliderRef = useRef();
  const timeoutRef = useRef();

  const { isFullscreen } = useContext(FullscreenContext);
  const [isLoadingFile, setIsLoadingFile] = useState(true);

  const fileThumbnail = images[0];
  const fileVideo = videos[0];

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
    const progress = (elapsedDuration / fileVideo.duration) * 100;
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
      <ImageVideoViewSkeleton
        show={isLoadingFile}
        isMasonryView={isMasonryView}
        width={fileVideo.width}
        height={fileVideo.height}
      />
      <video
        ref={ref}
        width=""
        height=""
        controls={false}
        poster={`${!isMasonryView && fileThumbnail ? `https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/images/${fileThumbnail.name}` : ""}`}
        style={{ aspectRatio: `${fileVideo.width}/${fileVideo.height}` }}
        className={`rounded-lg bg-neutral-700 ${isLoadingFile ? "hidden" : "block"} full relative`}
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
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/videos/${fileVideo.name}`}
          type="video/mp4"
        />
        <source
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/videos/${fileVideo.name}`}
          type="video/m4v"
        />
        <source
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/videos/${fileVideo.name}`}
          type="video/mov"
        />
      </video>
      {!isLoadingFile && (
        <div
          className={`absolute bottom-0 left-0 flex w-full flex-col gap-4 rounded-b-lg bg-black/50 p-4 backdrop-blur ${showControlsView ? "opacity-100" : "opacity-0"}`}
        >
          <Slider
            max={fileVideo.duration}
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
                  <SVGRestart />
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
                    {isPaused ? <SVGPlay /> : <SVGPause />}
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
                    {isMuted ? <SVGSoundOff /> : <SVGSoundOn />}
                  </IconButton>
                </>
              )}
            </div>
            <p>
              {formatDuration(elapsedDuration)} /{" "}
              {formatDuration(fileVideo.duration)}
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
                {isFullscreen ? <SVGArrowsIn /> : <SVGArrowsOut />}
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoView;
