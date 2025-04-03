import { useContext, useEffect, useState } from 'react';
import { getVideosByUserId } from '../common/database/videos';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import VideoCard from '../components/VideoCard.jsx';
import VideoCardGrid from '../components/VideoCardGrid.jsx';

function UserClips() {
  const { activeUser } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  const { userClips, setUserClips } = useContext(DataContext);

  useEffect(() => {
    if (activeUser) {
      if (!userClips.hasInitialized) {
        getVideos();
      }
    }
  }, [activeUser]);

  async function getVideos() {
    setIsLoading(true);

    const { data, hasMore } = await getVideosByUserId(
      activeUser.id,
      'VERTICAL',
      userClips.data.length
    );

    const _userClips = { ...userClips };

    if (data.length > 0) {
      _userClips.data = [...userClips.data, ...data];
    }

    _userClips.hasMore = hasMore;
    _userClips.hasInitialized = true;

    setUserClips(_userClips);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <VideoCardGrid>
        {userClips.data.map((clip, index) => (
          <VideoCard key={index} video={clip} orientation="VERTICAL" />
        ))}
      </VideoCardGrid>
      {!userClips.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default UserClips;
