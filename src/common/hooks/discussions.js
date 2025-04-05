import { useEffect, useState, useContext } from 'react';
import {
  getDiscussions,
  getDiscussionsByUserId,
} from '../database/discussions';
import { DataContext } from '../context/DataContextProvider';

function useDiscussions(intersectingElement) {
  // const { videos, setDiscussions, clips, setClips } = useContext(DataContext);
  const [discussions, setDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });
  const [fetchingDiscussions, setFetchingDiscussions] = useState(false);

  useEffect(() => {
    if (!discussions.hasInitialized) {
      fetchDiscussions();
    }
  }, []);

  useEffect(() => {
    if (intersectingElement && discussions.hasMore) {
      fetchDiscussions();
    }
  }, [intersectingElement]);

  async function fetchDiscussions() {
    setFetchingDiscussions(true);

    const { data, hasMore } = await getDiscussions(discussions.data.length);

    const _discussions = { ...discussions };

    if (data.length > 0) {
      _discussions.data = [...discussions.data, ...data];
    }

    _discussions.hasMore = hasMore;
    _discussions.hasInitialized = true;

    setDiscussions(_discussions);

    setFetchingDiscussions(false);
  }

  return [discussions, fetchingDiscussions];
}

function useUserDiscussions(intersectingElement) {
  const { userDiscussions, setUserDiscussions, activeUser } =
    useContext(DataContext);
  const [fetchingUserDiscussions, setFetchingUserDiscussions] = useState(false);

  useEffect(() => {
    if (activeUser) {
      if (!userDiscussions.hasInitialized) {
        fetchUserDiscussions();
      }
    }
  }, [activeUser]);

  useEffect(() => {
    if (intersectingElement && userDiscussions.hasMore) {
      fetchUserDiscussions();
    }
  }, [intersectingElement]);

  async function fetchUserDiscussions() {
    setFetchingUserDiscussions(true);

    const { data, hasMore } = await getDiscussionsByUserId(
      activeUser.id,
      userDiscussions.data.length
    );

    const _userDiscussions = { ...userDiscussions };

    if (data.length > 0) {
      _userDiscussions.data = [...userDiscussions.data, ...data];
    }

    _userDiscussions.hasMore = hasMore;
    _userDiscussions.hasInitialized = true;

    setUserDiscussions(_userDiscussions);

    setFetchingUserDiscussions(false);
  }

  return [userDiscussions, fetchingUserDiscussions];
}

export { useDiscussions, useUserDiscussions };
