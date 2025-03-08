import { useContext, useEffect, useState } from 'react';
import { getArchivedPostsByProfileId } from '../common/database/posts.js';
import { DataContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Post from '../components/Post.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfileArchivedPostsNestedLayout() {
  const { activeProfile } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  const { profileArchivedPosts, setProfileArchivedPosts } =
    useContext(DataContext);

  useEffect(() => {
    if (activeProfile) {
      if (!profileArchivedPosts.hasInitializedData) {
        getArchivedPosts();
      }
    }
  }, [activeProfile]);

  async function getArchivedPosts() {
    setIsLoading(true);

    const { data, hasMore } = await getArchivedPostsByProfileId(
      activeProfile.id,
      profileArchivedPosts.data.length
    );

    const _profileArchivedPosts = { ...profileArchivedPosts };

    if (data.length > 0) {
      _profileArchivedPosts.data = [...profileArchivedPosts.data, ...data];
    }

    _profileArchivedPosts.hasMoreData = hasMore;

    if (!profileArchivedPosts.hasInitializedData) {
      _profileArchivedPosts.hasInitializedData = true;
    }

    setProfileArchivedPosts(_profileArchivedPosts);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {profileArchivedPosts.data.map((post, index) => (
        <Post key={index} post={post} isPreview={true} />
      ))}
      {!profileArchivedPosts.hasMoreData && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ProfileArchivedPostsNestedLayout;
