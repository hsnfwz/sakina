import { useEffect, useState, useContext } from 'react';
import {
  getNotificationsByUserId
} from '../database/notifications';
import { DataContext } from '../context/DataContextProvider';
import { AuthContext } from '../context/AuthContextProvider';

function useUnreadNotifications(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { unreadNotifications, setUnreadNotifications } =
    useContext(DataContext);
  const [fetchingUnreadNotifications, setFetchingUnreadNotifications] =
    useState(false);

  useEffect(() => {
    if (authUser && !unreadNotifications.hasInitialized) {
      fetchData();
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && unreadNotifications.hasMore) {
      fetchData();
    }
  }, [intersectingElement]);

  async function fetchData() {
    setFetchingUnreadNotifications(true);

    const { data, hasMore } = await getNotificationsByUserId(
      authUser.id,
      false,
      unreadNotifications.data.length
    );

    const _unreadNotifications = { ...unreadNotifications };

    if (data.length > 0) {
      _unreadNotifications.data = [...unreadNotifications.data, ...data];
    }

    _unreadNotifications.hasMore = hasMore;
    _unreadNotifications.hasInitialized = true;

    setUnreadNotifications(_unreadNotifications);

    setFetchingUnreadNotifications(false);
  }

  return [unreadNotifications, fetchingUnreadNotifications];
}

function useReadNotifications(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { readNotifications, setReadNotifications } =
    useContext(DataContext);
  const [fetchingReadNotifications, setFetchingReadNotifications] =
    useState(false);

  useEffect(() => {
    if (authUser && !readNotifications.hasInitialized) {
      fetchData();
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && readNotifications.hasMore) {
      fetchData();
    }
  }, [intersectingElement]);

  async function fetchData() {
    setFetchingReadNotifications(true);

    const { data, hasMore } = await getNotificationsByUserId(
      authUser.id,
      true,
      readNotifications.data.length
    );

    const _readNotifications = { ...readNotifications };

    if (data.length > 0) {
      _readNotifications.data = [...readNotifications.data, ...data];
    }

    _readNotifications.hasMore = hasMore;
    _readNotifications.hasInitialized = true;

    setReadNotifications(_readNotifications);

    setFetchingReadNotifications(false);
  }

  return [readNotifications, fetchingReadNotifications];
}

export {
  useUnreadNotifications,
  useReadNotifications,
};
