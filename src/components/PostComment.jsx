import { useContext, useEffect } from 'react';
import { ModalContext, UserContext } from '../common/contexts';
import Button from './Button';
import { getDate } from '../common/helpers';
import SVGOulineArrowDown from './svgs/outline/SVGOutlineArrowDown';
import SVGOutlineArrowUp from './svgs/outline/SVGOutlineArrowUp';
import SVGOutlineCornerDownRightArrow from './svgs/outline/SVGOutlineCornerDownRightArrow';
import { BUTTON_COLOR } from '../common/enums';
import { Link } from 'react-router';

function PostComment({
  postComment,
  elementRef,
  postCommentsTracker,
  expandCollapsePostComments,
  showMorePostComments,
  showLink,
}) {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  return (
    <div className={`flex w-full flex-col gap-2`} ref={elementRef}>
      <div className="flex w-full flex-col gap-4 whitespace-nowrap sm:whitespace-normal">
        {showLink && (
          <Link
            to={`/post/comment/${postComment.id}`}
            className="flex w-full flex-col gap-4 whitespace-nowrap rounded-lg border-2 border-neutral-700 p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0 sm:whitespace-normal"
            state={{ postComment }}
          >
            <div className="flex w-full gap-4">
              <p className="text-xs">
                {postComment.is_anonymous
                  ? 'Anonymous'
                  : postComment.user.username}
              </p>
              <p className="text-xs text-neutral-700">
                {getDate(postComment.created_at, true)}
              </p>
            </div>
            <p>{postComment.description}</p>
          </Link>
        )}
        {!showLink && (
          <div className="flex w-full flex-col gap-4 whitespace-nowrap sm:whitespace-normal">
            <div className="flex w-full gap-4">
              <p className="text-xs">
                {postComment.is_anonymous
                  ? 'Anonymous'
                  : postComment.user.username}
              </p>
              <p className="text-xs text-neutral-700">
                {getDate(postComment.created_at, true)}
              </p>
            </div>
            <p>{postComment.description}</p>
          </div>
        )}
        {user && (
          <div className="self-start">
            <Button
              buttonColor={BUTTON_COLOR.BLUE}
              handleClick={() => {
                setShowModal({
                  type: 'POST_COMMENT_MODAL',
                  data: {
                    parentPostCommentId: postComment.id,
                    postId: postComment.post.id,
                  },
                });
              }}
            >
              Reply
            </Button>
          </div>
        )}
        {postComment.comments_count > 0 && (
          <div className="self-start">
            <Button
              handleClick={async () => {
                await expandCollapsePostComments(postComment.id);
              }}
            >
              {!postCommentsTracker[postComment.id] && (
                <>
                  <SVGOulineArrowDown />
                </>
              )}
              {postCommentsTracker[postComment.id] &&
                postCommentsTracker[postComment.id].isExpand && (
                  <>
                    <SVGOutlineArrowUp />
                  </>
                )}
              {postCommentsTracker[postComment.id] &&
                !postCommentsTracker[postComment.id].isExpand && (
                  <>
                    <SVGOulineArrowDown />
                  </>
                )}
              <span>
                {postComment.comments_count}{' '}
                {postComment.comments_count > 1 ? 'replies' : 'reply'}
              </span>
            </Button>
          </div>
        )}
      </div>
      {postCommentsTracker[postComment.id] &&
        postCommentsTracker[postComment.id].isExpand && (
          <div className={`flex w-full flex-col gap-4 pl-4`}>
            {postCommentsTracker[postComment.id].comments.map(
              (_postComment, index) => (
                <PostComment
                  key={index}
                  postComment={_postComment}
                  postCommentsTracker={postCommentsTracker}
                  expandCollapsePostComments={expandCollapsePostComments}
                  showLink={_postComment.id !== postComment.id}
                />
              )
            )}
            {postCommentsTracker[postComment.id].hasMore && (
              <div className="self-start">
                <Button
                  handleClick={async () =>
                    await showMorePostComments(postComment.id)
                  }
                >
                  <SVGOutlineCornerDownRightArrow />
                  <span>Show More Replies</span>
                </Button>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

export default PostComment;
