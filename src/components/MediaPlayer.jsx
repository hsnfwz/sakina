import { useEffect, useRef, useState } from 'react';
import { formatDuration } from '../common/helpers';
import Button from '../components/Button';
import SVGOutlineReset from '../components/svgs/outline/SVGOutlineReset';
import SVGOutlineCollapseArrow from '../components/svgs/outline/SVGOutlineCollapseArrow';
import SVGOutlineExpandArrow from '../components/svgs/outline/SVGOutlineExpandArrow';
import SVGOutlineMute from '../components/svgs/outline/SVGOutlineMute';
import SVGOutlineUnmute from '../components/svgs/outline/SVGOutlineUnmute';
import SVGOutlinePlay from '../components/svgs/outline/SVGOutlinePlay';
import SVGOutlinePause from '../components/svgs/outline/SVGOutlinePause';
import Slider from '../components/Slider';
import Loading from '../components/Loading';
import { BUTTON_COLOR } from '../common/enums';

function MediaPlayer({ media, mediaType, width, height }) {
  const mediaRef = useRef();
  const parentRef = useRef();
  const sliderRef = useRef();
  const timeoutRef = useRef();

  const playPauseButtonRef = useRef();
  const resetButtonRef = useRef();
  const muteUnmuteButtonRef = useRef();
  const expandCollapseButtonRef = useRef();

  const [isLoadingActiveMedia, setIsLoadingActiveMedia] = useState(false);
  const [activeMediaEvent, setActiveMediaEvent] = useState('');
  const [isActiveMediaPlaying, setIsActiveMediaPlaying] = useState(true);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);

  const [isMuted, setIsMuted] = useState(true);
  const [showControlsView, setShowControlsView] = useState(false);

  const [elapsedDuration, setElapsedDuration] = useState(0);


  function handleMouseMove() {
    if (elapsedDuration !== media.duration) {
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
    if (elapsedDuration !== media.duration) {
      setShowControlsView(false);
      clearTimeout(timeoutRef.current);
    }
  }

  function handleMediaEnd() {
    clearTimeout(timeoutRef.current);
    setShowControlsView(true);
  }

  useEffect(() => {
      const progress = (elapsedDuration / media.duration) * 100;
      if (sliderRef && sliderRef.current) {
        sliderRef.current.style.background = `linear-gradient(to right, white ${progress}%, var(--color-white-transparent) ${progress}%)`;
      }
  }, [elapsedDuration]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      setShowControlsView(true);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleEvent = (event) => {
      setActiveMediaEvent(event);
    };

    document.addEventListener('keydown', handleEvent);

    return () => {
      document.removeEventListener('keydown', handleEvent);
    };
  }, []);

  function handlePlayPause(reset) {
    if (reset) {
      mediaRef.current.currentTime = 0;
      mediaRef.current.play();
    } else {
      if (isActiveMediaPlaying) {
        mediaRef.current.play();
      } else {
        mediaRef.current.pause();
      }
    }
  }

  useEffect(() => {
    if (mediaRef && mediaRef.current) {
      if (
        activeMediaEvent.code === 'Space' &&
        document.activeElement !== playPauseButtonRef.current &&
        document.activeElement !== muteUnmuteButtonRef.current &&
        document.activeElement !== expandCollapseButtonRef.current &&
        document.activeElement !== resetButtonRef.current
      ) {
        if (elapsedDuration === media.duration) {
          handlePlayPause(true);
        } else {
          setIsActiveMediaPlaying(!isActiveMediaPlaying);
        }
      }
    }
  }, [activeMediaEvent]);

  useEffect(() => {
    if (mediaRef && mediaRef.current) {
      handlePlayPause();
    }
  }, [isActiveMediaPlaying]);

  if (isLoadingActiveMedia) {
    return <Loading />;
  }

    return (
      <div
        className={`relative flex justify-center`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={parentRef}
      >
        <video
          ref={mediaRef}
          width={width}
          height={height}
          controls={false}
          className={`rounded-lg bg-black ${isLoadingMedia ? 'hidden' : 'block'} full relative aspect-[16/9]`}
          autoPlay={true}
          loop={false}
          muted={isMuted}
          onEnded={handleMediaEnd}
          onCanPlay={() => setIsLoadingMedia(false)}
          onTimeUpdate={(event) => {
            setElapsedDuration(event.target.currentTime);
          }}
          onClick={() => setIsActiveMediaPlaying(!isActiveMediaPlaying)}
          onDoubleClick={() => {
            if (isFullscreen) {
              document.exitFullscreen();
            } else {
              parentRef.current.requestFullscreen();
            }
          }}
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/${mediaType}/${media.file_name}`}
        />
        <div
          className={`pulse aspect-[16/9] w-full rounded-lg bg-neutral-200 ${isLoadingMedia ? 'block' : 'hidden'} `}
        ></div>
        {!isLoadingMedia && (
          <div
            className={`absolute bottom-0 left-0 flex w-full flex-col gap-4 rounded-b-lg bg-black/50 p-4 backdrop-blur-sm ${showControlsView ? 'opacity-100' : 'opacity-0'}`}
          >
            <Slider
              max={media.duration}
              value={elapsedDuration}
              handleInput={(event) => {
                setElapsedDuration(event.target.value);
                mediaRef.current.currentTime = event.target.value;
              }}
              sliderRef={sliderRef}
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2 self-start">
                {elapsedDuration === media.duration && (
                  <Button
                    color={BUTTON_COLOR.OUTLINE_WHITE}
                    elementRef={resetButtonRef}
                    handleClick={() => handlePlayPause(true)}
                  >
                    <SVGOutlineReset />
                  </Button>
                )}
                {elapsedDuration !== media.duration && (
                  <>
                    <Button
                      color={BUTTON_COLOR.OUTLINE_WHITE}
                      elementRef={playPauseButtonRef}
                      handleClick={() =>
                        setIsActiveMediaPlaying(!isActiveMediaPlaying)
                      }
                    >
                      {isActiveMediaPlaying ? (
                        <SVGOutlinePause />
                      ) : (
                        <SVGOutlinePlay />
                      )}
                    </Button>
                    <Button
                      color={BUTTON_COLOR.OUTLINE_WHITE}
                      elementRef={muteUnmuteButtonRef}
                      handleClick={() => {
                        if (isMuted) {
                          mediaRef.current.muted = false;
                        } else {
                          mediaRef.current.muted = true;
                        }

                        setIsMuted(!isMuted);
                      }}
                    >
                      {isMuted ? <SVGOutlineMute /> : <SVGOutlineUnmute />}
                    </Button>
                  </>
                )}
              </div>
              <p className="text-white">
                {formatDuration(elapsedDuration)} /{' '}
                {formatDuration(media.duration)}
              </p>
              <div className="self-end">
                <Button
                  color={BUTTON_COLOR.OUTLINE_WHITE}
                  elementRef={expandCollapseButtonRef}
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
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default MediaPlayer;
