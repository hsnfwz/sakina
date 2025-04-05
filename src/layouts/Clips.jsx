import { useElementIntersection } from '../common/hooks';
import { useClips } from '../common/hooks/videos';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';
import VideoCardGrid from '../components/VideoCardGrid';

function Clips() {
  const [elementRef, intersectingElement] = useElementIntersection();
  const [clips, fetchingClips] = useClips(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Clips</Header>
      <VideoCardGrid>
        {clips.data.map((clip, index) => (
          <div key={index} className="w-full">
            <VideoCard
              orientation="VERTICAL"
              video={clip}
              elementRef={index === clips.data.length - 1 ? elementRef : null}
            />
          </div>
        ))}
      </VideoCardGrid>
      {!clips.hasMore && <Loaded />}

      {fetchingClips && <Loading />}
    </div>
  );
}

export default Clips;
