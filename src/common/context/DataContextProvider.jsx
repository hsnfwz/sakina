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

  const [videos, setVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [clips, setClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [discussions, setDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [users, setUsers] = useState({
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

  const [activeUser, setActiveUser] = useState(null);

  return (
    <DataContext.Provider
      value={{
        homeVideos,
        setHomeVideos,
        homeClips,
        setHomeClips,
        homeDiscussions,
        setHomeDiscussions,
        videos,
        setVideos,
        clips,
        setClips,
        discussions,
        setDiscussions,
        users,
        setUsers,
        userVideos,
        setUserVideos,
        userClips,
        setUserClips,
        userDiscussions,
        setUserDiscussions,
        activeUser,
        setActiveUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataContextProvider };
