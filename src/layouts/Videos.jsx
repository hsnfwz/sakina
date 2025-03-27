import { useEffect, useContext, useRef, useState } from 'react';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getVideos } from '../common/database/videos';
import { useElementIntersection } from '../common/hooks';
import VideoPreview from '../components/VideoPreview';
import { DataContext } from '../common/context/DataContextProvider';

function Videos() {
  const { videos, setVideos } = useContext(DataContext);

  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!videos.hasInitialized) {
        await _getVideos();
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    if (intersectingElement && videos.hasMore) {
      _getVideos();
    }
  }, [intersectingElement]);

  async function _getVideos() {
    setIsLoading(true);

    const { data, hasMore } = await getVideos(videos.data.length);

    const _videos = { ...videos };

    if (data.length > 0) {
      _videos.data = [...videos.data, ...data];
    }

    _videos.hasMore = hasMore;

    if (!videos.hasInitialized) {
      _videos.hasInitialized = true;
    }

    setVideos(_videos);

    setIsLoading(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-md flex-col">
      <div className="app_hide-scrollbar flex h-[calc(100vh-120px)] w-full snap-y snap-mandatory flex-col gap-2 overflow-y-scroll overscroll-y-contain">
        {videos.data.map((video, index) => (
          <div
            key={index}
            className="flex min-h-[calc(100vh-120px)] w-full snap-start flex-col items-center justify-center gap-2"
            ref={index === videos.data.length - 1 ? elementRef : null}
          >
            <div className="h-full w-full py-4">
              <VideoPreview video={video} isAutoPlay={false} />
            </div>
          </div>
        ))}
      </div>
      {/* 
      {!videos.hasMore && <Loaded />}
      {isLoading && <Loading />} */}
    </div>
  );
}

export default Videos;
