import { useEffect, useContext, useRef, useState } from 'react';
import { DataContext } from '../common/context/DataContextProvider';
import { useElementIntersection } from '../common/hooks';
import { getVideos } from '../common/database/videos';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import VideoCard from '../components/VideoCard';
import Header from '../components/Header';
import VideoCardGrid from '../components/VideoCardGrid';

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
    _videos.hasInitialized = true;

    setVideos(_videos);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Videos</Header>
      <VideoCardGrid>
        {videos.data.map((video, index) => (
          <div key={index} className="w-full">
            <VideoCard
              video={video}
              elementRef={index === videos.data.length - 1 ? elementRef : null}
            />
          </div>
        ))}
      </VideoCardGrid>
      {!videos.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default Videos;
