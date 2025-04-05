import { useElementIntersection } from '../common/hooks';
import { useVideos } from '../common/hooks/videos';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';
import VideoCardGrid from '../components/VideoCardGrid';

function Videos() {
  const [elementRef, intersectingElement] = useElementIntersection();
  const [videos, fetchingVideos] = useVideos(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Videos</Header>
      <VideoCardGrid>
        {videos.data.map((video, index) => (
          <div key={index} className="w-full">
            <VideoCard
              orientation="HORIZONTAL"
              video={video}
              elementRef={index === videos.data.length - 1 ? elementRef : null}
            />
          </div>
        ))}
      </VideoCardGrid>
      {!videos.hasMore && <Loaded />}

      {fetchingVideos && <Loading />}
    </div>
  );
}

export default Videos;
