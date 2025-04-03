import { useEffect, useContext, useRef, useState } from 'react';
import { DataContext } from '../common/context/DataContextProvider';
import { useElementIntersection } from '../common/hooks';
import { getVideos } from '../common/database/videos';
import { useLocation } from 'react-router';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';
import VideoCardGrid from '../components/VideoCardGrid';

function Videos() {
  const location = useLocation();
  const { videos, setVideos, clips, setClips } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (location.pathname.includes('videos')) {
        if (!videos.hasInitialized) {
          await _getVideos();
        }
      }

      if (location.pathname.includes('clips')) {
        if (!clips.hasInitialized) {
          await _getClips();
        }
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    if (location.pathname.includes('videos')) {
      if (intersectingElement && videos.hasMore) {
        _getVideos();
      }
    }

    if (location.pathname.includes('clips')) {
      if (intersectingElement && clips.hasMore) {
        _getClips();
      }
    }
  }, [intersectingElement]);

  async function _getVideos() {
    setIsLoading(true);

    const { data, hasMore } = await getVideos('HORIZONTAL', videos.data.length);

    const _videos = { ...videos };

    if (data.length > 0) {
      _videos.data = [...videos.data, ...data];
    }

    _videos.hasMore = hasMore;
    _videos.hasInitialized = true;

    setVideos(_videos);

    setIsLoading(false);
  }

  async function _getClips() {
    setIsLoading(true);

    const { data, hasMore } = await getVideos('VERTICAL', clips.data.length);

    const _clips = { ...clips };

    if (data.length > 0) {
      _clips.data = [...clips.data, ...data];
    }

    _clips.hasMore = hasMore;
    _clips.hasInitialized = true;

    setClips(_clips);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {location.pathname.includes('videos') && (
        <>
          <Header>Videos</Header>
          <VideoCardGrid>
            {videos.data.map((video, index) => (
              <div key={index} className="w-full">
                <VideoCard
                  orientation="HORIZONTAL"
                  video={video}
                  elementRef={
                    index === videos.data.length - 1 ? elementRef : null
                  }
                />
              </div>
            ))}
          </VideoCardGrid>
          {!videos.hasMore && <Loaded />}
        </>
      )}
      {location.pathname.includes('clips') && (
        <>
          <Header>Clips</Header>
          <VideoCardGrid>
            {clips.data.map((clip, index) => (
              <div key={index} className="w-full">
                <VideoCard
                  orientation="VERTICAL"
                  video={clip}
                  elementRef={
                    index === clips.data.length - 1 ? elementRef : null
                  }
                />
              </div>
            ))}
          </VideoCardGrid>
          {!clips.hasMore && <Loaded />}
        </>
      )}

      {isLoading && <Loading />}
    </div>
  );
}

export default Videos;
