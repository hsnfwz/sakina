import { useEffect, useState } from 'react';
import {
  getCommentsByParentCommentId,
  getCommentById,
} from '../common/database/comments.js';
import Loading from '../components/Loading';
import { useLocation, useParams } from 'react-router';
import Comment from '../components/Comment';
import { Link } from 'react-router';
import { getDate } from '../common/helpers';

function CommentLayout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { id } = useParams();

  const [commentsTracker, setCommentsList] = useState({});

  useEffect(() => {
    if (location.state?.comment) {
      setComment(location.state.comment);
    } else {
      getComment();
    }
  }, [location]);

  async function getComment() {
    setIsLoading(true);
    const { data } = await getCommentById(id);
    setComment(data[0]);
    setIsLoading(false);
  }

  async function expandCollapseComments(parentCommentId) {
    if (commentsTracker[parentCommentId]) {
      const _commentsTrackerItem = {
        ...commentsTracker[parentCommentId],
      };
      _commentsTrackerItem.isExpanded = !_commentsTrackerItem.isExpanded;
      const _commentsTracker = { ...commentsTracker };
      _commentsTracker[parentCommentId] = _commentsTrackerItem;
      setCommentsList(_commentsTracker);
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
        isExpanded: true,
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
    setCommentsList(_commentsTracker);

    setIsLoadingComments(false);
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {isLoading && <Loading />}
      {!isLoading && comment && (
        <>
          <Link
            to={`/post/${comment.post.id}`}
            className="flex w-full flex-col gap-4 rounded-lg border-2 border-neutral-700 p-2 whitespace-nowrap hover:border-white focus:border-2 focus:border-white focus:ring-0 focus:outline-hidden sm:whitespace-normal"
            state={{ post: comment.post }}
          >
            <div className="flex w-full gap-4">
              {comment.post.is_anonymous && (
                <p className="text-xs">Anonymous</p>
              )}
              {!comment.post.is_anonymous && (
                <p className="text-xs">{comment.post.user.username}</p>
              )}
              <p className="text-xs text-neutral-700">
                {getDate(comment.post.created_at, true)}
              </p>
            </div>
            <h1>{comment.post.title}</h1>
            {comment.post.description && <p>{comment.post.description}</p>}
          </Link>
          <Comment
            comment={comment}
            commentsTracker={commentsTracker}
            expandCollapseComments={expandCollapseComments}
            showMoreComments={showMoreComments}
            showLink={false}
          />
          {isLoadingComments && <Loading />}
        </>
      )}
    </div>
  );
}

export default CommentLayout;
