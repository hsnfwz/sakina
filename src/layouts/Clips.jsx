import { useEffect, useContext, useRef, useState } from 'react';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getClips } from '../common/database/clips';
import { useElementIntersection } from '../common/hooks';
import VideoPreview from '../components/VideoPreview';
import { DataContext } from '../common/context/DataContextProvider';

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
    <div className="mx-auto flex w-full max-w-(--breakpoint-md) flex-col">
      <div className="app_hide-scrollbar flex h-[calc(100vh-120px)] w-full snap-y snap-mandatory flex-col gap-2 overflow-y-scroll overscroll-y-contain">
        {clips.data.map((video, index) => (
          <div
            key={index}
            className="relative flex min-h-[calc(100vh-120px)] w-full snap-start flex-col items-center justify-center gap-2"
            ref={index === clips.data.length - 1 ? elementRef : null}
          >
            <div className="h-full w-full max-w-[384px] py-4">
              <VideoPreview video={video} isAutoPlay={false} />
            </div>
          </div>
        ))}
      </div>
      {/* 
      {!clips.hasMore && <Loaded />}
      {isLoading && <Loading />} */}
    </div>
  );
}

export default Clips;
