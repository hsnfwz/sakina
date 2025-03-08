import { useContext, useEffect } from 'react';
import { ModalContext, UserContext } from '../common/contexts';
import Button from './Button';
import { getDate } from '../common/helpers';
import SVGOulineArrowDown from './svgs/outline/SVGOutlineArrowDown';
import SVGOutlineArrowUp from './svgs/outline/SVGOutlineArrowUp';
import SVGOutlineCornerDownRightArrow from './svgs/outline/SVGOutlineCornerDownRightArrow';
import { BUTTON_COLOR } from '../common/enums';
import { Link } from 'react-router';

function Comment({
  comment,
  elementRef,
  commentsTracker,
  expandCollapseComments,
  showMoreComments,
  showLink,
}) {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  return (
    <div className={`flex w-full flex-col gap-2`} ref={elementRef}>
      <div className="flex w-full flex-col gap-4 whitespace-nowrap sm:whitespace-normal">
        {showLink && (
          <Link
            to={`comment/${comment.id}`}
            className="flex w-full flex-col gap-4 whitespace-nowrap rounded-lg border-2 border-neutral-700 p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0 sm:whitespace-normal"
            state={{ comment }}
          >
            <div className="flex w-full gap-4">
              <p className="text-xs">
                {comment.is_anonymous ? 'Anonymous' : comment.user.username}
              </p>
              <p className="text-xs text-neutral-700">
                {getDate(comment.created_at, true)}
              </p>
            </div>
            <p>{comment.description}</p>
          </Link>
        )}
        {!showLink && (
          <div className="flex w-full flex-col gap-4 whitespace-nowrap sm:whitespace-normal">
            <div className="flex w-full gap-4">
              <p className="text-xs">
                {comment.is_anonymous ? 'Anonymous' : comment.user.username}
              </p>
              <p className="text-xs text-neutral-700">
                {getDate(comment.created_at, true)}
              </p>
            </div>
            <p>{comment.description}</p>
          </div>
        )}
        {user && (
          <div className="self-start">
            <Button
              buttonColor={BUTTON_COLOR.BLUE}
              handleClick={() => {
                setShowModal({
                  type: 'COMMENT_MODAL',
                  data: {
                    parentCommentId: comment.id,
                    postId: comment.post.id,
                  },
                });
              }}
            >
              Reply
            </Button>
          </div>
        )}
        {comment.comments_count > 0 && (
          <div className="self-start">
            <Button
              handleClick={async () => {
                await expandCollapseComments(comment.id);
              }}
            >
              {!commentsTracker[comment.id] && (
                <>
                  <SVGOulineArrowDown />
                </>
              )}
              {commentsTracker[comment.id] &&
                commentsTracker[comment.id].isExpand && (
                  <>
                    <SVGOutlineArrowUp />
                  </>
                )}
              {commentsTracker[comment.id] &&
                !commentsTracker[comment.id].isExpand && (
                  <>
                    <SVGOulineArrowDown />
                  </>
                )}
              <span>
                {comment.comments_count}{' '}
                {comment.comments_count > 1 ? 'replies' : 'reply'}
              </span>
            </Button>
          </div>
        )}
      </div>
      {commentsTracker[comment.id] && commentsTracker[comment.id].isExpand && (
        <div className={`flex w-full flex-col gap-4 pl-4`}>
          {commentsTracker[comment.id].comments.map((_comment, index) => (
            <Comment
              key={index}
              comment={_comment}
              commentsTracker={commentsTracker}
              expandCollapseComments={expandCollapseComments}
              showLink={_comment.id !== comment.id}
            />
          ))}
          {commentsTracker[comment.id].hasMore && (
            <div className="self-start">
              <Button
                handleClick={async () => await showMoreComments(comment.id)}
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

export default Comment;
