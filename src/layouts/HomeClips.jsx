import { useContext } from 'react';
import { useHomeClips } from '../common/hooks/videos';
import { DataContext } from '../common/context/DataContextProvider';
import { useElementIntersection } from '../common/hooks';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import VideoCard from '../components/VideoCard';
import VideoCardGrid from '../components/VideoCardGrid';

function HomeClips() {
  const { clips } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [homeClips, fetchingHomeClips] = useHomeClips(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
      <VideoCardGrid>
        {homeClips.keys.map((key, index) => (
          <div key={index} className="w-full">
            <VideoCard
              orientation="VERTICAL"
              video={clips.current[key]}
              elementRef={
                index === homeClips.keys.length - 1 ? elementRef : null
              }
            />
          </div>
        ))}
      </VideoCardGrid>
      {!homeClips.hasMore && <Loaded />}
      {fetchingHomeClips && <Loading />}
    </div>
  );
}

export default HomeClips;
