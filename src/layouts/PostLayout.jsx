import { useEffect, useContext, useRef, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router';
import { DataContext, ModalContext, UserContext } from '../common/contexts';
import { getLike, addLike, removeLike } from '../common/database/likes.js';
import {
  getAcceptedPostById,
  removePost,
  archivePost,
  removeStorageObjectsByPostId,
} from '../common/database/posts';
import {
  getCommentsByParentCommentId,
  getCommentsByPostId,
} from '../common/database/comments.js';
import PostImage from '../components/PostImage';
import Loading from '../components/Loading';
import PostVideo from '../components/PostVideo';
import Button from '../components/Button';
import { BUTTON_COLOR } from '../common/enums';
import { useElementIntersection } from '../common/hooks';
import Comment from '../components/Comment';
import { getDate } from '../common/helpers';
import Loaded from '../components/Loaded';
import { addPostView } from '../common/database/views.js';
import { addNotification } from '../common/database/notifications.js';

function PostLayout() {
  const { acceptedPosts, setAcceptedPosts } = useContext(DataContext);
  const { setShowModal } = useContext(ModalContext);
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const location = useLocation();

  const [post, setPost] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  const [like, setLike] = useState(null);
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const [commentsTracker, setCommentsTracker] = useState({});

  const [elementRef, intersectingElement] = useElementIntersection();

  useEffect(() => {
    async function initialize() {
      if (user.id !== post.user.id) {
        setTimeout(async () => {
          await addPostView(user.id, post.id);
          await addNotification(user.id, post.user.id, 'VIEW_POST');
        }, 3000);
      }
    }

    if (post) {
      initialize();
    }
  }, [post]);

  useEffect(() => {
    if (location.state?.post) {
      setPost(location.state.post);
    } else {
      getPost();
    }
  }, [location]);

  useEffect(() => {
    if (post) {
      _getLike();
      _getComments();
    }
  }, [post]);

  useEffect(() => {
    if (intersectingElement && hasMoreComments) {
      _getComments();
    }
  }, [intersectingElement]);

  async function getPost() {
    setIsLoadingPost(true);
    const { data } = await getAcceptedPostById(id);
    setPost(data[0]);
    setIsLoadingPost(false);
  }

  async function _getLike() {
    setIsLoadingLike(true);
    const { data } = await getLike(user.id, post.id);
    setLike(data[0]);
    setIsLoadingLike(false);
  }

  async function _getComments() {
    setIsLoadingComments(true);
    const { data, hasMore } = await getCommentsByPostId(
      post.id,
      comments.length
    );
    if (data.length > 0) {
      setComments([...comments, ...data]);
    }
    setHasMoreComments(hasMore);
    setIsLoadingComments(false);
  }

  async function expandCollapseComments(parentCommentId) {
    if (commentsTracker[parentCommentId]) {
      const _commentsTrackerItem = {
        ...commentsTracker[parentCommentId],
      };

      _commentsTrackerItem.isExpand = !_commentsTrackerItem.isExpand;

      const _commentsTracker = { ...commentsTracker };
      _commentsTracker[parentCommentId] = _commentsTrackerItem;

      setCommentsTracker(_commentsTracker);
    } else {
      await showMoreComments(parentCommentId);
    }
  }

  async function showMoreComments(parentCommentId) {
    setIsLoadingComments(true);

    let _commentsTrackerItem;

    if (commentsTracker[parentCommentId]) {
      _commentsTrackerItem = {
        ...commentsTracker[parentCommentId],
      };
    } else {
      _commentsTrackerItem = {
        comments: [],
        isExpand: true,
        hasMore: true,
      };
    }

    const { data, hasMore } = await getCommentsByParentCommentId(
      parentCommentId,
      _commentsTrackerItem.comments.length
    );

    if (data.length > 0) {
      _commentsTrackerItem.comments = [
        ..._commentsTrackerItem.comments,
        ...data,
      ];
    }
    _commentsTrackerItem.hasMore = hasMore;

    const _commentsTracker = { ...commentsTracker };
    _commentsTracker[parentCommentId] = _commentsTrackerItem;
    setCommentsTracker(_commentsTracker);

    setIsLoadingComments(false);
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
            <PostImage
              images={post.images}
              isMasonryView={false}
              autoPlayCarousel={false}
            />
          )}
          {post.type === 'VIDEO' && (
            <PostVideo
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
                    type: 'COMMENT_MODAL',
                    data: {
                      parentCommentId: null,
                      postId: post.id,
                    },
                  });
                }}
              >
                Reply
              </Button>
            </div>
          )}
          {user && user.id === post.user.id && (
            <div className="flex gap-2 self-start">
              <Button
                buttonColor={BUTTON_COLOR.BLUE}
                handleClick={async () => {
                  if (like) {
                    await removeLike(like.id);
                    setLike(null);
                  } else {
                    const { data } = await addLike(user.id, post.id);
                    setLike(data[0]);
                    await addNotification(user.id, post.user.id, 'LIKE_POST');
                  }
                }}
              >
                {isLoadingLike && <Loading />}
                {!isLoadingLike && <>{like ? 'Unlike' : 'Like'}</>}
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
            {comments.length > 0 && (
              <div className={`flex w-full flex-col gap-4 overflow-auto`}>
                {comments.map((comment, index) => (
                  <Comment
                    key={index}
                    comment={comment}
                    commentsTracker={commentsTracker}
                    elementRef={
                      index === comments.length - 1 ? elementRef : null
                    }
                    expandCollapseComments={expandCollapseComments}
                    showMoreComments={showMoreComments}
                    showLink={true}
                  />
                ))}
              </div>
            )}
            {isLoadingComments && <Loading />}
            {comments.length === 0 && <Loaded />}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostLayout;
