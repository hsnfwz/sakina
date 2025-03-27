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

  const [profiles, setProfiles] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [profileVideos, setProfileVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [profileClips, setProfileClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [profileDiscussions, setProfileDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

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
        profiles,
        setProfiles,
        profileVideos,
        setProfileVideos,
        profileClips,
        setProfileClips,
        profileDiscussions,
        setProfileDiscussions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataContextProvider };
