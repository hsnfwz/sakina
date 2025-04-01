import { useEffect, useState, useRef, useContext } from 'react';
import { getVideos } from '../common/database/videos';
import { getClips } from '../common/database/videos';
import { getUsers } from '../common/database/users';
import { getDiscussions } from '../common/database/discussions';
import { DataContext } from '../common/context/DataContextProvider';
import VideoCard from '../components/VideoCard';
import ClipCard from '../components/ClipCard';
import UserCard from '../components/UserCard';
import DiscussionCard from '../components/DiscussionCard';
import Loading from '../components/Loading';
import Header from '../components/Header';
import Subheader from '../components/Subheader';
import HorizontalScrollGrid from '../components/HorizontalScrollGrid';
import HorizontalScrollCard from '../components/HorizontalScrollCard';

function Explore() {
  const {
    users,
    setUsers,
    videos,
    setVideos,
    clips,
    setClips,
    discussions,
    setDiscussions,
  } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!users.hasInitialized) {
        setIsLoading(true);

        const [
          videosResponse,
          clipsResponse,
          usersResponse,
          discussionsResponse,
        ] = await Promise.all([
          getVideos(),
          getClips(),
          getUsers(),
          getDiscussions(),
        ]);

        setVideos({ data: videosResponse.data, hasInitialized: true });
        setClips({ data: clipsResponse.data, hasInitialized: true });
        setUsers({ data: usersResponse.data, hasInitialized: true });
        setDiscussions({
          data: discussionsResponse.data,
          hasInitialized: true,
        });

        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Explore</Header>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <Subheader>Users</Subheader>
          {users.data.length > 0 && (
            <HorizontalScrollGrid to="/users">
              {users.data.map((user, index) => (
                <HorizontalScrollCard key={index} width={128}>
                  <UserCard user={user} />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Videos</Subheader>
          {videos.data.length > 0 && (
            <HorizontalScrollGrid to="/videos">
              {videos.data.map((video, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <VideoCard video={video} />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Clips</Subheader>
          {clips.data.length > 0 && (
            <HorizontalScrollGrid to="/clips">
              {clips.data.map((clip, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <ClipCard clip={clip} />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Discussions</Subheader>
          {discussions.data.length > 0 && (
            <HorizontalScrollGrid to="/discussions">
              {discussions.data.map((discussion, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <DiscussionCard discussion={discussion} />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}
        </>
      )}
    </div>
  );
}

export default Explore;
