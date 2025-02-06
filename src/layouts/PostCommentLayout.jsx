import { useEffect, useState } from 'react';
import {
  getPostCommentsByParentPostCommentId,
  getPostCommentById,
} from '../common/database/post-comments';
import Loading from '../components/Loading';
import { useLocation, useParams } from 'react-router';
import PostComment from '../components/PostComment';
import { Link } from 'react-router';
import { getDate } from '../common/helpers';

function PostCommentLayout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [postComment, setPostComment] = useState(null);
  const [isLoadingPostComments, setIsLoadingPostComments] = useState(false);
  const { id } = useParams();

  const [postCommentsTracker, setPostCommentsList] = useState({});

  useEffect(() => {
    if (location.state?.postComment) {
      setPostComment(location.state.postComment);
    } else {
      getPostComment();
    }
  }, [location]);

  async function getPostComment() {
    setIsLoading(true);
    const { data } = await getPostCommentById(id);
    setPostComment(data[0]);
    setIsLoading(false);
  }

  async function expandCollapsePostComments(parentPostCommentId) {
    if (postCommentsTracker[parentPostCommentId]) {
      const _postCommentsTrackerItem = {
        ...postCommentsTracker[parentPostCommentId],
      };
      _postCommentsTrackerItem.isExpand = !_postCommentsTrackerItem.isExpand;
      const _postCommentsTracker = { ...postCommentsTracker };
      _postCommentsTracker[parentPostCommentId] = _postCommentsTrackerItem;
      setPostCommentsList(_postCommentsTracker);
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
    setPostCommentsList(_postCommentsTracker);

    setIsLoadingPostComments(false);
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {isLoading && <Loading />}
      {!isLoading && postComment && (
        <>
          <Link
            to={`/post/${postComment.post.id}`}
            className="flex w-full flex-col gap-4 whitespace-nowrap rounded-lg border-2 border-neutral-700 p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0 sm:whitespace-normal"
            state={{ post: postComment.post }}
          >
            <div className="flex w-full gap-4">
              {postComment.post.is_anonymous && (
                <p className="text-xs">Anonymous</p>
              )}
              {!postComment.post.is_anonymous && (
                <p className="text-xs">{postComment.post.user.username}</p>
              )}
              <p className="text-xs text-neutral-700">
                {getDate(postComment.post.created_at, true)}
              </p>
            </div>
            <h1>{postComment.post.title}</h1>
            {postComment.post.description && (
              <p>{postComment.post.description}</p>
            )}
          </Link>
          <PostComment
            postComment={postComment}
            postCommentsTracker={postCommentsTracker}
            expandCollapsePostComments={expandCollapsePostComments}
            showMorePostComments={showMorePostComments}
            showLink={false}
          />
          {isLoadingPostComments && <Loading />}
        </>
      )}
    </div>
  );
}

export default PostCommentLayout;
