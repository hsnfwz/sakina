import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import {
  getFollowersBySenderUserId,
  getFollowersByReceiverUserId,
} from '../common/database/followers.js';
import {
  getVideoLikesByUserId,
  getClipLikesByUserId,
} from '../common/database/view-video-likes.js';
import { getDiscussionLikesByUserId } from '../common/database/view-discussion-likes.js';
import {
  getVideoViewsByUserId,
  getClipViewsByUserId,
} from '../common/database/view-video-views.js';
import { getDiscussionViewsByUserId } from '../common/database/view-discussion-views.js';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import DiscussionCard from '../components/DiscussionCard.jsx';
import Subheader from '../components/Subheader';
import HorizontalScrollGrid from '../components/HorizontalScrollGrid';
import HorizontalScrollCard from '../components/HorizontalScrollCard';
import VideoCard from '../components/VideoCard.jsx';
import UserCard from '../components/UserCard.jsx';

function UserActivity() {
  const { authUser } = useContext(AuthContext);
  const { activeUser } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  const {
    userVideoLikes,
    setUserVideoLikes,
    userClipLikes,
    setUserClipLikes,
    userDiscussionLikes,
    setUserDiscussionLikes,
    userVideoViews,
    setUserVideoViews,
    userClipViews,
    setUserClipViews,
    userDiscussionViews,
    setUserDiscussionViews,
    userFollowers,
    setUserFollowers,
    userFollowing,
    setUserFollowing,
  } = useContext(DataContext);

  useEffect(() => {
    if (authUser && activeUser) {
      if (authUser.id === activeUser.id) {
        setShow(true);
      } else {
        setShow(false);
      }
    }
  }, [authUser, activeUser]);

  useEffect(() => {
    async function initialize() {
      if (show) {
        if (!userVideoViews.hasInitialized) {
          setIsLoading(true);

          const [
            userVideoLikesResponse,
            userClipLikesResponse,
            userDiscussionLikesResponse,
            userVideoViewsResponse,
            userClipViewsResponse,
            userDiscussionViewsResponse,
            userFollowingResponse,
            userFollowersResponse,
          ] = await Promise.all([
            getVideoLikesByUserId(activeUser.id),
            getClipLikesByUserId(activeUser.id),
            getDiscussionLikesByUserId(activeUser.id),
            getVideoViewsByUserId(activeUser.id),
            getClipViewsByUserId(activeUser.id),
            getDiscussionViewsByUserId(activeUser.id),
            getFollowersBySenderUserId(activeUser.id),
            getFollowersByReceiverUserId(activeUser.id),
          ]);

          setUserVideoLikes({
            data: userVideoLikesResponse.data,
            hasInitialized: true,
          });
          setUserClipLikes({
            data: userClipLikesResponse.data,
            hasInitialized: true,
          });
          setUserDiscussionLikes({
            data: userDiscussionLikesResponse.data,
            hasInitialized: true,
          });
          setUserVideoViews({
            data: userVideoViewsResponse.data,
            hasInitialized: true,
          });
          setUserClipViews({
            data: userClipViewsResponse.data,
            hasInitialized: true,
          });
          setUserDiscussionViews({
            data: userDiscussionViewsResponse.data,
            hasInitialized: true,
          });
          setUserFollowing({
            data: userFollowingResponse.data,
            hasInitialized: true,
          });
          setUserFollowers({
            data: userFollowersResponse.data,
            hasInitialized: true,
          });
          setIsLoading(false);
        }
      }
    }
    initialize();
  }, [show]);

  if (show) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Subheader>Following</Subheader>
        {userFollowing.data.length > 0 && (
          <HorizontalScrollGrid to="following">
            {userFollowing.data.map((user, index) => (
              <HorizontalScrollCard key={index} width={128}>
                <UserCard user={user.receiver} />
              </HorizontalScrollCard>
            ))}
          </HorizontalScrollGrid>
        )}

        <Subheader>Followers</Subheader>
        {userFollowers.data.length > 0 && (
          <HorizontalScrollGrid to="followers">
            {userFollowers.data.map((user, index) => (
              <HorizontalScrollCard key={index} width={128}>
                <UserCard user={user.sender} />
              </HorizontalScrollCard>
            ))}
          </HorizontalScrollGrid>
        )}

        <Subheader>Liked Videos</Subheader>
        {userVideoLikes.data.length > 0 && (
          <HorizontalScrollGrid to="liked-videos">
            {userVideoLikes.data.map((video, index) => (
              <HorizontalScrollCard key={index} width={320}>
                <VideoCard orientation="HORIZONTAL" video={video} />
              </HorizontalScrollCard>
            ))}
          </HorizontalScrollGrid>
        )}

        <Subheader>Liked Clips</Subheader>
        {userClipLikes.data.length > 0 && (
          <HorizontalScrollGrid to="liked-clips">
            {userClipLikes.data.map((clip, index) => (
              <HorizontalScrollCard key={index} width={320}>
                <VideoCard orientation="VERTICAL" video={clip} />
              </HorizontalScrollCard>
            ))}
          </HorizontalScrollGrid>
        )}

        <Subheader>Liked Discussions</Subheader>
        {userDiscussionLikes.data.length > 0 && (
          <HorizontalScrollGrid to="liked-discussions">
            {userDiscussionLikes.data.map((discussion, index) => (
              <HorizontalScrollCard key={index} width={320}>
                <DiscussionCard discussion={discussion} />
              </HorizontalScrollCard>
            ))}
          </HorizontalScrollGrid>
        )}

        <Subheader>Viewed Videos</Subheader>
        {userVideoViews.data.length > 0 && (
          <HorizontalScrollGrid to="viewed-videos">
            {userVideoViews.data.map((video, index) => (
              <HorizontalScrollCard key={index} width={320}>
                <VideoCard orientation="HORIZONTAL" video={video} />
              </HorizontalScrollCard>
            ))}
          </HorizontalScrollGrid>
        )}

        <Subheader>Viewed Clips</Subheader>
        {userClipViews.data.length > 0 && (
          <HorizontalScrollGrid to="viewed-clips">
            {userClipViews.data.map((clip, index) => (
              <HorizontalScrollCard key={index} width={320}>
                <VideoCard orientation="VERTICAL" video={clip} />
              </HorizontalScrollCard>
            ))}
          </HorizontalScrollGrid>
        )}

        <Subheader>Viewed Discussions</Subheader>
        {userDiscussionViews.data.length > 0 && (
          <HorizontalScrollGrid to="viewed-discussions">
            {userDiscussionViews.data.map((discussion, index) => (
              <HorizontalScrollCard key={index} width={320}>
                <DiscussionCard discussion={discussion} />
              </HorizontalScrollCard>
            ))}
          </HorizontalScrollGrid>
        )}
      </div>
    );
  }
}

export default UserActivity;
