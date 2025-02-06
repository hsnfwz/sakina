import { useEffect, useContext, useState } from 'react';
import { useOutletContext } from 'react-router';
import { supabase } from '../common/supabase';
import {
  getImagePostFiles,
  getPendingPosts,
  getVideoPostFiles,
} from '../common/database/posts';
import { AdminContext } from '../common/contexts';
import { useElementIntersection } from '../common/hooks';
import Loading from '../components/Loading';
import Loaded from '../components/Loaded';
import Button from '../components/Button';
import ImageView from '../components/ImageView';
import VideoView from '../components/VideoView';

function AdminPendingPostsNestedLayout() {
  const { newPendingPost, setNewPendingPost } = useContext(AdminContext);

  const {
    pendingPosts,
    setPendingPosts,
    hasMorePendingPosts,
    setHasMorePendingPosts,
    pendingPostsHasInitialized,
    setPendingPostsHasInitialized,
    scrollRef,
  } = useOutletContext();

  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      await _getPendingPosts();

      window.scroll({
        top: scrollRef.current.pendingPosts.scrollY,
        behavior: 'instant',
      });
    }

    if (!pendingPostsHasInitialized) {
      initialize();

      const handleScroll = () =>
        (scrollRef.current.pendingPosts.scrollY = window.scrollY);

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (newPendingPost) {
      if (newPendingPost.type === 'IMAGE') {
        addNewPendingImagePost();
      } else if (newPendingPost.type === 'VIDEO') {
        addNewPendingVideoPost();
      } else if (newPendingPost.type === 'DISCUSSION') {
        addNewPendingDiscussionPost();
      }
    }
  }, [newPendingPost]);

  useEffect(() => {
    if (intersectingElement && hasMorePendingPosts) {
      _getPendingPosts();
    }
  }, [intersectingElement]);

  async function _getPendingPosts() {
    setIsLoading(true);
    const { data, hasMore } = await getPendingPosts(pendingPosts.length);
    if (data.length > 0) {
      setPendingPosts([...pendingPosts, ...data]);
    }
    setHasMorePendingPosts(hasMore);
    if (!pendingPostsHasInitialized) {
      setPendingPostsHasInitialized(true);
    }
    setIsLoading(false);
  }

  async function addNewPendingImagePost() {
    setIsLoading(true);
    await getImagePostFiles([newPendingPost]);
    setPendingPosts([newPendingPost, ...pendingPosts]);
    setIsLoading(false);
    setNewPendingPost(null);
  }

  async function addNewPendingVideoPost() {
    setIsLoading(true);
    await getVideoPostFiles([newPendingPost]);
    setPendingPosts([newPendingPost, ...pendingPosts]);
    setIsLoading(false);
    setNewPendingPost(null);
  }

  async function addNewPendingDiscussionPost() {
    setIsLoading(true);
    setPendingPosts([newPendingPost, ...pendingPosts]);
    setIsLoading(false);
    setNewPendingPost(null);
  }

  async function removePendingPost(pendingPostId) {
    const _pendingPosts = pendingPosts.filter(
      (pendingPost) => pendingPost.id !== pendingPostId
    );
    setPendingPosts(_pendingPosts);
  }

  async function handleAccept(pendingPost) {
    await supabase
      .from('posts')
      .update({ status: 'ACCEPTED' })
      .eq('id', pendingPost.id);

    await supabase.from('notifications').insert({
      receiver_user_id: pendingPost.user.id,
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
      receiver_user_id: pendingPost.user.id,
      type: 'REJECTED',
      post_id: pendingPost.id,
    });

    removePendingPost(pendingPost.id);
  }

  return (
    <div className="flex flex-col gap-4">
      {pendingPosts.length > 0 && (
        <div className="flex aspect-auto w-full max-w-[300px] flex-col gap-4">
          {pendingPosts.map((pendingPost, index) => (
            <div
              key={pendingPost.id}
              className="flex flex-col gap-4"
              ref={index === pendingPosts.length - 1 ? elementRef : null}
            >
              {pendingPost.type === 'IMAGE' && (
                <ImageView
                  images={pendingPost.images}
                  isMasonryView={false}
                  autoPlayCarousel={false}
                />
              )}
              {pendingPost.type === 'VIDEO' && (
                <VideoView
                  images={pendingPost.images}
                  videos={pendingPost.videos}
                  isMasonryView={false}
                />
              )}
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl">{pendingPost.title}</h1>
                {pendingPost.description && <p>{pendingPost.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  handleClick={async () => await handleAccept(pendingPost)}
                  isOutline={true}
                >
                  Accept
                </Button>
                <Button
                  handleClick={async () => await handleReject(pendingPost)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
          {isLoading && <Loading />}
          {!hasMorePendingPosts && <Loaded />}
        </div>
      )}
    </div>
  );
}

export default AdminPendingPostsNestedLayout;
