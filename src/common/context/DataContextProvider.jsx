import { createContext, useState } from 'react';

const DataContext = createContext();

function DataContextProvider({ children }) {
  const [homeVideos, setHomeVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [homeClips, setHomeClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [homeDiscussions, setHomeDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [latestVideos, setLatestVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [mostLikedVideos, setMostLikedVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [mostViewedVideos, setMostViewedVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [mostDiscussedVideos, setMostDiscussedVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [latestClips, setLatestClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [mostLikedClips, setMostLikedClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [mostViewedClips, setMostViewedClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [mostDiscussedClips, setMostDiscussedClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [latestDiscussions, setLatestDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [mostLikedDiscussions, setMostLikedDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [mostViewedDiscussions, setMostViewedDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [mostDiscussedDiscussions, setMostDiscussedDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [comments, setComments] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [nestedComments, setNestedComments] = useState({});

  const [newestUsers, setNewestUsers] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [mostFollowedUsers, setMostFollowedUsers] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userVideos, setUserVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userClips, setUserClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userDiscussions, setUserDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userVideoLikes, setUserVideoLikes] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userClipLikes, setUserClipLikes] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userDiscussionLikes, setUserDiscussionLikes] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userVideoViews, setUserVideoViews] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userClipViews, setUserClipViews] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userDiscussionViews, setUserDiscussionViews] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userFollowers, setUserFollowers] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userFollowing, setUserFollowing] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [notifications, setNotifications] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [activeUser, setActiveUser] = useState(null);
  const [activeDiscussion, setActiveDiscussion] = useState(null);

  return (
    <DataContext.Provider
      value={{
        homeVideos,
        setHomeVideos,
        homeClips,
        setHomeClips,
        homeDiscussions,
        setHomeDiscussions,
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

        latestDiscussions,
        setLatestDiscussions,
        mostLikedDiscussions,
        setMostLikedDiscussions,
        mostViewedDiscussions,
        setMostViewedDiscussions,
        mostDiscussedDiscussions,
        setMostDiscussedDiscussions,

        comments,
        setComments,
        nestedComments,
        setNestedComments,

        newestUsers,
        setNewestUsers,

        mostFollowedUsers,
        setMostFollowedUsers,

        userVideos,
        setUserVideos,
        userClips,
        setUserClips,
        userDiscussions,
        setUserDiscussions,
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
        notifications,
        setNotifications,
        activeUser,
        setActiveUser,
        activeDiscussion,
        setActiveDiscussion,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataContextProvider };
