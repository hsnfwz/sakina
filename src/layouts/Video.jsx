import { useEffect, useRef, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { formatDuration } from '../common/helpers';
import { getVideoById } from '../common/database/videos';
import IconButton from '../components/IconButton';
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

function Video() {
  const { id } = useParams();

  const videoRef = useRef();
  const parentRef = useRef();
  const sliderRef = useRef();
  const timeoutRef = useRef();

  const playPauseButtonRef = useRef();
  const resetButtonRef = useRef();
  const muteUnmuteButtonRef = useRef();
  const expandCollapseButtonRef = useRef();

  const [activeVideo, setActiveVideo] = useState(null);
  const [isLoadingActiveVideo, setIsLoadingActiveVideo] = useState(false);
  const [activeVideoEvent, setActiveVideoEvent] = useState('');
  const [isActiveVideoPlaying, setIsActiveVideoPlaying] = useState(true);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  const [isMuted, setIsMuted] = useState(true);
  const [showControlsView, setShowControlsView] = useState(false);

  const [elapsedDuration, setElapsedDuration] = useState(0);

  useEffect(() => {
    if (!location.state?.video) {
      getVideo();
    }

    if (location.state?.video) {
      setActiveVideo(location.state.video);
    }
  }, [location]);

  async function getVideo() {
    setIsLoadingActiveVideo(true);
    const { data } = await getVideoById(id);
    setActiveVideo(data[0]);
    setIsLoadingActiveVideo(false);
  }

  function handleMouseMove() {
    if (elapsedDuration !== activeVideo.video_duration) {
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
    if (elapsedDuration !== activeVideo.video_duration) {
      setShowControlsView(false);
      clearTimeout(timeoutRef.current);
    }
  }

  function handleVideoEnd() {
    clearTimeout(timeoutRef.current);
    setShowControlsView(true);
  }

  useEffect(() => {
    if (activeVideo) {
      const progress = (elapsedDuration / activeVideo.video_duration) * 100;
      if (sliderRef && sliderRef.current) {
        sliderRef.current.style.background = `linear-gradient(to right, white ${progress}%, var(--color-white-transparent) ${progress}%)`;
      }
    }
  }, [activeVideo, elapsedDuration]);

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
      setActiveVideoEvent(event);
    };

    document.addEventListener('keydown', handleEvent);

    return () => {
      document.removeEventListener('keydown', handleEvent);
    };
  }, []);

  function handlePlayPause(reset) {
    if (reset) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      if (isActiveVideoPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }

  useEffect(() => {
    if (videoRef && videoRef.current) {
      if (
        activeVideoEvent.code === 'Space' &&
        document.activeElement !== playPauseButtonRef.current &&
        document.activeElement !== muteUnmuteButtonRef.current &&
        document.activeElement !== expandCollapseButtonRef.current &&
        document.activeElement !== resetButtonRef.current
      ) {
        if (elapsedDuration === activeVideo.video_duration) {
          handlePlayPause(true);
        } else {
          setIsActiveVideoPlaying(!isActiveVideoPlaying);
        }
      }
    }
  }, [activeVideoEvent]);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      handlePlayPause();
    }
  }, [isActiveVideoPlaying]);

  if (isLoadingActiveVideo) {
    return <Loading />;
  }

  if (activeVideo) {
    return (
      <div
        className={`relative flex justify-center`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={parentRef}
      >
        <video
          ref={videoRef}
          width={1920}
          height={1080}
          controls={false}
          className={`rounded-lg bg-black ${isLoadingVideo ? 'hidden' : 'block'} full relative aspect-[16/9]`}
          autoPlay={true}
          loop={false}
          muted={isMuted}
          onEnded={handleVideoEnd}
          onCanPlay={() => setIsLoadingVideo(false)}
          onTimeUpdate={(event) => {
            setElapsedDuration(event.target.currentTime);
          }}
          onClick={() => setIsActiveVideoPlaying(!isActiveVideoPlaying)}
          onDoubleClick={() => {
            if (isFullscreen) {
              document.exitFullscreen();
            } else {
              parentRef.current.requestFullscreen();
            }
          }}
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/videos/${activeVideo.video_file_name}`}
        />
        <div
          className={`pulse aspect-[16/9] w-full rounded-lg bg-neutral-200 ${isLoadingVideo ? 'block' : 'hidden'} `}
        ></div>
        {!isLoadingVideo && (
          <div
            className={`absolute bottom-0 left-0 flex w-full flex-col gap-4 rounded-b-lg bg-black/50 p-4 backdrop-blur-sm ${showControlsView ? 'opacity-100' : 'opacity-0'}`}
          >
            <Slider
              max={activeVideo.video_duration}
              value={elapsedDuration}
              handleInput={(event) => {
                setElapsedDuration(event.target.value);
                videoRef.current.currentTime = event.target.value;
              }}
              sliderRef={sliderRef}
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2 self-start">
                {elapsedDuration === activeVideo.video_duration && (
                  <IconButton
                    color={BUTTON_COLOR.OUTLINE_WHITE}
                    elementRef={resetButtonRef}
                    handleClick={() => handlePlayPause(true)}
                  >
                    <SVGOutlineReset />
                  </IconButton>
                )}
                {elapsedDuration !== activeVideo.video_duration && (
                  <>
                    <IconButton
                    color={BUTTON_COLOR.OUTLINE_WHITE}
                      elementRef={playPauseButtonRef}
                      handleClick={() =>
                        setIsActiveVideoPlaying(!isActiveVideoPlaying)
                      }
                    >
                      {isActiveVideoPlaying ? (
                        <SVGOutlinePause />
                      ) : (
                        <SVGOutlinePlay />
                      )}
                    </IconButton>
                    <IconButton
                      color={BUTTON_COLOR.OUTLINE_WHITE}
                      elementRef={muteUnmuteButtonRef}
                      handleClick={() => {
                        if (isMuted) {
                          videoRef.current.muted = false;
                        } else {
                          videoRef.current.muted = true;
                        }

                        setIsMuted(!isMuted);
                      }}
                    >
                      {isMuted ? <SVGOutlineMute /> : <SVGOutlineUnmute />}
                    </IconButton>
                  </>
                )}
              </div>
              <p className="text-white">
                {formatDuration(elapsedDuration)} /{' '}
                {formatDuration(activeVideo.video_duration)}
              </p>
              <div className="self-end">
                <IconButton
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
                </IconButton>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Video;
