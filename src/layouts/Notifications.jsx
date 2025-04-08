import { useEffect, useContext, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { updateNotificationById } from '../common/database/notifications.js';
import {
  useReadNotifications,
  useUnreadNotifications,
} from '../common/hooks/notifications.js';
import { BUTTON_COLOR } from '../common/enums.js';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { useElementIntersection } from '../common/hooks.js';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import Button from '../components/Button.jsx';
import Header from '../components/Header.jsx';
import NotificationCard from '../components/NotificationCard.jsx';

function Notifications() {
  const { authUser } = useContext(AuthContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [unreadNotifications, fetchingUnreadNotifications] =
    useUnreadNotifications(intersectingElement);
  const [readNotifications, fetchingReadNotifications] =
    useReadNotifications(intersectingElement);

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (authUser) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [authUser]);

  async function handleRead(id) {
    setIsLoading(true);
    await updateNotificationById(id, {
      is_read: true,
    });
    setIsLoading(false);
  }

  async function handleUnread(id) {
    setIsLoading(true);
    await updateNotificationById(id, {
      is_read: false,
    });
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
            className={`block w-full rounded-lg px-2 py-1 text-center ${location.search === '' || location.search === '?view=unread' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
            to="?view=unread"
          >
            Unread
          </Link>
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className={`block w-full rounded-lg px-2 py-1 text-center ${location.search === '?view=read' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
            to="?view=read"
          >
            Read
          </Link>
        </div>
        {(location.search === '' || location.search === '?view=unread') && (
          <>
            {unreadNotifications.data.length > 0 && (
              <div className="flex flex-col divide-y-2 divide-neutral-100">
                {unreadNotifications.data.map((notification, index) => (
                  <div key={index} className="flex justify-between gap-2">
                    <NotificationCard
                      notification={notification}
                      elementRef={
                        index === unreadNotifications.data.length - 1
                          ? elementRef
                          : null
                      }
                    />
                    <Button
                      isRound={true}
                      color={BUTTON_COLOR.OUTLINE_RED}
                      isDisabled={isLoading}
                      handleClick={async () =>
                        await handleRead(notification.id)
                      }
                    >
                      <Check />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {!unreadNotifications.hasMore && <Loaded />}
            {fetchingUnreadNotifications && <Loading />}
          </>
        )}

        {location.search === '?view=read' && (
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
                      isDisabled={isLoading}
                      handleClick={async () =>
                        await handleUnread(notification.id)
                      }
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {!readNotifications.hasMore && <Loaded />}
            {fetchingReadNotifications && <Loading />}
          </>
        )}
      </div>
    );
  }
}

export default Notifications;
