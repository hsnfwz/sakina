import { useEffect, useState, useContext } from 'react';
import {
  getDiscussions,
  getDiscussionsByUserId,
  getHiddenDiscussionsByUserId,
} from '../database/discussions';
import { DataContext } from '../context/DataContextProvider';
import { AuthContext } from '../context/AuthContextProvider';

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
  const { authUser } = useContext(AuthContext);
  const { userDiscussions, setUserDiscussions } =
    useContext(DataContext);
  const [fetchingUserDiscussions, setFetchingUserDiscussions] = useState(false);

  useEffect(() => {
    if (authUser) {
      if (!userDiscussions.hasInitialized) {
        fetchUserDiscussions();
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && userDiscussions.hasMore) {
      fetchUserDiscussions();
    }
  }, [intersectingElement]);

  async function fetchUserDiscussions() {
    setFetchingUserDiscussions(true);

    const { data, hasMore } = await getDiscussionsByUserId(
      authUser.id,
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

function useUserHiddenDiscussions(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { userHiddenDiscussions, setUserHiddenDiscussions } =
    useContext(DataContext);
  const [fetchingUserHiddenDiscussions, setFetchingUserHiddenDiscussions] = useState(false);

  useEffect(() => {
    if (authUser) {
      if (!userHiddenDiscussions.hasInitialized) {
        fetchUserDiscussions();
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && userHiddenDiscussions.hasMore) {
      fetchUserDiscussions();
    }
  }, [intersectingElement]);

  async function fetchUserDiscussions() {
    setFetchingUserHiddenDiscussions(true);

    const { data, hasMore } = await getHiddenDiscussionsByUserId(
      authUser.id,
      userHiddenDiscussions.data.length
    );

    const _userHiddenDiscussions = { ...userHiddenDiscussions };

    if (data.length > 0) {
      _userHiddenDiscussions.data = [...userHiddenDiscussions.data, ...data];
    }

    _userHiddenDiscussions.hasMore = hasMore;
    _userHiddenDiscussions.hasInitialized = true;

    setUserHiddenDiscussions(_userHiddenDiscussions);

    setFetchingUserHiddenDiscussions(false);
  }

  return [userHiddenDiscussions, fetchingUserHiddenDiscussions];
}

export { useDiscussions, useUserDiscussions, useUserHiddenDiscussions };
