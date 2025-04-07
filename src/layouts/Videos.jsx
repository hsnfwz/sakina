import { useContext } from 'react';
import { DataContext } from '../common/context/DataContextProvider';
import { useElementIntersection } from '../common/hooks';
import { useViewAllVideos } from '../common/hooks/videos';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';
import VideoCardGrid from '../components/VideoCardGrid';

function Videos() {
  const [elementRef, intersectingElement] = useElementIntersection();
  const { videos } = useContext(DataContext);
  const [viewAllVideos, fetchingViewAllVideos] =
    useViewAllVideos(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Videos</Header>
      <VideoCardGrid>
        {viewAllVideos.keys.map((key, index) => (
          <div key={index} className="w-full">
            <VideoCard
              orientation="HORIZONTAL"
              video={videos.current[key]}
              elementRef={
                index === viewAllVideos.keys.length - 1 ? elementRef : null
              }
            />
          </div>
        ))}
      </VideoCardGrid>
      {!viewAllVideos.hasMore && <Loaded />}
      {fetchingViewAllVideos && <Loading />}
    </div>
  );
}

export default Videos;
