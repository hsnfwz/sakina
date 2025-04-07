import { useContext } from 'react';
import { useExploreUsers } from '../common/hooks/users';
import { useExploreVideos, useExploreClips } from '../common/hooks/videos';
import { useExploreDiscussions } from '../common/hooks/discussions';
import { DataContext } from '../common/context/DataContextProvider';
import VideoCard from '../components/VideoCard';
import UserCard from '../components/UserCard';
import DiscussionCard from '../components/DiscussionCard';
import Header from '../components/Header';
import Subheader from '../components/Subheader';
import HorizontalScrollGrid from '../components/HorizontalScrollGrid';
import HorizontalScrollCard from '../components/HorizontalScrollCard';

function Explore() {
  const { users, videos, clips, discussions } = useContext(DataContext);
  const [exploreUsers, fetchingExploreUsers] = useExploreUsers();
  const [exploreVideos, fetchingExploreVideos] = useExploreVideos();
  const [exploreClips, fetchingExploreClips] = useExploreClips();
  const [exploreDiscussions, fetchingExploreDiscussions] =
    useExploreDiscussions();

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Explore</Header>
      <Subheader>Newest Users</Subheader>
      <HorizontalScrollGrid to="/users" isLoading={fetchingExploreUsers}>
        {exploreUsers.keys.map((key, index) => (
          <HorizontalScrollCard key={index} width={128}>
            <UserCard user={users.current[key]} />
          </HorizontalScrollCard>
        ))}
      </HorizontalScrollGrid>

      <Subheader>Latest Videos</Subheader>
      <HorizontalScrollGrid to="/videos" isLoading={fetchingExploreVideos}>
        {exploreVideos.keys.map((key, index) => (
          <HorizontalScrollCard key={index} width={320}>
            <VideoCard video={videos.current[key]} orientation="HORIZONTAL" />
          </HorizontalScrollCard>
        ))}
      </HorizontalScrollGrid>

      <Subheader>Latest Clips</Subheader>
      <HorizontalScrollGrid to="/clips" isLoading={fetchingExploreClips}>
        {exploreClips.keys.map((key, index) => (
          <HorizontalScrollCard key={index} width={320}>
            <VideoCard video={clips.current[key]} orientation="VERTICAL" />
          </HorizontalScrollCard>
        ))}
      </HorizontalScrollGrid>

      <Subheader>Latest Discussions</Subheader>
      <HorizontalScrollGrid
        to="/discussions"
        isLoading={fetchingExploreDiscussions}
      >
        {exploreDiscussions.keys.map((key, index) => (
          <HorizontalScrollCard key={index} width={320}>
            <DiscussionCard discussion={discussions.current[key]} />
          </HorizontalScrollCard>
        ))}
      </HorizontalScrollGrid>
    </div>
  );
}

export default Explore;
