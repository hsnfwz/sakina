import { useEffect, useContext, useState } from 'react';
import { supabase } from '../common/supabase';
import { getPendingPosts } from '../common/database/posts';
import { DataContext, AuthContext } from '../common/contexts';
import { useElementIntersection } from '../common/hooks';
import Loading from '../components/Loading';
import Loaded from '../components/Loaded';
import Button from '../components/Button';
import { BUTTON_COLOR } from '../common/enums';
import PostImagePreview from '../components/PostImagePreview';
import PostVideoPreview from '../components/PostVideoPreview';
import PostDiscussionPreview from '../components/PostDiscussionPreview';

function AdminLayout({
  setPendingPostsCount,
  newPendingPostsCount,
  setNewPendingPostsCount,
}) {
  const { authUser } = useContext(AuthContext);
  const { adminPendingPosts, setAdminPendingPosts } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPendingPostsCount(0);

    if (!adminPendingPosts.hasInitialized) {
      getData();
    }
  }, []);

  async function getData() {
    setIsLoading(true);

    const { data, hasMore } = await getPendingPosts(
      adminPendingPosts.data.length
    );

    const _adminPendingPosts = { ...adminPendingPosts };

    if (data.length > 0) {
      _adminPendingPosts.data = [..._adminPendingPosts.data, ...data];
    }

    _adminPendingPosts.hasMore = hasMore;
    _adminPendingPosts.hasInitialized = true;

    setNewPendingPostsCount(0);

    setAdminPendingPosts(_adminPendingPosts);

    setIsLoading(false);
  }

  async function refreshPendingPosts() {
    setIsLoading(true);

    const { data } = await getPendingPosts(0, newPendingPostsCount);

    const _adminPendingPosts = { ...adminPendingPosts };

    _adminPendingPosts.data = [...data, ..._adminPendingPosts.data];

    setNewPendingPostsCount(0);

    setAdminPendingPosts(_adminPendingPosts);

    setIsLoading(false);
  }

  async function removePendingPost(pendingPostId) {
    const _adminPendingPosts = { ...adminPendingPosts };

    _adminPendingPosts.data = _adminPendingPosts.data.filter(
      (pendingPost) => pendingPost.id !== pendingPostId
    );

    setAdminPendingPosts(_adminPendingPosts);
  }

  async function handleAccept(pendingPost) {
    await supabase
      .from('posts')
      .update({ status: 'ACCEPTED' })
      .eq('id', pendingPost.id);

    await supabase.from('notifications').insert({
      sender_user_id: authUser.id,
      receiver_user_id: pendingPost.user_id,
      type: 'ACCEPTED',
      post_id: pendingPost.id,
    });

    removePendingPost(pendingPost.id);
  }

  async function handleReject(pendingPost) {
    await supabase
      .from('posts')
      .update({ status: 'REJECTED' })
      .eq('id', pendingPost.id);

    await supabase.from('notifications').insert({
      sender_user_id: authUser.id,
      receiver_user_id: pendingPost.user_id,
      type: 'REJECTED',
      post_id: pendingPost.id,
    });

    removePendingPost(pendingPost.id);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <h1>Admin</h1>
      {adminPendingPosts.hasInitialized && newPendingPostsCount > 0 && (
        <Button
          buttonColor={BUTTON_COLOR.BLUE}
          handleClick={refreshPendingPosts}
          isDisabled={isLoading}
        >
          Refresh ({newPendingPostsCount})
        </Button>
      )}
      {adminPendingPosts.data.map((pendingPost, index) => (
        <div key={index} className="flex w-full flex-col gap-4">
          {pendingPost.type === 'IMAGE' && (
            <PostImagePreview postImage={pendingPost} />
          )}
          {pendingPost.type === 'VIDEO' && (
            <PostVideoPreview postVideo={pendingPost} />
          )}
          {pendingPost.type === 'DISCUSSION' && (
            <PostDiscussionPreview postDiscussion={pendingPost} />
          )}
          <div className="flex gap-2">
            <Button
              handleClick={async () => await handleAccept(pendingPost)}
              buttonColor={BUTTON_COLOR.BLUE}
            >
              Accept
            </Button>
            <Button
              handleClick={async () => await handleReject(pendingPost)}
              buttonColor={BUTTON_COLOR.RED}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
      {isLoading && <Loading />}
      {!adminPendingPosts.hasMore && <Loaded />}
    </div>
  );
}

export default AdminLayout;
