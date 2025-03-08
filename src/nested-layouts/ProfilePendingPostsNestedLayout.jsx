import { useContext, useEffect, useState } from 'react';
import { getPendingPostsByProfileId } from '../common/database/posts.js';
import { DataContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Post from '../components/Post.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfilePendingPostsNestedLayout() {
  const { activeProfile } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  const { profilePendingPosts, setProfilePendingPosts } =
    useContext(DataContext);

  useEffect(() => {
    if (activeProfile) {
      if (!profilePendingPosts.hasInitializedData) {
        getPendingPosts();
      }
    }
  }, [activeProfile]);

  async function getPendingPosts() {
    setIsLoading(true);

    const { data, hasMore } = await getPendingPostsByProfileId(
      activeProfile.id,
      profilePendingPosts.data.length
    );

    const _profilePendingPosts = { ...profilePendingPosts };

    if (data.length > 0) {
      _profilePendingPosts.data = [...profilePendingPosts.data, ...data];
    }

    _profilePendingPosts.hasMoreData = hasMore;

    if (!profilePendingPosts.hasInitializedData) {
      _profilePendingPosts.hasInitializedData = true;
    }

    setProfilePendingPosts(_profilePendingPosts);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {profilePendingPosts.data.map((post, index) => (
        <Post key={index} post={post} isPreview={true} />
      ))}
      {!profilePendingPosts.hasMoreData && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ProfilePendingPostsNestedLayout;
