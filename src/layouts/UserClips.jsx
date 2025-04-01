import { useContext, useEffect, useState } from 'react';
import { getClipsByUserId } from '../common/database/videos';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import ClipCard from '../components/ClipCard.jsx';
import ClipCardGrid from '../components/ClipCardGrid.jsx';

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

    const { data, hasMore } = await getClipsByUserId(
      activeUser.id,
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
      <ClipCardGrid>
        {userClips.data.map((clip, index) => (
          <ClipCard key={index} clip={clip} />
        ))}
      </ClipCardGrid>
      {!userClips.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default UserClips;
