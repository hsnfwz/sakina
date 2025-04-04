import { Link } from 'react-router';
import { formatDate } from '../common/helpers.js';

function NotificationCard({ notification, elementRef }) {
  return (
    <div ref={elementRef} className="flex w-full flex-col gap-4">
      <p>
        <Link className="underline text-sky-500" to={`/users/${notification.sender.username}`}>{notification.sender.username}</Link> {notification.message}
      </p>
      <p>{formatDate(notification.created_at, true)}</p>
    </div>
  );
}

export default NotificationCard;
