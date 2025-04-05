import { useEffect, useState, useContext } from 'react';
import { getVideos, getVideosByUserId } from '../database/videos';
import { DataContext } from '../context/DataContextProvider';

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
  const { userVideos, setUserVideos, activeUser } = useContext(DataContext);
  const [fetchingUserVideos, setFetchingUserVideos] = useState(false);

  useEffect(() => {
    if (activeUser) {
      if (!userVideos.hasInitialized) {
        fetchUserVideos();
      }
    }
  }, [activeUser]);

  useEffect(() => {
    if (intersectingElement && userVideos.hasMore) {
      fetchUserVideos();
    }
  }, [intersectingElement]);

  async function fetchUserVideos() {
    setFetchingUserVideos(true);

    const { data, hasMore } = await getVideosByUserId(
      activeUser.id,
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
  const { userClips, setUserClips, activeUser } = useContext(DataContext);
  const [fetchingUserClips, setFetchingUserClips] = useState(false);

  useEffect(() => {
    if (activeUser) {
      if (!userClips.hasInitialized) {
        fetchUserClips();
      }
    }
  }, [activeUser]);

  useEffect(() => {
    if (intersectingElement && userClips.hasMore) {
      fetchUserClips();
    }
  }, [intersectingElement]);

  async function fetchUserClips() {
    setFetchingUserClips(true);

    const { data, hasMore } = await getVideosByUserId(
      activeUser.id,
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

export { useVideos, useClips, useUserVideos, useUserClips };
