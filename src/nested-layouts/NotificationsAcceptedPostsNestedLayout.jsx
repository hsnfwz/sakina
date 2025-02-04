import { useEffect, useContext, useState, useRef } from 'react';
import { Link, useOutletContext } from 'react-router';
import { getAcceptedPostsNotificationsByProfileId } from '../common/supabase';
import { UserContext, NotificationsContext } from '../common/contexts';
import { useElementIntersection } from '../common/hooks';
import Loading from '../components/Loading';
import Loaded from '../components/Loaded';
import Button from '../components/Button';
import { getDate } from '../common/helpers';
import SVGSolidCircle from '../components/svgs/solid/SVGSolidCircle';
import SVGOutlineDoubleCheck from '../components/svgs/outline/SVGOutlineDoubleCheck';

function NotificationsAcceptedPostsNestedLayout() {
  const { user } = useContext(UserContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const { newNotification } = useContext(NotificationsContext);

  const {
    isLoadingAcceptedPostsNotifications,
    setIsLoadingAcceptedPostsNotifications,
    acceptedPostsNotificationsHasInitialized,
    setAcceptedPostsNotificationsHasInitialized,
    acceptedPostsNotificationsHasMore,
    setAcceptedPostsNotificationsHasMore,
    acceptedPostsNotifications,
    setAcceptedPostsNotifications,
    acceptedPostsNotificationsScrollY,
    setAcceptedPostsNotificationsScrollY,
  } = useOutletContext();

  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!acceptedPostsNotificationsHasInitialized) {
      getNotifications();
    }

    setTimeout(() => {
      window.scroll({
        top: acceptedPostsNotificationsScrollY,
        behavior: 'instant',
      });
    }, 0); // listens for the first 'tick' before scrolling - need this so we can scroll once masonry is loaded

    window.addEventListener('scroll', () => {
      scrollYRef.current = window.scrollY;
    });

    return () => {
      setAcceptedPostsNotificationsScrollY(scrollYRef.current);
    };
  }, []);

  useEffect(() => {
    if (newNotification && newNotification.type === 'ACCEPTED') {
      refreshNotifications();
    }
  }, [newNotification]);

  useEffect(() => {
    if (intersectingElement && acceptedPostsNotificationsHasMore) {
      getNotifications();
    }
  }, [intersectingElement]);

  async function getNotifications() {
    setIsLoadingAcceptedPostsNotifications(true);

    const { data, hasMore } = await getAcceptedPostsNotificationsByProfileId(
      user.id,
      acceptedPostsNotifications.length
    );

    if (data.length > 0) {
      setAcceptedPostsNotifications([...acceptedPostsNotifications, ...data]);
    }

    setAcceptedPostsNotificationsHasMore(hasMore);

    if (!acceptedPostsNotificationsHasInitialized) {
      setAcceptedPostsNotificationsHasInitialized(true);
    }

    setIsLoadingAcceptedPostsNotifications(false);
  }

  async function refreshNotifications() {
    setIsLoadingAcceptedPostsNotifications(true);
    setAcceptedPostsNotifications([
      newNotification,
      ...acceptedPostsNotifications,
    ]);
    setIsLoadingAcceptedPostsNotifications(false);
  }

  return (
    <div>
      {acceptedPostsNotifications.length > 0 && (
        <div className="flex flex-col divide-y-2 divide-neutral-700">
          {acceptedPostsNotifications.map((notification, index) => (
            <div
              key={notification.id}
              ref={
                index === acceptedPostsNotifications.length - 1
                  ? elementRef
                  : null
              }
              className="flex flex-col gap-2 py-4"
            >
              {notification.is_read && (
                <div className="fill-neutral-700">
                  <SVGOutlineDoubleCheck />
                </div>
              )}
              {!notification.is_read && (
                <div className="fill-sky-500">
                  <SVGSolidCircle />
                </div>
              )}
              <p className="text-neutral-700">
                {getDate(notification.created_at, true)}
              </p>
              <p>Your post has been accepted!</p>
              <Link
                to={`/post/${notification.post_id.id}`}
                className="underline hover:text-sky-500"
              >
                View Post
              </Link>
            </div>
          ))}
        </div>
      )}
      {isLoadingAcceptedPostsNotifications && <Loading />}
      {!acceptedPostsNotificationsHasMore && <Loaded />}
    </div>
  );
}

export default NotificationsAcceptedPostsNestedLayout;
