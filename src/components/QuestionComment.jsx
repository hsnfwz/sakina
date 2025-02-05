import { useContext, useEffect } from 'react';
import { ModalContext, UserContext } from '../common/contexts';
import Button from './Button';
import { getDate } from '../common/helpers';
import SVGOulineArrowDown from './svgs/outline/SVGOutlineArrowDown';
import SVGOutlineArrowUp from './svgs/outline/SVGOutlineArrowUp';
import SVGOutlineCornerDownRightArrow from './svgs/outline/SVGOutlineCornerDownRightArrow';
import { BUTTON_COLOR } from '../common/enums';
import { Link } from 'react-router';

function QuestionComment({
  questionComment,
  elementRef,
  questionCommentsList,
  expandCollapseComments,
  showMoreComments,
  showLink,
  isInteract,
}) {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  return (
    <div className={`flex w-full flex-col gap-2`} ref={elementRef}>
      <div className="flex w-full flex-col gap-4 whitespace-nowrap sm:whitespace-normal">
        {showLink && (
          <Link
            to={`/question/comment/${questionComment.id}`}
            className="flex w-full flex-col gap-4 whitespace-nowrap rounded-lg border-2 border-neutral-700 p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0 sm:whitespace-normal"
            state={{ questionComment }}
          >
            <div className="flex w-full gap-4">
              <p className="text-xs">
                {questionComment.is_anonymous
                  ? 'Anonymous'
                  : questionComment.user.username}
              </p>
              <p className="text-xs text-neutral-700">
                {getDate(questionComment.created_at, true)}
              </p>
            </div>
            <p>{questionComment.description}</p>
          </Link>
        )}
        {!showLink && (
          <div className="flex w-full flex-col gap-4 whitespace-nowrap sm:whitespace-normal">
            <div className="flex w-full gap-4">
              <p className="text-xs">
                {questionComment.is_anonymous
                  ? 'Anonymous'
                  : questionComment.user.username}
              </p>
              <p className="text-xs text-neutral-700">
                {getDate(questionComment.created_at, true)}
              </p>
            </div>
            <p>{questionComment.description}</p>
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
                    parentQuestionCommentId: questionComment.id,
                    questionId: questionComment.question.id,
                  },
                });
              }}
            >
              Reply
            </Button>
          </div>
        )}
        {questionComment.comments_count > 0 && (
          <div className="self-start">
            <Button
              handleClick={async () => {
                await expandCollapseComments(questionComment.id);
              }}
            >
              {!questionCommentsList[questionComment.id] && (
                <>
                  <SVGOulineArrowDown />
                </>
              )}
              {questionCommentsList[questionComment.id] &&
                questionCommentsList[questionComment.id].isExpand && (
                  <>
                    <SVGOutlineArrowUp />
                  </>
                )}
              {questionCommentsList[questionComment.id] &&
                !questionCommentsList[questionComment.id].isExpand && (
                  <>
                    <SVGOulineArrowDown />
                  </>
                )}
              <span>
                {questionComment.comments_count}{' '}
                {questionComment.comments_count > 1 ? 'replies' : 'reply'}
              </span>
            </Button>
          </div>
        )}
      </div>
      {questionCommentsList[questionComment.id] &&
        questionCommentsList[questionComment.id].isExpand && (
          <div className={`flex w-full flex-col gap-4 pl-4`}>
            {questionCommentsList[questionComment.id].comments.map(
              (_questionComment, index) => (
                <QuestionComment
                  key={index}
                  questionComment={_questionComment}
                  questionCommentsList={questionCommentsList}
                  expandCollapseComments={expandCollapseComments}
                  showLink={_questionComment.id !== questionComment.id}
                />
              )
            )}
            {questionCommentsList[questionComment.id].hasMore && (
              <div className="self-start">
                <Button
                  handleClick={async () =>
                    await showMoreComments(questionComment.id)
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

export default QuestionComment;
