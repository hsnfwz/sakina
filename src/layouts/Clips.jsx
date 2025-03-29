import { useEffect, useContext, useRef, useState } from 'react';
import { DataContext } from '../common/context/DataContextProvider';
import { useElementIntersection } from '../common/hooks';
import { getClips } from '../common/database/clips';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import ClipCard from '../components/ClipCard';
import Header from '../components/Header';

function Clips() {
  const { clips, setClips } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!clips.hasInitialized) {
        await _getClips();
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    if (intersectingElement && clips.hasMore) {
      _getClips();
    }
  }, [intersectingElement]);

  async function _getClips() {
    setIsLoading(true);

    const { data, hasMore } = await getClips(clips.data.length);

    const _clips = { ...clips };

    if (data.length > 0) {
      _clips.data = [...clips.data, ...data];
    }

    _clips.hasMore = hasMore;

    if (!clips.hasInitialized) {
      _clips.hasInitialized = true;
    }

    setClips(_clips);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Clips</Header>
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {clips.data.map((clip, index) => (
          <div key={index} className="w-full">
            <ClipCard
              clip={clip}
              elementRef={index === clips.data.length - 1 ? elementRef : null}
            />
          </div>
        ))}
      </div>
      {!clips.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default Clips;
