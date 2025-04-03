import { useEffect, useState, useRef, useContext } from 'react';
import { getWeeklyVideos } from '../common/database/videos';
import { getUsers } from '../common/database/users';
import { getWeeklyDiscussions } from '../common/database/discussions';
import { DataContext } from '../common/context/DataContextProvider';
import { ORDER_BY } from '../common/enums';
import VideoCard from '../components/VideoCard';
import UserCard from '../components/UserCard';
import DiscussionCard from '../components/DiscussionCard';
import Loading from '../components/Loading';
import Header from '../components/Header';
import Subheader from '../components/Subheader';
import HorizontalScrollGrid from '../components/HorizontalScrollGrid';
import HorizontalScrollCard from '../components/HorizontalScrollCard';

function Explore() {
  const {
    newestUsers,
    setNewestUsers,
    mostFollowedUsers,
    setMostFollowedUsers,

    latestDiscussions,
    setLatestDiscussions,
    mostLikedDiscussions,
    setMostLikedDiscussions,
    mostViewedDiscussions,
    setMostViewedDiscussions,
    mostDiscussedDiscussions,
    setMostDiscussedDiscussions,

    latestVideos,
    setLatestVideos,
    mostLikedVideos,
    setMostLikedVideos,
    mostViewedVideos,
    setMostViewedVideos,
    mostDiscussedVideos,
    setMostDiscussedVideos,
    latestClips,
    setLatestClips,
    mostLikedClips,
    setMostLikedClips,
    mostViewedClips,
    setMostViewedClips,
    mostDiscussedClips,
    setMostDiscussedClips,
  } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!newestUsers.hasInitialized) {
        setIsLoading(true);

        const [
          latestVideosResponse,
          mostLikedVideosResponse,
          mostViewedVideosResponse,
          mostDiscussedVideosResponse,

          latestClipsResponse,
          mostLikedClipsResponse,
          mostViewedClipsResponse,
          mostDiscussedClipsResponse,

          latestDiscussionsResponse,
          mostLikedDiscussionsResponse,
          mostViewedDiscussionsResponse,
          mostDiscussedDiscussionsResponse,

          newestUsersResponse,
          mostFollowedUsersResponse,
        ] = await Promise.all([
          getWeeklyVideos('HORIZONTAL', undefined, undefined, ORDER_BY.LATEST),
          getWeeklyVideos(
            'HORIZONTAL',
            undefined,
            undefined,
            ORDER_BY.MOST_LIKED
          ),
          getWeeklyVideos(
            'HORIZONTAL',
            undefined,
            undefined,
            ORDER_BY.MOST_VIEWED
          ),
          getWeeklyVideos(
            'HORIZONTAL',
            undefined,
            undefined,
            ORDER_BY.MOST_DISCUSSED
          ),

          getWeeklyVideos('VERTICAL', undefined, undefined, ORDER_BY.LATEST),
          getWeeklyVideos(
            'VERTICAL',
            undefined,
            undefined,
            ORDER_BY.MOST_LIKED
          ),
          getWeeklyVideos(
            'VERTICAL',
            undefined,
            undefined,
            ORDER_BY.MOST_VIEWED
          ),
          getWeeklyVideos(
            'VERTICAL',
            undefined,
            undefined,
            ORDER_BY.MOST_DISCUSSED
          ),

          getWeeklyDiscussions(undefined, undefined, ORDER_BY.LATEST),
          getWeeklyDiscussions(
            undefined,
            undefined,
            ORDER_BY.MOST_LIKED
          ),
          getWeeklyDiscussions(
            undefined,
            undefined,
            ORDER_BY.MOST_VIEWED
          ),
          getWeeklyDiscussions(
            undefined,
            undefined,
            ORDER_BY.MOST_DISCUSSED
          ),

          getUsers(
            undefined,
            undefined,
            ORDER_BY.NEWEST
          ),
          getUsers(
            undefined,
            undefined,
            ORDER_BY.MOST_FOLLOWED
          ),
        ]);

        setLatestVideos({
          data: latestVideosResponse.data,
          hasInitialized: true,
        });
        setMostLikedVideos({
          data: mostLikedVideosResponse.data,
          hasInitialized: true,
        });
        setMostViewedVideos({
          data: mostViewedVideosResponse.data,
          hasInitialized: true,
        });
        setMostDiscussedVideos({
          data: mostDiscussedVideosResponse.data,
          hasInitialized: true,
        });

        setLatestClips({
          data: latestClipsResponse.data,
          hasInitialized: true,
        });
        setMostLikedClips({
          data: mostLikedClipsResponse.data,
          hasInitialized: true,
        });
        setMostViewedClips({
          data: mostViewedClipsResponse.data,
          hasInitialized: true,
        });
        setMostDiscussedClips({
          data: mostDiscussedClipsResponse.data,
          hasInitialized: true,
        });

        setLatestDiscussions({
          data: latestDiscussionsResponse.data,
          hasInitialized: true,
        });
        setMostLikedDiscussions({
          data: mostLikedDiscussionsResponse.data,
          hasInitialized: true,
        });
        setMostViewedDiscussions({
          data: mostViewedDiscussionsResponse.data,
          hasInitialized: true,
        });
        setMostDiscussedDiscussions({
          data: mostDiscussedDiscussionsResponse.data,
          hasInitialized: true,
        });

        setNewestUsers({ data: newestUsersResponse.data, hasInitialized: true });
        setMostFollowedUsers({ data: mostFollowedUsersResponse.data, hasInitialized: true });

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
          <Subheader>Newest Users</Subheader>
          {newestUsers.data.length > 0 && (
            <HorizontalScrollGrid to="/users">
              {newestUsers.data.map((user, index) => (
                <HorizontalScrollCard key={index} width={128}>
                  <UserCard user={user} />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

<Subheader>Most Followed Users</Subheader>
          {mostFollowedUsers.data.length > 0 && (
            <HorizontalScrollGrid to="/users">
              {mostFollowedUsers.data.map((user, index) => (
                <HorizontalScrollCard key={index} width={128}>
                  <UserCard user={user} />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Latest Videos This Week</Subheader>
          {latestVideos.data.length > 0 && (
            <HorizontalScrollGrid to="/videos">
              {latestVideos.data.map((video, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <VideoCard video={video} orientation="HORIZONTAL" />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Most Liked Videos This Week</Subheader>
          {mostLikedVideos.data.length > 0 && (
            <HorizontalScrollGrid to="/videos">
              {mostLikedVideos.data.map((video, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <VideoCard video={video} orientation="HORIZONTAL" />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Most Viewed Videos This Week</Subheader>
          {mostViewedVideos.data.length > 0 && (
            <HorizontalScrollGrid to="/videos">
              {mostViewedVideos.data.map((video, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <VideoCard video={video} orientation="HORIZONTAL" />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Most Discussed Videos This Week</Subheader>
          {mostDiscussedVideos.data.length > 0 && (
            <HorizontalScrollGrid to="/videos">
              {mostDiscussedVideos.data.map((video, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <VideoCard video={video} orientation="HORIZONTAL" />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Latest Clips This Week</Subheader>
          {latestClips.data.length > 0 && (
            <HorizontalScrollGrid to="/videos">
              {latestClips.data.map((video, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <VideoCard video={video} orientation="VERTICAL" />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Most Liked Clips This Week</Subheader>
          {mostLikedClips.data.length > 0 && (
            <HorizontalScrollGrid to="/videos">
              {mostLikedClips.data.map((video, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <VideoCard video={video} orientation="VERTICAL" />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Most Viewed Clips This Week</Subheader>
          {mostViewedClips.data.length > 0 && (
            <HorizontalScrollGrid to="/videos">
              {mostViewedClips.data.map((video, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <VideoCard video={video} orientation="VERTICAL" />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Most Discussed Clips This Week</Subheader>
          {mostDiscussedClips.data.length > 0 && (
            <HorizontalScrollGrid to="/videos">
              {mostDiscussedClips.data.map((video, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <VideoCard video={video} orientation="VERTICAL" />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

          <Subheader>Latest Discussions</Subheader>
          {latestDiscussions.data.length > 0 && (
            <HorizontalScrollGrid to="/discussions">
              {latestDiscussions.data.map((discussion, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <DiscussionCard discussion={discussion} />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

<Subheader>Most Liked Discussions This Week</Subheader>
          {mostLikedDiscussions.data.length > 0 && (
            <HorizontalScrollGrid to="/discussions">
              {mostLikedDiscussions.data.map((discussion, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <DiscussionCard discussion={discussion} />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

<Subheader>Most Viewed Discussions This Week</Subheader>
          {mostViewedDiscussions.data.length > 0 && (
            <HorizontalScrollGrid to="/discussions">
              {mostViewedDiscussions.data.map((discussion, index) => (
                <HorizontalScrollCard key={index} width={320}>
                  <DiscussionCard discussion={discussion} />
                </HorizontalScrollCard>
              ))}
            </HorizontalScrollGrid>
          )}

<Subheader>Most Commented Discussions This Week</Subheader>
          {mostDiscussedDiscussions.data.length > 0 && (
            <HorizontalScrollGrid to="/discussions">
              {mostDiscussedDiscussions.data.map((discussion, index) => (
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
