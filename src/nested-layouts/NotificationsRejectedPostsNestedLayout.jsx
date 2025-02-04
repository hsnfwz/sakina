import { useEffect, useContext, useState, useRef } from 'react';
import { Link, useOutletContext } from 'react-router';
import { getRejectedPostsNotificationsByProfileId } from '../common/supabase';
import { UserContext, NotificationsContext } from '../common/contexts';
import { useElementIntersection } from '../common/hooks';
import Loading from '../components/Loading';
import Loaded from '../components/Loaded';
import Button from '../components/Button';
import { getDate } from '../common/helpers';
import SVGSolidCircle from '../components/svgs/solid/SVGSolidCircle';
import SVGOutlineDoubleCheck from '../components/svgs/outline/SVGOutlineDoubleCheck';

function NotificationsRejectedPostsNestedLayout() {
  const { user } = useContext(UserContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const { newNotification } = useContext(NotificationsContext);

  const {
    isLoadingRejectedPostsNotifications,
    setIsLoadingRejectedPostsNotifications,
    rejectedPostsNotificationsHasInitialized,
    setRejectedPostsNotificationsHasInitialized,
    rejectedPostsNotificationsHasMore,
    setRejectedPostsNotificationsHasMore,
    rejectedPostsNotifications,
    setRejectedPostsNotifications,
    rejectedPostsNotificationsScrollY,
    setRejectedPostsNotificationsScrollY,
  } = useOutletContext();

  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!rejectedPostsNotificationsHasInitialized) {
      getNotifications();
    }

    setTimeout(() => {
      window.scroll({
        top: rejectedPostsNotificationsScrollY,
        behavior: 'instant',
      });
    }, 0); // listens for the first 'tick' before scrolling - need this so we can scroll once masonry is loaded

    window.addEventListener('scroll', () => {
      scrollYRef.current = window.scrollY;
    });

    return () => {
      setRejectedPostsNotificationsScrollY(scrollYRef.current);
    };
  }, []);

  useEffect(() => {
    if (newNotification && newNotification.type === 'REJECTED') {
      refreshNotifications();
    }
  }, [newNotification]);

  useEffect(() => {
    if (intersectingElement && rejectedPostsNotificationsHasMore) {
      getNotifications();
    }
  }, [intersectingElement]);

  async function getNotifications() {
    setIsLoadingRejectedPostsNotifications(true);

    const { data, hasMore } = await getRejectedPostsNotificationsByProfileId(
      user.id,
      rejectedPostsNotifications.length
    );

    if (data.length > 0) {
      setRejectedPostsNotifications([...rejectedPostsNotifications, ...data]);
    }

    setRejectedPostsNotificationsHasMore(hasMore);

    if (!rejectedPostsNotificationsHasInitialized) {
      setRejectedPostsNotificationsHasInitialized(true);
    }

    setIsLoadingRejectedPostsNotifications(false);
  }

  async function refreshNotifications() {
    setIsLoadingRejectedPostsNotifications(true);
    setRejectedPostsNotifications([
      newNotification,
      ...rejectedPostsNotifications,
    ]);
    setIsLoadingRejectedPostsNotifications(false);
  }

  return (
    <div>
      {rejectedPostsNotifications.length > 0 && (
        <div className="flex flex-col divide-y-2 divide-neutral-700">
          {rejectedPostsNotifications.map((notification, index) => (
            <div
              key={notification.id}
              ref={
                index === rejectedPostsNotifications.length - 1
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
              <p>
                Your post has been rejected for not following platform rules and
                guidelines. You have 24 hours to make any changes and resubmit
                for approval before the post is permanently deleted from your
                account.
              </p>
              <Link
                to={`/profile/${user.username}/rejected-posts`}
                className="underline hover:text-sky-500"
              >
                View Post
              </Link>
            </div>
          ))}
        </div>
      )}
      {isLoadingRejectedPostsNotifications && <Loading />}
      {!rejectedPostsNotificationsHasMore && <Loaded />}
    </div>
  );
}

export default NotificationsRejectedPostsNestedLayout;
