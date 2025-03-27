import { useContext, useEffect, useState } from 'react';
import { getRejectedPostsByProfileId } from '../common/database/posts.js';
import { DataContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Post from '../components/Post.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfileRejectedPostsNestedLayout() {
  const { activeProfile } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  const { profileRejectedPosts, setProfileRejectedPosts } =
    useContext(DataContext);

  useEffect(() => {
    if (activeProfile) {
      if (!profileRejectedPosts.hasInitialized) {
        getRejectedPosts();
      }
    }
  }, [activeProfile]);

  async function getRejectedPosts() {
    setIsLoading(true);

    const { data, hasMore } = await getRejectedPostsByProfileId(
      activeProfile.id,
      profileRejectedPosts.data.length
    );

    const _profileRejectedPosts = { ...profileRejectedPosts };

    if (data.length > 0) {
      _profileRejectedPosts.data = [...profileRejectedPosts.data, ...data];
    }

    _profileRejectedPosts.hasMore = hasMore;

    if (!profileRejectedPosts.hasInitialized) {
      _profileRejectedPosts.hasInitialized = true;
    }

    setProfileRejectedPosts(_profileRejectedPosts);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {profileRejectedPosts.data.map((post, index) => (
        <Post key={index} post={post} isPreview={true} />
      ))}
      {!profileRejectedPosts.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ProfileRejectedPostsNestedLayout;
