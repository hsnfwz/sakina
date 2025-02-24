import { useState, useRef } from 'react';
import { Outlet } from 'react-router';
import NavPanel from '../components/NavPanel';

function AdminLayout() {
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
      <NavPanel links={[
        {
          pathname: '/admin',
          to: 'pending-posts',
          label: 'Pending Posts',
          show: true,
        },
        {
          to: 'accepted-posts',
          label: 'Accepted Posts',
          show: true,
        },
        {
          to: 'rejected-posts',
          label: 'Rejected Posts',
          show: true,
        },
      ]} />
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
