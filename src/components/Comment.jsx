import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import { AuthContext } from '../common/context/AuthContextProvider';
import { DataContext } from '../common/context/DataContextProvider';
import { BUTTON_COLOR } from '../common/enums';
import { getCommentsByParentDiscussionId } from '../common/database/discussions';
import SVGOulineArrowDown from './svgs/outline/SVGOutlineArrowDown';
import SVGOutlineArrowUp from './svgs/outline/SVGOutlineArrowUp';
import SVGOutlineCornerDownRightArrow from './svgs/outline/SVGOutlineCornerDownRightArrow';
import Button from './Button';
import DiscussionCard from './DiscussionCard';
import SVGOutlineChat from './svgs/outline/SVGOutlineChat';
import SVGOutlineHeart from '../components/svgs/outline/SVGOutlineHeart';
import SVGOutlineCircle from '../components/svgs/outline/SVGOutlineCircle';
import Loading from './Loading';

function Comment({ comment, elementRef }) {
  const { authUser } = useContext(AuthContext);
  const { setModal } = useContext(ModalContext);
  const { nestedComments, setNestedComments } = useContext(DataContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadingNestedComments, setIsLoadingNestedComments] = useState(false);

  async function getNestedComments(parentDiscussionId) {
    setIsLoadingNestedComments(true);

    let nestedComment;

    if (nestedComments[parentDiscussionId]) {
      nestedComment = { ...nestedComments[parentDiscussionId] };
    } else {
      nestedComment = {
        data: [],
        hasMore: true,
        hasInitialized: false,
      };
    }

    const { data, hasMore } = await getCommentsByParentDiscussionId(
      parentDiscussionId,
      nestedComment.data.length
    );

    if (data.length > 0) {
      nestedComment.data = [...nestedComment.data, ...data];
    }
    nestedComment.hasMore = hasMore;
    nestedComment.hasInitialized = true;

    const _nestedComments = { ...nestedComments };
    _nestedComments[parentDiscussionId] = nestedComment;
    setNestedComments(_nestedComments);

    setIsLoadingNestedComments(false);
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg" ref={elementRef}>
      <div className="flex gap-2">
        <DiscussionCard discussion={comment} showDescription={true} />
        {authUser && (
          <div className="flex flex-col gap-2 rounded-lg bg-white p-2">
            <Button
              isDisabled={isLoadingNestedComments}
              color={BUTTON_COLOR.SOLID_GREEN}
              handleClick={() => {
                setModal({
                  type: 'COMMENT_MODAL',
                  data: {
                    parentDiscussionId: comment.id,
                  },
                });
              }}
            >
              <SVGOutlineChat />
              {/* <span className="px-2">{comment.discussions_count}</span> */}
            </Button>
            <Button
              color={BUTTON_COLOR.SOLID_RED}
              handleClick={() => {}}
              isDisabled={isLoadingNestedComments}
            >
              <SVGOutlineHeart />
              {/* <span className="px-2">{comment.likes_count}</span> */}
            </Button>
            {comment.discussions_count > 0 && (
              <Button
                isDisabled={isLoadingNestedComments}
                color={
                  isExpanded
                    ? BUTTON_COLOR.OUTLINE_BLUE
                    : BUTTON_COLOR.SOLID_BLUE
                }
                handleClick={async () => {
                  if (
                    !nestedComments[comment.id] ||
                    !nestedComments[comment.id].hasInitialized
                  ) {
                    await getNestedComments(comment.id);
                  }
                  setIsExpanded(!isExpanded);
                }}
              >
                {!isExpanded && <SVGOulineArrowDown />}
                {isExpanded && <SVGOutlineArrowUp />}
              </Button>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex w-full flex-col gap-2">
          {nestedComments[comment.id].data.map((_nestedComment, index) => (
            <div className="ml-4" key={_nestedComment.id}>
              <Comment
                comment={_nestedComment}
                getNestedComments={getNestedComments}
              />
            </div>
          ))}
          {nestedComments[comment.id].hasMore && (
            <Button
              isDisabled={isLoadingNestedComments}
              color={BUTTON_COLOR.SOLID_GREEN}
              handleClick={async () => await getNestedComments(comment.id)}
            >
              <SVGOutlineCornerDownRightArrow />
              <span>Show More</span>
            </Button>
          )}
          {isLoadingNestedComments && <Loading />}
        </div>
      )}
    </div>
  );
}

export default Comment;
