import { useContext, useEffect, useState, useRef } from 'react';
import { DataContext, UserContext } from '../common/contexts';
import Loading from '../components/Loading.jsx';
import { getFollowersBySenderProfileId } from '../common/database/followers.js';
import { getAcceptedPostsByReceiverProfileIds } from '../common/database/posts.js';
import Loaded from '../components/Loaded.jsx';
import PostImagePreview from '../components/PostImagePreview.jsx';
import PostVideoPreview from '../components/PostVideoPreview.jsx';
import PostDiscussionPreview from '../components/PostDiscussionPreview.jsx';
import Button from '../components/Button.jsx';
import { BUTTON_COLOR } from '../common/enums.js';

function HomeLayout({ setPostsCount, newPostsCount, setNewPostsCount }) {
  const { user } = useContext(UserContext);
  const { homeAcceptedPosts, setHomeAcceptedPosts } = useContext(DataContext);

  const receiverProfileIds = useRef([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPostsCount(0);

    if (!homeAcceptedPosts.hasInitializedData) {
      getData();
    }
  }, []);

  async function getData() {
    setIsLoading(true);

    const { data: followers } = await getFollowersBySenderProfileId(user.id);

    const receiverIds = followers.map((follower) => follower.receiver.id);

    receiverProfileIds.current = receiverIds;

    const { data, hasMore } =
      await getAcceptedPostsByReceiverProfileIds(receiverIds);

    const _homeAcceptedPosts = { ...homeAcceptedPosts };

    if (data.length > 0) {
      _homeAcceptedPosts.data = [..._homeAcceptedPosts.data, ...data];
    }

    _homeAcceptedPosts.hasMoreData = hasMore;
    _homeAcceptedPosts.hasInitializedData = true;

    setNewPostsCount(0);

    setHomeAcceptedPosts(_homeAcceptedPosts);

    setIsLoading(false);
  }

  async function refreshPosts() {
    setIsLoading(true);

    const _homeAcceptedPosts = { ...homeAcceptedPosts };

    const { data } = await getAcceptedPostsByReceiverProfileIds(
      receiverProfileIds.current,
      0,
      newPostsCount
    );

    _homeAcceptedPosts.data = [...data, ..._homeAcceptedPosts.data];

    setNewPostsCount(0);

    setHomeAcceptedPosts(_homeAcceptedPosts);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <h1>Salam {user.username}!</h1>
      {homeAcceptedPosts.hasInitializedData && newPostsCount > 0 && (
        <Button
          buttonColor={BUTTON_COLOR.BLUE}
          handleClick={refreshPosts}
          isDisabled={isLoading}
        >
          Refresh ({newPostsCount})
        </Button>
      )}
      {homeAcceptedPosts.data.map((post) => (
        <div key={post.id}>
          {post.type === 'IMAGE' && <PostImagePreview postImage={post} />}
          {post.type === 'VIDEO' && <PostVideoPreview postVideo={post} />}
          {post.type === 'DISCUSSION' && (
            <PostDiscussionPreview postDiscussion={post} />
          )}
        </div>
      ))}
      {isLoading && <Loading />}
      {!homeAcceptedPosts.hasMoreData && <Loaded />}
    </div>
  );
}

export default HomeLayout;
