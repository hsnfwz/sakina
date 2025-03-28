import { useContext, useEffect, useState } from 'react';
import { getPendingPostsByProfileId } from '../common/database/posts.js';
import { DataContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Post from '../components/Post.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfilePendingPostsNestedLayout() {
  const { activeUser } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  const { profilePendingPosts, setProfilePendingPosts } =
    useContext(DataContext);

  useEffect(() => {
    if (activeUser) {
      if (!profilePendingPosts.hasInitialized) {
        getPendingPosts();
      }
    }
  }, [activeUser]);

  async function getPendingPosts() {
    setIsLoading(true);

    const { data, hasMore } = await getPendingPostsByProfileId(
      activeUser.id,
      profilePendingPosts.data.length
    );

    const _profilePendingPosts = { ...profilePendingPosts };

    if (data.length > 0) {
      _profilePendingPosts.data = [...profilePendingPosts.data, ...data];
    }

    _profilePendingPosts.hasMore = hasMore;

    if (!profilePendingPosts.hasInitialized) {
      _profilePendingPosts.hasInitialized = true;
    }

    setProfilePendingPosts(_profilePendingPosts);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {profilePendingPosts.data.map((post, index) => (
        <Post key={index} post={post} isPreview={true} />
      ))}
      {!profilePendingPosts.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ProfilePendingPostsNestedLayout;
