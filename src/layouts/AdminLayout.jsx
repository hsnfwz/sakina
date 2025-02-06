import { useState, useRef } from 'react';
import { Link, useLocation, Outlet } from 'react-router';

function AdminLayout() {
  const location = useLocation();

  const [pendingPosts, setPendingPosts] = useState([]);
  const [hasMorePendingPosts, setHasMorePendingPosts] = useState(true);
  const [pendingPostsHasInitialized, setPendingPostsHasInitialized] =
    useState(false);

  const scrollRef = useRef({
    pendingPosts: {
      scrollX: 0,
      scrollY: 0,
    },
    acceptedPosts: {
      scrollX: 0,
      scrollY: 0,
    },
    rejectedPosts: {
      scrollX: 0,
      scrollY: 0,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <Link
          className={`${location.pathname === `/admin` || location.pathname.includes('pending-posts') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
          to={`pending-posts`}
        >
          Pending Posts
        </Link>
        <Link
          className={`${location.pathname.includes('accepted-posts') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
          to={`accepted-posts`}
        >
          Accepted Posts
        </Link>
        <Link
          className={`${location.pathname.includes('rejected-posts') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
          to={`rejected-posts`}
        >
          Rejected Posts
        </Link>
      </div>
      <Outlet
        context={{
          pendingPosts,
          setPendingPosts,
          hasMorePendingPosts,
          setHasMorePendingPosts,
          pendingPostsHasInitialized,
          setPendingPostsHasInitialized,
          scrollRef,
        }}
      />
    </div>
  );
}

export default AdminLayout;
