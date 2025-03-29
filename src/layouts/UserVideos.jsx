import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getVideosByUserId } from '../common/database/videos.js';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import VideoCard from '../components/VideoCard.jsx';
import VideoCardGrid from '../components/VideoCardGrid.jsx';

function UserVideos() {
  const { activeUser } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  const { userVideos, setUserVideos } = useContext(DataContext);

  useEffect(() => {
    if (activeUser) {
      if (!userVideos.hasInitialized) {
        getVideos();
      }
    }
  }, [activeUser]);

  async function getVideos() {
    setIsLoading(true);

    const { data, hasMore } = await getVideosByUserId(
      activeUser.id,
      userVideos.data.length
    );

    const _userVideos = { ...userVideos };

    if (data.length > 0) {
      _userVideos.data = [...userVideos.data, ...data];
    }

    _userVideos.hasMore = hasMore;

    if (!userVideos.hasInitialized) {
      _userVideos.hasInitialized = true;
    }

    setUserVideos(_userVideos);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <VideoCardGrid>
        {userVideos.data.map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </VideoCardGrid>
      {!userVideos.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default UserVideos;
