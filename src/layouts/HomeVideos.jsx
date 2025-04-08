import { useContext } from 'react';
import { useHomeVideos } from '../common/hooks/videos';
import { DataContext } from '../common/context/DataContextProvider';
import { useElementIntersection } from '../common/hooks';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import VideoCard from '../components/VideoCard';
import VideoCardGrid from '../components/VideoCardGrid';

function HomeVideos() {
  const { videos } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [homeVideos, fetchingHomeVideos] = useHomeVideos(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
      <VideoCardGrid>
        {homeVideos.keys.map((key, index) => (
          <div key={index} className="w-full">
            <VideoCard
              orientation="HORIZONTAL"
              video={videos.current[key]}
              elementRef={
                index === homeVideos.keys.length - 1 ? elementRef : null
              }
            />
          </div>
        ))}
      </VideoCardGrid>
      {!homeVideos.hasMore && <Loaded />}
      {fetchingHomeVideos && <Loading />}
    </div>
  );
}

export default HomeVideos;
