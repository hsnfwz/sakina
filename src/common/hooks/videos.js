import { useEffect, useState, useContext } from 'react';
import { getVideos, getVideosByUserId, getHiddenVideosByUserId } from '../database/videos';
import { DataContext } from '../context/DataContextProvider';
import { AuthContext } from '../context/AuthContextProvider';

function useVideos(intersectingElement) {
  // const { videos, setVideos, clips, setClips } = useContext(DataContext);
  const [videos, setVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });
  const [fetchingVideos, setFetchingVideos] = useState(false);

  useEffect(() => {
    if (!videos.hasInitialized) {
      fetchVideos();
    }
  }, []);

  useEffect(() => {
    if (intersectingElement && videos.hasMore) {
      fetchVideos();
    }
  }, [intersectingElement]);

  async function fetchVideos() {
    setFetchingVideos(true);

    const { data, hasMore } = await getVideos('HORIZONTAL', videos.data.length);

    const _videos = { ...videos };

    if (data.length > 0) {
      _videos.data = [...videos.data, ...data];
    }

    _videos.hasMore = hasMore;
    _videos.hasInitialized = true;

    setVideos(_videos);

    setFetchingVideos(false);
  }

  return [videos, fetchingVideos];
}

function useClips(intersectingElement) {
  // const { videos, setVideos, clips, setClips } = useContext(DataContext);
  const [clips, setClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });
  const [fetchingClips, setFetchingClips] = useState(false);

  useEffect(() => {
    if (!clips.hasInitialized) {
      fetchClips();
    }
  }, []);

  useEffect(() => {
    if (intersectingElement && clips.hasMore) {
      fetchClips();
    }
  }, [intersectingElement]);

  async function fetchClips() {
    setFetchingClips(true);

    const { data, hasMore } = await getVideos('VERTICAL', clips.data.length);

    const _clips = { ...clips };

    if (data.length > 0) {
      _clips.data = [...clips.data, ...data];
    }

    _clips.hasMore = hasMore;
    _clips.hasInitialized = true;

    setClips(_clips);

    setFetchingClips(false);
  }

  return [clips, fetchingClips];
}

function useUserVideos(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { userVideos, setUserVideos } = useContext(DataContext);
  const [fetchingUserVideos, setFetchingUserVideos] = useState(false);

  useEffect(() => {
    if (authUser) {
      if (!userVideos.hasInitialized) {
        fetchUserVideos();
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && userVideos.hasMore) {
      fetchUserVideos();
    }
  }, [intersectingElement]);

  async function fetchUserVideos() {
    setFetchingUserVideos(true);

    const { data, hasMore } = await getVideosByUserId(
      authUser.id,
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

    setFetchingUserVideos(false);
  }

  return [userVideos, fetchingUserVideos];
}

function useUserClips(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { userClips, setUserClips } = useContext(DataContext);
  const [fetchingUserClips, setFetchingUserClips] = useState(false);

  useEffect(() => {
    if (authUser) {
      if (!userClips.hasInitialized) {
        fetchUserClips();
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && userClips.hasMore) {
      fetchUserClips();
    }
  }, [intersectingElement]);

  async function fetchUserClips() {
    setFetchingUserClips(true);

    const { data, hasMore } = await getVideosByUserId(
      authUser.id,
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

    setFetchingUserClips(false);
  }

  return [userClips, fetchingUserClips];
}

function useUserHiddenVideos(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { userHiddenVideos, setUserHiddenVideos } = useContext(DataContext);
  const [fetchingUserHiddenVideos, setFetchingUserHiddenVideos] = useState(false);

  useEffect(() => {
    if (authUser) {
      if (!userHiddenVideos.hasInitialized) {
        fetchUserVideos();
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && userHiddenVideos.hasMore) {
      fetchUserVideos();
    }
  }, [intersectingElement]);

  async function fetchUserVideos() {
    setFetchingUserHiddenVideos(true);

    const { data, hasMore } = await getHiddenVideosByUserId(
      authUser.id,
      'HORIZONTAL',
      userHiddenVideos.data.length
    );

    const _userHiddenVideos = { ...userHiddenVideos };

    if (data.length > 0) {
      _userHiddenVideos.data = [...userHiddenVideos.data, ...data];
    }

    _userHiddenVideos.hasMore = hasMore;
    _userHiddenVideos.hasInitialized = true;

    setUserHiddenVideos(_userHiddenVideos);

    setFetchingUserHiddenVideos(false);
  }

  return [userHiddenVideos, fetchingUserHiddenVideos];
}

function useUserHiddenClips(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { userHiddenClips, setUserHiddenClips } = useContext(DataContext);
  const [fetchingUserHiddenClips, setFetchingUserHiddenClips] = useState(false);

  useEffect(() => {
    if (authUser) {
      if (!userHiddenClips.hasInitialized) {
        fetchUserClips();
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && userHiddenClips.hasMore) {
      fetchUserClips();
    }
  }, [intersectingElement]);

  async function fetchUserClips() {
    setFetchingUserHiddenClips(true);

    const { data, hasMore } = await getHiddenVideosByUserId(
      authUser.id,
      'VERTICAL',
      userHiddenClips.data.length
    );

    const _userHiddenClips = { ...userHiddenClips };

    if (data.length > 0) {
      _userHiddenClips.data = [...userHiddenClips.data, ...data];
    }

    _userHiddenClips.hasMore = hasMore;
    _userHiddenClips.hasInitialized = true;

    setUserHiddenClips(_userHiddenClips);

    setFetchingUserHiddenClips(false);
  }

  return [userHiddenClips, fetchingUserHiddenClips];
}

export { useVideos, useClips, useUserVideos, useUserClips, useUserHiddenVideos, useUserHiddenClips };
