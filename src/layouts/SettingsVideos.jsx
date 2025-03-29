import { useContext, useEffect, useState } from 'react';
import { getVideosByUserId } from '../common/database/videos.js';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import ContentTableGrid from '../components/ContentTableGrid.jsx';
import ContentTableCard from '../components/ContentTableCard.jsx';

function SettingsVideos() {
  const { authUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);


  // TODO: pass this from the outlet in settings so we dont keep fetching when switching between subpages
  const [videos, setVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  useEffect(() => {
    if (authUser) {
      if (!videos.hasInitialized) {

        getVideos();
      }
    }
  }, [authUser]);

  async function getVideos() {
    setIsLoading(true);

    const { data, hasMore } = await getVideosByUserId(
      authUser.id,
      videos.data.length
    );

    const _videos = { ...videos };

    if (data.length > 0) {
      _videos.data = [...videos.data, ...data];
    }

    _videos.hasMore = hasMore;

    if (!videos.hasInitialized) {
      _videos.hasInitialized = true;
    }

    setVideos(_videos);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <ContentTableGrid>
      {videos.data.map((video, index) => (
        <ContentTableCard key={index} content={video} />
      ))}
      </ContentTableGrid>
      {!videos.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default SettingsVideos;
