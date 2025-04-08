import { createContext, useState, useRef } from 'react';

const DataContext = createContext();

function DataContextProvider({ children }) {
  const users = useRef({});
  const videos = useRef({});
  const clips = useRef({});
  const discussions = useRef({});

  /* 
    discussionComments: {
      [discussionid]: {
        keys: [0,1],
        hasMore: true,
        hasIniialized: false,
      },
      [discussionid]: {
        keys: [2],
        hasMore: true,
        hasIniialized: false,
      },
    }  
  */

  const [discussionComments, setDiscussionComments] = useState({});
  const [nestedComments, setNestedComments] = useState({});

  const [unreadNotifications, setUnreadNotifications] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [readNotifications, setReadNotifications] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [homeUsers, setHomeUsers] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [homeVideos, setHomeVideos] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [homeClips, setHomeClips] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [homeDiscussions, setHomeDiscussions] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [exploreUsers, setExploreUsers] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [exploreVideos, setExploreVideos] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [exploreClips, setExploreClips] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [exploreDiscussions, setExploreDiscussions] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [viewAllUsers, setViewAllUsers] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [viewAllVideos, setViewAllVideos] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [viewAllClips, setViewAllClips] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [viewAllDiscussions, setViewAllDiscussions] = useState({
    keys: [],
    hasMore: true,
    hasInitialized: false,
  });

  /* 
    userVideos: {
      [sarah]: {
        data: [0,1],
        hasMore: true,
        hasIniialized: false,
      },
      [john]: {
        data: [2],
        hasMore: true,
        hasIniialized: false,
      },
    }  
  */

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

  const [userHiddenVideos, setUserHiddenVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userHiddenClips, setUserHiddenClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [userHiddenDiscussions, setUserHiddenDiscussions] = useState({
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

  const [activeUser, setActiveUser] = useState(null);

  return (
    <DataContext.Provider
      value={{
        users,
        videos,
        clips,
        discussions,
        homeUsers,
        setHomeUsers,
        homeVideos,
        setHomeVideos,
        homeClips,
        setHomeClips,
        homeDiscussions,
        setHomeDiscussions,
        exploreUsers,
        setExploreUsers,
        exploreVideos,
        setExploreVideos,
        exploreClips,
        setExploreClips,
        exploreDiscussions,
        setExploreDiscussions,
        viewAllUsers,
        setViewAllUsers,
        viewAllVideos,
        setViewAllVideos,
        viewAllClips,
        setViewAllClips,
        viewAllDiscussions,
        setViewAllDiscussions,
        discussionComments,
        setDiscussionComments,
        unreadNotifications,
        setUnreadNotifications,
        readNotifications,
        setReadNotifications,

        userVideos,
        setUserVideos,
        userClips,
        setUserClips,
        userDiscussions,
        setUserDiscussions,
        userHiddenVideos,
        setUserHiddenVideos,
        userHiddenClips,
        setUserHiddenClips,
        userHiddenDiscussions,
        setUserHiddenDiscussions,
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

        nestedComments,
        setNestedComments,

        activeUser,
        setActiveUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataContextProvider };
