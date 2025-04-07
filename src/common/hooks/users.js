import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import { DataContext } from '../context/DataContextProvider';
import { getUsers } from '../database/users';

function useUser(username) {}

function useExploreUsers() {
  const { users, exploreUsers, setExploreUsers } = useContext(DataContext);
  const [fetchingExploreUsers, setFetchingExploreUsers] = useState(false);

  useEffect(() => {
    if (!exploreUsers.hasInitialized) {
      fetchData();
    }
  }, []);

  async function fetchData() {
    setFetchingExploreUsers(true);

    const { data, hasMore } = await getUsers(exploreUsers.keys.length);
    data.forEach((row) => (users.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _exploreUsers = { ...exploreUsers };

    if (data.length > 0) {
      _exploreUsers.keys = [...exploreUsers.keys, ...ids];
    }

    _exploreUsers.hasMore = hasMore;
    _exploreUsers.hasInitialized = true;

    setExploreUsers(_exploreUsers);

    setFetchingExploreUsers(false);
  }

  return [exploreUsers, fetchingExploreUsers];
}

function useViewAllUsers(intersectingElement) {
  const { users, viewAllUsers, setViewAllUsers } = useContext(DataContext);
  const [fetchingViewAllUsers, setFetchingViewAllUsers] = useState(false);

  useEffect(() => {
    if (!viewAllUsers.hasInitialized) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (intersectingElement && viewAllUsers.hasMore) {
      fetchData();
    }
  }, [intersectingElement]);

  async function fetchData() {
    setFetchingViewAllUsers(true);

    const { data, hasMore } = await getUsers(viewAllUsers.keys.length);
    data.forEach((row) => (users.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _viewAllUsers = { ...viewAllUsers };

    if (data.length > 0) {
      _viewAllUsers.keys = [...viewAllUsers.keys, ...ids];
    }

    _viewAllUsers.hasMore = hasMore;
    _viewAllUsers.hasInitialized = true;

    setViewAllUsers(_viewAllUsers);

    setFetchingViewAllUsers(false);
  }

  return [viewAllUsers, fetchingViewAllUsers];
}

export { useUser, useExploreUsers, useViewAllUsers };
