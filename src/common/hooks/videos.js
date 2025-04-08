import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import {
  getVideos,
  getVideosByUserId,
  getHiddenVideosByUserId,
  getVideoById,
} from '../database/videos';
import { getFollowerVideosBySenderUserId } from '../database/view-follower-videos';
import { DataContext } from '../context/DataContextProvider';
import { AuthContext } from '../context/AuthContextProvider';
import { getSessionStorageData } from '../helpers';

function useVideo(id) {
  const location = useLocation();
  const { videos } = useContext(DataContext);
  const [video, setVideo] = useState(null);
  const [fetchingVideo, setFetchingVideo] = useState(false);

  useEffect(() => {
    async function getData() {
      setFetchingVideo(true);

      let _video;

      if (videos.current[id]) {
        _video = videos.current[id];
      } else {
        if (location.state && location.state.video) {
          _video = location.state.video;
        } else {
          const data = await getVideoById(id);
          _video = data;
        }

        videos.current[id] = _video;
      }

      setVideo(_video);

      setFetchingVideo(false);
    }

    getData();
  }, [location]);

  return [video, fetchingVideo];
}

function useUserVideos(username, intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { userVideos, setUserVideos, viewedUsers } = useContext(DataContext);
  const [videos, setVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });
  const [fetchingUserVideos, setFetchingUserVideos] = useState(false);

  useEffect(() => {
    if (authUser) {
      let _userVideos = getSessionStorageData(`${authUser}-videos`);

      if (_userVideos) {
        console.log('v exists');
      } else {
        console.log('v not exists');

        if (!userVideos.hasInitialized) {
          fetchUserVideos();
        }
      }

      setUserVideos(_userVideos);
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
  const [fetchingUserHiddenVideos, setFetchingUserHiddenVideos] =
    useState(false);

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

function useExploreVideos() {
  const { videos, exploreVideos, setExploreVideos } = useContext(DataContext);
  const [fetchingExploreVideos, setFetchingExploreVideos] = useState(false);

  useEffect(() => {
    if (!exploreVideos.hasInitialized) {
      fetchData();
    }
  }, []);

  async function fetchData() {
    setFetchingExploreVideos(true);

    const { data, hasMore } = await getVideos(
      'HORIZONTAL',
      exploreVideos.keys.length
    );
    data.forEach((row) => (videos.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _exploreVideos = { ...exploreVideos };

    if (data.length > 0) {
      _exploreVideos.keys = [...exploreVideos.keys, ...ids];
    }

    _exploreVideos.hasMore = hasMore;
    _exploreVideos.hasInitialized = true;

    setExploreVideos(_exploreVideos);

    setFetchingExploreVideos(false);
  }

  return [exploreVideos, fetchingExploreVideos];
}

function useViewAllVideos(intersectingElement) {
  const { videos, viewAllVideos, setViewAllVideos } = useContext(DataContext);
  const [fetchingViewAllVideos, setFetchingViewAllVideos] = useState(false);

  useEffect(() => {
    if (!viewAllVideos.hasInitialized) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (intersectingElement && viewAllVideos.hasMore) {
      fetchData();
    }
  }, [intersectingElement]);

  async function fetchData() {
    setFetchingViewAllVideos(true);

    const { data, hasMore } = await getVideos(
      'HORIZONTAL',
      viewAllVideos.keys.length
    );
    data.forEach((row) => (videos.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _viewAllVideos = { ...viewAllVideos };

    if (data.length > 0) {
      _viewAllVideos.keys = [...viewAllVideos.keys, ...ids];
    }

    _viewAllVideos.hasMore = hasMore;
    _viewAllVideos.hasInitialized = true;

    setViewAllVideos(_viewAllVideos);

    setFetchingViewAllVideos(false);
  }

  return [viewAllVideos, fetchingViewAllVideos];
}

function useExploreClips() {
  const { clips, exploreClips, setExploreClips } = useContext(DataContext);
  const [fetchingExploreClips, setFetchingExploreClips] = useState(false);

  useEffect(() => {
    if (!exploreClips.hasInitialized) {
      fetchData();
    }
  }, []);

  async function fetchData() {
    setFetchingExploreClips(true);

    const { data, hasMore } = await getVideos(
      'VERTICAL',
      exploreClips.keys.length
    );
    data.forEach((row) => (clips.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _exploreClips = { ...exploreClips };

    if (data.length > 0) {
      _exploreClips.keys = [...exploreClips.keys, ...ids];
    }

    _exploreClips.hasMore = hasMore;
    _exploreClips.hasInitialized = true;

    setExploreClips(_exploreClips);

    setFetchingExploreClips(false);
  }

  return [exploreClips, fetchingExploreClips];
}

function useViewAllClips(intersectingElement) {
  const { clips, viewAllClips, setViewAllClips } = useContext(DataContext);
  const [fetchingViewAllClips, setFetchingViewAllClips] = useState(false);

  useEffect(() => {
    if (!viewAllClips.hasInitialized) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (intersectingElement && viewAllClips.hasMore) {
      fetchData();
    }
  }, [intersectingElement]);

  async function fetchData() {
    setFetchingViewAllClips(true);

    const { data, hasMore } = await getVideos(
      'VERTICAL',
      viewAllClips.keys.length
    );
    data.forEach((row) => (clips.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _viewAllClips = { ...viewAllClips };

    if (data.length > 0) {
      _viewAllClips.keys = [...viewAllClips.keys, ...ids];
    }

    _viewAllClips.hasMore = hasMore;
    _viewAllClips.hasInitialized = true;

    setViewAllClips(_viewAllClips);

    setFetchingViewAllClips(false);
  }

  return [viewAllClips, fetchingViewAllClips];
}

function useHomeVideos(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { videos, homeVideos, setHomeVideos } = useContext(DataContext);
  const [fetchingHomeVideos, setFetchingHomeVideos] = useState(false);

  useEffect(() => {
    if (authUser && !homeVideos.hasInitialized) {
      fetchData();
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && homeVideos.hasMore) {
      fetchData();
    }
  }, [intersectingElement]);

  async function fetchData() {
    setFetchingHomeVideos(true);

    const { data, hasMore } = await getFollowerVideosBySenderUserId(
      authUser.id,
      'HORIZONTAL',
      homeVideos.keys.length
    );
    data.forEach((row) => (videos.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _homeVideos = { ...homeVideos };

    if (data.length > 0) {
      _homeVideos.keys = [...homeVideos.keys, ...ids];
    }

    _homeVideos.hasMore = hasMore;
    _homeVideos.hasInitialized = true;

    setHomeVideos(_homeVideos);

    setFetchingHomeVideos(false);
  }

  return [homeVideos, fetchingHomeVideos];
}

function useHomeClips(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { clips, homeClips, setHomeClips } = useContext(DataContext);
  const [fetchingHomeClips, setFetchingHomeClips] = useState(false);

  useEffect(() => {
    if (authUser && !homeClips.hasInitialized) {
      fetchData();
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && homeClips.hasMore) {
      fetchData();
    }
  }, [intersectingElement]);

  async function fetchData() {
    setFetchingHomeClips(true);

    const { data, hasMore } = await getFollowerVideosBySenderUserId(
      authUser.id,
      'VERTICAL',
      homeClips.keys.length
    );
    data.forEach((row) => (clips.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _homeClips = { ...homeClips };

    if (data.length > 0) {
      _homeClips.keys = [...homeClips.keys, ...ids];
    }

    _homeClips.hasMore = hasMore;
    _homeClips.hasInitialized = true;

    setHomeClips(_homeClips);

    setFetchingHomeClips(false);
  }

  return [homeClips, fetchingHomeClips];
}

export {
  useVideo,
  useUserVideos,
  useUserClips,
  useUserHiddenVideos,
  useUserHiddenClips,
  useExploreVideos,
  useViewAllVideos,
  useExploreClips,
  useViewAllClips,
  useHomeVideos,
  useHomeClips,
};
