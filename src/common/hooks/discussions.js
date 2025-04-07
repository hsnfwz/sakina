import { useEffect, useState, useContext } from 'react';
import {
  getDiscussions,
  getDiscussionsByUserId,
  getHiddenDiscussionsByUserId,
} from '../database/discussions';
import { DataContext } from '../context/DataContextProvider';
import { AuthContext } from '../context/AuthContextProvider';

function useUserDiscussions(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { userDiscussions, setUserDiscussions } = useContext(DataContext);
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
  const [fetchingUserHiddenDiscussions, setFetchingUserHiddenDiscussions] =
    useState(false);

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

function useExploreDiscussions() {
  const { discussions, exploreDiscussions, setExploreDiscussions } =
    useContext(DataContext);
  const [fetchingExploreDiscussions, setFetchingExploreDiscussions] =
    useState(false);

  useEffect(() => {
    if (!exploreDiscussions.hasInitialized) {
      fetchData();
    }
  }, []);

  async function fetchData() {
    setFetchingExploreDiscussions(true);

    const { data, hasMore } = await getDiscussions(
      exploreDiscussions.keys.length
    );
    data.forEach((row) => (discussions.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _exploreDiscussions = { ...exploreDiscussions };

    if (data.length > 0) {
      _exploreDiscussions.keys = [...exploreDiscussions.keys, ...ids];
    }

    _exploreDiscussions.hasMore = hasMore;
    _exploreDiscussions.hasInitialized = true;

    setExploreDiscussions(_exploreDiscussions);

    setFetchingExploreDiscussions(false);
  }

  return [exploreDiscussions, fetchingExploreDiscussions];
}

function useViewAllDiscussions(intersectingElement) {
  const { discussions, viewAllDiscussions, setViewAllDiscussions } =
    useContext(DataContext);
  const [fetchingViewAllDiscussions, setFetchingViewAllDiscussions] =
    useState(false);

  useEffect(() => {
    if (!viewAllDiscussions.hasInitialized) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (intersectingElement && viewAllDiscussions.hasMore) {
      fetchData();
    }
  }, [intersectingElement]);

  async function fetchData() {
    setFetchingViewAllDiscussions(true);

    const { data, hasMore } = await getDiscussions(
      viewAllDiscussions.keys.length
    );
    data.forEach((row) => (discussions.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _viewAllDiscussions = { ...viewAllDiscussions };

    if (data.length > 0) {
      _viewAllDiscussions.keys = [...viewAllDiscussions.keys, ...ids];
    }

    _viewAllDiscussions.hasMore = hasMore;
    _viewAllDiscussions.hasInitialized = true;

    setViewAllDiscussions(_viewAllDiscussions);

    setFetchingViewAllDiscussions(false);
  }

  return [viewAllDiscussions, fetchingViewAllDiscussions];
}

export {
  useUserDiscussions,
  useUserHiddenDiscussions,
  useExploreDiscussions,
  useViewAllDiscussions,
};
