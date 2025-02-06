import { useEffect, useContext, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { ExploreContext, ModalContext, UserContext } from '../common/contexts';
import {
  getPostLike,
  addPostLike,
  removePostLike,
} from '../common/database/post-likes';
import {
  getAcceptedPostById,
  removePost,
  archivePost,
  removeStorageObjectsByPostId,
} from '../common/database/posts';
import {
  getPostCommentsByParentPostCommentId,
  getPostCommentsByPostId,
} from '../common/database/post-comments';
import ImageView from '../components/ImageView';
import Loading from '../components/Loading';
import VideoView from '../components/VideoView';
import Button from '../components/Button';
import { BUTTON_COLOR } from '../common/enums';
import { useElementIntersection } from '../common/hooks';
import PostComment from '../components/PostComment';
import { getDate } from '../common/helpers';
import Loaded from '../components/Loaded';

function PostLayout() {
  const { acceptedPosts, setAcceptedPosts } = useContext(ExploreContext);
  const { setShowModal } = useContext(ModalContext);
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const location = useLocation();

  const [post, setPost] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  const [postLike, setPostLike] = useState(null);
  const [isLoadingPostLike, setIsLoadingPostLike] = useState(false);

  const [postComments, setPostComments] = useState([]);
  const [isLoadingPostComments, setIsLoadingPostComments] = useState(false);
  const [hasMorePostComments, setHasMorePostComments] = useState(true);

  const [postCommentsTracker, setPostCommentsTracker] = useState({});

  const [elementRef, intersectingElement] = useElementIntersection();

  // const [disabled, setDisabled] = useState(false);
  // const timerRef = useRef();

  // const viewsResult = await supabase
  //   .from("views")
  //   .select("id", { head: true, count: "estimated" })
  //   .eq("user_id", user.id)
  //   .eq("post_id", post.id);

  // if (viewsResult.error) {
  //   console.log(viewsResult.error);
  // } else {
  //   if (viewsResult.count === 0 && user.id !== post.user_id.id) {
  //     clearTimeout(timerRef.current);
  //     timerRef.current = setTimeout(async () => {
  //       await supabase
  //         .from("views")
  //         .insert({ user_id: user.id, post_id: post.id });
  //     }, 3000);
  //   }
  // }

  useEffect(() => {
    if (location.state?.post) {
      setPost(location.state.post);
    } else {
      getPost();
    }
  }, [location]);

  useEffect(() => {
    if (post) {
      _getPostLike();
      _getPostComments();
    }
  }, [post]);

  useEffect(() => {
    if (intersectingElement && hasMorePostComments) {
      _getPostComments();
    }
  }, [intersectingElement]);

  async function getPost() {
    setIsLoadingPost(true);
    const { data } = await getAcceptedPostById(id);
    setPost(data[0]);
    setIsLoadingPost(false);
  }

  async function _getPostLike() {
    setIsLoadingPostLike(true);
    const { data } = await getPostLike(user.id, post.id);
    setPostLike(data[0]);
    setIsLoadingPostLike(false);
  }

  async function _getPostComments() {
    setIsLoadingPostComments(true);
    const { data, hasMore } = await getPostCommentsByPostId(
      post.id,
      postComments.length
    );
    if (data.length > 0) {
      setPostComments([...postComments, ...data]);
    }
    setHasMorePostComments(hasMore);
    setIsLoadingPostComments(false);
  }

  async function expandCollapsePostComments(parentPostCommentId) {
    if (postCommentsTracker[parentPostCommentId]) {
      const _postCommentsTrackerItem = {
        ...postCommentsTracker[parentPostCommentId],
      };

      _postCommentsTrackerItem.isExpand = !_postCommentsTrackerItem.isExpand;

      const _postCommentsTracker = { ...postCommentsTracker };
      _postCommentsTracker[parentPostCommentId] = _postCommentsTrackerItem;

      setPostCommentsTracker(_postCommentsTracker);
    } else {
      await showMorePostComments(parentPostCommentId);
    }
  }

  async function showMorePostComments(parentPostCommentId) {
    setIsLoadingPostComments(true);

    let _postCommentsTrackerItem;

    if (postCommentsTracker[parentPostCommentId]) {
      _postCommentsTrackerItem = {
        ...postCommentsTracker[parentPostCommentId],
      };
    } else {
      _postCommentsTrackerItem = {
        comments: [],
        isExpand: true,
        hasMore: true,
      };
    }

    const { data, hasMore } = await getPostCommentsByParentPostCommentId(
      parentPostCommentId,
      _postCommentsTrackerItem.comments.length
    );

    if (data.length > 0) {
      _postCommentsTrackerItem.comments = [
        ..._postCommentsTrackerItem.comments,
        ...data,
      ];
    }
    _postCommentsTrackerItem.hasMore = hasMore;

    const _postCommentsTracker = { ...postCommentsTracker };
    _postCommentsTracker[parentPostCommentId] = _postCommentsTrackerItem;
    setPostCommentsTracker(_postCommentsTracker);

    setIsLoadingPostComments(false);
  }

  return (
    <div className="aspect-auto w-full max-w-[300px]">
      {isLoadingPost && <Loading />}
      {!isLoadingPost && post && (
        <div>
          <div className="flex w-full gap-4">
            {post.is_anonymous && <p className="text-xs">Anonymous</p>}
            {!post.is_anonymous && (
              <Link
                to={`/profile/${post.user.username}#posts`}
                state={{ profile: post.user }}
                className={`text-xs underline hover:text-sky-500`}
              >
                {post.user.username}
              </Link>
            )}
            <p className="text-xs text-neutral-700">
              {getDate(post.created_at, true)}
            </p>
          </div>

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
              showControls={true}
            />
          )}
          {/* {post.type === 'DISCUSSION' && (
            <>
                            <h1 className="text-2xl">{post.title}</h1>
                            {post.description && <p>{post.description}</p>}
            </>
          )} */}

          <h1 className="text-2xl">{post.title}</h1>
          {post.description && <p>{post.description}</p>}

          {user && (
            <div className="flex gap-2 self-start">
              <Button
                buttonColor={BUTTON_COLOR.BLUE}
                handleClick={() => {
                  setShowModal({
                    type: 'POST_COMMENT_MODAL',
                    data: {
                      parentPostCommentId: null,
                      postId: post.id,
                    },
                  });
                }}
              >
                Reply
              </Button>
            </div>
          )}
          {user.id === post.user.id && (
            <div className="flex gap-2 self-start">
              <Button
                buttonColor={BUTTON_COLOR.BLUE}
                handleClick={async () => {
                  if (postLike) {
                    await removePostLike(postLike.id);
                    setPostLike(null);
                  } else {
                    const { data } = await addPostLike(user.id, post.id);
                    setPostLike(data[0]);
                  }
                }}
              >
                {isLoadingPostLike && <Loading />}
                {!isLoadingPostLike && <>{postLike ? 'Unlike' : 'Like'}</>}
              </Button>
              <Button
                buttonColor={BUTTON_COLOR.RED}
                handleClick={() => {
                  setShowModal({
                    type: 'CONFIRM_MODAL',
                    data: {
                      handleSubmit: async () => {
                        await archivePost(post.id);
                        setPost(null);
                        const _acceptedPosts = acceptedPosts.filter(
                          (_acceptedPost) => post.id !== _acceptedPost.id
                        );
                        setAcceptedPosts(_acceptedPosts);
                        window.history.replaceState(null, '');
                      },
                      title: 'Archive Post',
                      description:
                        'Are you sure you want to archive your post? Users will no longer be able to view your post until you unarchive it.',
                    },
                  });
                }}
              >
                Archive
              </Button>
              <Button
                buttonColor={BUTTON_COLOR.RED}
                handleClick={() => {
                  setShowModal({
                    type: 'CONFIRM_MODAL',
                    data: {
                      handleSubmit: async () => {
                        await removeStorageObjectsByPostId(post.id);
                        await removePost(post.id);
                        setPost(null);
                        const _acceptedPosts = acceptedPosts.filter(
                          (_acceptedPost) => post.id !== _acceptedPost.id
                        );
                        setAcceptedPosts(_acceptedPosts);
                        window.history.replaceState(null, '');
                      },
                      title: 'Delete Post',
                      description:
                        'Are you sure you want to delete your post? This action cannot be undone.',
                    },
                  });
                }}
              >
                Delete
              </Button>
            </div>
          )}

          <div className="flex w-full flex-col gap-4">
            {postComments.length > 0 && (
              <div className={`flex w-full flex-col gap-4 overflow-auto`}>
                {postComments.map((postComment, index) => (
                  <PostComment
                    key={index}
                    postComment={postComment}
                    postCommentsTracker={postCommentsTracker}
                    elementRef={
                      index === postComments.length - 1 ? elementRef : null
                    }
                    expandCollapsePostComments={expandCollapsePostComments}
                    showMorePostComments={showMorePostComments}
                    showLink={true}
                  />
                ))}
              </div>
            )}
            {isLoadingPostComments && <Loading />}
            {postComments.length === 0 && <Loaded />}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostLayout;
