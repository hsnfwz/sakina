import { useContext } from 'react';
import { DataContext } from '../common/context/DataContextProvider';
import { useElementIntersection } from '../common/hooks';
import { useViewAllClips } from '../common/hooks/videos';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';
import VideoCardGrid from '../components/VideoCardGrid';

function Clips() {
  const { clips } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [viewAllClips, fetchingViewAllClips] =
    useViewAllClips(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Clips</Header>
      <VideoCardGrid>
        {viewAllClips.keys.map((key, index) => (
          <div key={index} className="w-full">
            <VideoCard
              orientation="VERTICAL"
              video={clips.current[key]}
              elementRef={
                index === viewAllClips.keys.length - 1 ? elementRef : null
              }
            />
          </div>
        ))}
      </VideoCardGrid>
      {!viewAllClips.hasMore && <Loaded />}
      {fetchingViewAllClips && <Loading />}
    </div>
  );
}

export default Clips;
