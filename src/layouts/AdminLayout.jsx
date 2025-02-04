import { useEffect, useState } from 'react';
import {
  getPendingPosts,
  supabase,
  getPostImagesVideos,
} from '../common/supabase.js';
import Button from '../components/Button.jsx';
import ImageView from '../components/ImageView.jsx';
import Loading from '../components/Loading.jsx';
import VideoView from '../components/VideoView.jsx';
import Loaded from '../components/Loaded.jsx';

function AdminLayout() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [isLoadingPendingPosts, setIsLoadingPendingPosts] = useState(false);
  const [hasMorePendingPosts, setHasMorePendingPosts] = useState(true);

  const [newPendingPost, setNewPendingPost] = useState(null);

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    if (newPendingPost) {
      refreshPendingPosts();
    }
  }, [newPendingPost]);

  useEffect(() => {
    const postsInsertChannel = supabase
      .channel('posts-insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          setNewPendingPost(payload.new);
        }
      )
      .subscribe();

    // const postsUpdateChannel = supabase
    //   .channel('posts-update')
    //   .on(
    //     'postgres_changes',
    //     { event: 'UPDATE', schema: 'public', table: 'posts' },  (payload) => {
    //       setNewPendingPost(payload.new);
    //     }
    //   )
    //   .subscribe();

    return () => {
      postsInsertChannel.unsubscribe();
      // postsUpdateChannel.unsubscribe();
    };
  }, []);

  async function getPosts() {
    setIsLoadingPendingPosts(true);
    const { data, hasMore } = await getPendingPosts(pendingPosts.length);
    if (data.length > 0) {
      setPendingPosts([...pendingPosts, ...data]);
    }
    setHasMorePendingPosts(hasMore);
    setIsLoadingPendingPosts(false);
  }

  async function refreshPendingPosts(postIdToRemove) {
    if (postIdToRemove) {
      const _pendingPosts = pendingPosts.filter(
        (pendingPost) => pendingPost.id !== postIdToRemove
      );
      setPendingPosts(_pendingPosts);
    } else {
      setIsLoadingPendingPosts(true);
      await getPostImagesVideos([newPendingPost]);
      setPendingPosts([...pendingPosts, newPendingPost]);
      setIsLoadingPendingPosts(false);
    }
  }

  async function handleAccept(post) {
    await supabase
      .from('posts')
      .update({ status: 'ACCEPTED' })
      .eq('id', post.id);

    await supabase.from('notifications').insert({
      receiver_user_id: post.user_id.id,
      type: 'ACCEPTED',
      post_id: post.id,
    });

    refreshPendingPosts(post.id);
  }

  async function handleReject(post) {
    await supabase
      .from('posts')
      .update({ status: 'REJECTED' })
      .eq('id', post.id);

    await supabase.from('notifications').insert({
      receiver_user_id: post.user_id.id,
      type: 'REJECTED',
      post_id: post.id,
    });

    refreshPendingPosts(post.id);
  }

  return (
    <div>
      {pendingPosts.length > 0 && (
        <div className="flex aspect-auto w-full max-w-[300px] flex-col gap-8">
          {pendingPosts.map((post) => (
            <div key={post.id} className="flex flex-col gap-4">
              {post.type === 'IMAGE' && (
                <ImageView
                  images={post.images}
                  isMasonryView={false}
                  autoPlayCarousel={false}
                />
              )}
              {post.type === 'VIDEO' && (
                <VideoView
                  images={post.images}
                  videos={post.videos}
                  isMasonryView={false}
                />
              )}
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl">{post.title}</h1>
                {post.description && <p>{post.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  handleClick={async () => await handleAccept(post)}
                  isOutline={true}
                >
                  Accept
                </Button>
                <Button handleClick={async () => await handleReject(post)}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
          {hasMorePendingPosts && (
            <Button handleClick={getPosts}>Load More</Button>
          )}
          {isLoadingPendingPosts && <Loading />}
          {!hasMorePendingPosts && <Loaded />}
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
