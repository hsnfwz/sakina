import { useContext, useEffect, useState } from 'react';
import { getArchivedPostsByProfileId } from '../common/database/posts.js';
import { DataContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Post from '../components/Post.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfileArchivedPostsNestedLayout() {
  const { activeUser } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  const { profileArchivedPosts, setProfileArchivedPosts } =
    useContext(DataContext);

  useEffect(() => {
    if (activeUser) {
      if (!profileArchivedPosts.hasInitialized) {
        getArchivedPosts();
      }
    }
  }, [activeUser]);

  async function getArchivedPosts() {
    setIsLoading(true);

    const { data, hasMore } = await getArchivedPostsByProfileId(
      activeUser.id,
      profileArchivedPosts.data.length
    );

    const _profileArchivedPosts = { ...profileArchivedPosts };

    if (data.length > 0) {
      _profileArchivedPosts.data = [...profileArchivedPosts.data, ...data];
    }

    _profileArchivedPosts.hasMore = hasMore;

    if (!profileArchivedPosts.hasInitialized) {
      _profileArchivedPosts.hasInitialized = true;
    }

    setProfileArchivedPosts(_profileArchivedPosts);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {profileArchivedPosts.data.map((post, index) => (
        <Post key={index} post={post} isPreview={true} />
      ))}
      {!profileArchivedPosts.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ProfileArchivedPostsNestedLayout;
