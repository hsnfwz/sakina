import { useContext, useEffect, useState, Fragment } from 'react';
import { getVideosByUserId } from '../common/database/videos.js';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { useElementIntersection } from '../common/hooks';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import VideoCard from '../components/VideoCard.jsx';
import VideoCardGrid from '../components/VideoCardGrid.jsx';

function UserVideos() {
  const { authUser } = useContext(AuthContext);
  const { activeUser } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const { userVideos, setUserVideos, userClips, setUserClips } =
    useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeUser) {
      if (
        location.pathname === `/users/${activeUser.username}` ||
        location.pathname.includes('videos')
      ) {
        if (!userVideos.hasInitialized) {
          getVideos();
        }
      }

      if (location.pathname.includes('clips')) {
        if (!userClips.hasInitialized) {
          getClips();
        }
      }
    }
  }, [activeUser]);

  useEffect(() => {
    if (
      location.pathname === `/users/${activeUser.username}` ||
      location.pathname.includes('videos')
    ) {
      if (intersectingElement && userVideos.hasMore) {
        getVideos();
      }
    }

    if (location.pathname.includes('clips')) {
      if (intersectingElement && userClips.hasMore) {
        getClips();
      }
    }
  }, [intersectingElement]);

  async function getVideos() {
    setIsLoading(true);

    const { data, hasMore } = await getVideosByUserId(
      activeUser.id,
      'HORIZONTAL',
      userVideos.data.length
    );

    const _userVideos = { ...userVideos };

    if (data.length > 0) {
      _userVideos.data = [...userVideos.data, ...data];
    }

    _userVideos.hasMore = hasMore;
    _userVideos.hasInitialized = true;

    setUserVideos(_userVideos);

    setIsLoading(false);
  }

  async function getClips() {
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
      {(location.pathname === `/users/${activeUser.username}` ||
        location.pathname.includes('videos')) && (
        <>
          <VideoCardGrid>
            {userVideos.data.map((video, index) => (
              <Fragment key={index}>
                {(!video.is_anonymous ||
                  (video.is_anonymous &&
                    authUser &&
                    activeUser &&
                    authUser.id === activeUser.id)) && (
                  <VideoCard
                    video={video}
                    orientation="HORIZONTAL"
                    elementRef={
                      index === userVideos.data.length - 1 ? elementRef : null
                    }
                  />
                )}
              </Fragment>
            ))}
          </VideoCardGrid>
          {!userVideos.hasMore && <Loaded />}
        </>
      )}

      {location.pathname.includes('clips') && (
        <>
          <VideoCardGrid>
            {userClips.data.map((video, index) => (
              <Fragment key={index}>
                {(!video.is_anonymous ||
                  (video.is_anonymous &&
                    authUser &&
                    activeUser &&
                    authUser.id === activeUser.id)) && (
                  <VideoCard
                    video={video}
                    orientation="VERTICAL"
                    elementRef={
                      index === userClips.data.length - 1 ? elementRef : null
                    }
                  />
                )}
              </Fragment>
            ))}
          </VideoCardGrid>
          {!userClips.hasMore && <Loaded />}
        </>
      )}

      {isLoading && <Loading />}
    </div>
  );
}

export default UserVideos;
