import { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  getNotificationsByUserId,
  getReadNotificationsByUserId,
  updateNotificationById,
} from '../common/database/notifications.js';
import { BUTTON_COLOR } from '../common/enums.js';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { useElementIntersection } from '../common/hooks.js';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import Button from '../components/Button.jsx';
import Header from '../components/Header.jsx';
import NotificationCard from '../components/NotificationCard.jsx';
import SVGOutlineMailUnread from '../components/svgs/outline/SVGOutlineMailUnread.jsx';
import SVGOutlineMail from '../components/svgs/outline/SVGOutlineMail.jsx';

function Notifications() {
  const { authUser } = useContext(AuthContext);
  const {
    notifications,
    setNotifications,
    readNotifications,
    setReadNotifications,
  } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [show, setShow] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const location = useLocation();
  const [contentView, setContentView] = useState('');

  useEffect(() => {
    if (authUser) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [authUser]);

  useEffect(() => {
    // setNotificationsCount(0);

    if (authUser) {
      if (location.search === '' || location.search.includes('unread')) {
        if (!notifications.hasInitialized) {
          getNotifications();
        }
      }

      if (location.search.includes('read')) {
        if (!readNotifications.hasInitialized) {
          getReadNotifications();
        }
      }

      if (
        location.search === '' ||
        (location.search === '?view=unread' && contentView !== 'unread')
      ) {
        setContentView('unread');
      }

      if (location.search === '?view=read' && contentView !== 'read') {
        setContentView('read');
      }
    }
  }, [authUser, location]);

  useEffect(() => {
    if (location.search === '' || location.search.includes('unread')) {
      if (intersectingElement && notifications.hasMore) {
        getNotifications();
      }
    }

    if (location.search.includes('read')) {
      if (intersectingElement && readNotifications.hasMore) {
        getReadNotifications();
      }
    }
  }, [intersectingElement]);

  async function getNotifications() {
    setIsLoading(true);

    const { data, hasMore } = await getNotificationsByUserId(
      authUser.id,
      notifications.data.length
    );

    const _notifications = { ...notifications };

    if (data.length > 0) {
      _notifications.data = [...notifications.data, ...data];
    }

    _notifications.hasMore = hasMore;
    _notifications.hasInitialized = true;

    // setNewNotificationsCount(0);

    setNotifications(_notifications);

    setIsLoading(false);
  }

  async function getReadNotifications() {
    setIsLoading(true);

    const { data, hasMore } = await getReadNotificationsByUserId(
      authUser.id,
      readNotifications.data.length
    );

    const _readNotifications = { ...readNotifications };

    if (data.length > 0) {
      _readNotifications.data = [...readNotifications.data, ...data];
    }

    _readNotifications.hasMore = hasMore;
    _readNotifications.hasInitialized = true;

    // setNewNotificationsCount(0);

    setReadNotifications(_readNotifications);

    setIsLoading(false);
  }

  // async function refreshNotifications() {
  //   setIsLoading(true);

  //   const _notifications = { ...notifications };

  //   const { data } = await getNotificationsByProfileId(
  //     authUser.id,
  //     0,
  //     newNotificationsCount
  //   );

  //   _notifications.data = [...data, ...notifications.data];

  //   setNewNotificationsCount(0);

  //   setNotifications(_notifications);

  //   setIsLoading(false);
  // }

  if (show) {
    return (
      <div className="flex w-full flex-col gap-4">
        {/* {notifications.hasInitialized && newNotificationsCount > 0 && (
          <Button
            color={BUTTON_COLOR.BLUE}
            handleClick={refreshNotifications}
            isDisabled={isLoading}
          >
            Refresh ({newNotificationsCount})
          </Button>
        )} */}
        <Header>Notifications</Header>
        <div className="flex gap-2">
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className={`block w-full rounded-lg px-2 py-1 text-center ${contentView === 'unread' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
            to="?view=unread"
          >
            Unread
          </Link>
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className={`block w-full rounded-lg px-2 py-1 text-center ${contentView === 'read' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
            to="?view=read"
          >
            Read
          </Link>
        </div>
        {contentView === 'unread' && (
          <>
            {notifications.data.length > 0 && (
              <div className="flex flex-col divide-y-2 divide-neutral-100">
                {notifications.data.map((notification, index) => (
                  <div key={index} className="flex justify-between gap-2">
                    <NotificationCard
                      notification={notification}
                      elementRef={
                        index === notifications.data.length - 1
                          ? elementRef
                          : null
                      }
                    />
                    <Button
                      isRound={true}
                      color={BUTTON_COLOR.OUTLINE_RED}
                      isDisabled={isLoadingUpdate}
                      handleClick={async () => {
                        setIsLoadingUpdate(true);
                        await updateNotificationById(notification.id, {
                          is_read: true,
                        });
                        setIsLoadingUpdate(false);
                      }}
                    >
                      <SVGOutlineMail />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {!notifications.hasMore && <Loaded />}
          </>
        )}

        {contentView === 'read' && (
          <>
            {readNotifications.data.length > 0 && (
              <div className="flex flex-col divide-y-2 divide-neutral-100">
                {readNotifications.data.map((notification, index) => (
                  <div key={index} className="flex justify-between gap-2">
                    <NotificationCard
                      notification={notification}
                      elementRef={
                        index === readNotifications.data.length - 1
                          ? elementRef
                          : null
                      }
                    />
                    <Button
                      isRound={true}
                      color={BUTTON_COLOR.SOLID_RED}
                      isDisabled={isLoadingUpdate}
                      handleClick={async () => {
                        setIsLoadingUpdate(true);
                        await updateNotificationById(notification.id, {
                          is_read: false,
                        });
                        setIsLoadingUpdate(false);
                      }}
                    >
                      <SVGOutlineMailUnread />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {!readNotifications.hasMore && <Loaded />}
          </>
        )}
        {isLoading && <Loading />}
      </div>
    );
  }
}

export default Notifications;
