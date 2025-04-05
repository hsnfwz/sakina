import { useContext, Fragment } from 'react';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { useElementIntersection } from '../common/hooks.js';
import { useUserClips } from '../common/hooks/videos.js';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import VideoCard from '../components/VideoCard.jsx';
import VideoCardGrid from '../components/VideoCardGrid.jsx';

function UserVideos() {
  const { authUser } = useContext(AuthContext);
  const { activeUser } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [userClips, fetchingUserClips] = useUserClips(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
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
      {fetchingUserClips && <Loading />}
    </div>
  );
}

export default UserVideos;
