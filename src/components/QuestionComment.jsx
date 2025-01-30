import { useContext } from "react";
import { ModalContext, UserContext } from "../common/contexts";
import Button from "./Button";
import { getDate } from "../common/helpers";
import IconButton from "./IconButton";
import SVGOulineArrowDown from "./svgs/outline/SVGOutlineArrowDown";
import SVGOutlineArrowUp from "./svgs/outline/SVGOutlineArrowUp";
import SVGOutlineCornerDownRightArrow from "./svgs/outline/SVGOutlineCornerDownRightArrow";

function QuestionComment({
  question,
  comment,
  elementRef,
  commentsList,
  expandCollapseComments,
  showMoreComments,
}) {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  return (
    <div className={`flex w-full flex-col gap-2`} ref={elementRef}>
      <div className="flex w-full flex-col gap-4 whitespace-nowrap sm:whitespace-normal">
        <div className="flex w-full gap-4">
          <p className="text-xs">
            {comment.is_anonymous ? "Anonymous" : comment.user_id.username}
          </p>
          <p className="text-xs text-neutral-700">
            {getDate(comment.created_at, true)}
          </p>
        </div>
        <p>{comment.description}</p>
        {user && (
          <div className="self-start">
            <Button
              tailwindColor="sky"
              handleClick={() => {
                setShowModal({
                  type: "COMMENT_MODAL",
                  data: {
                    parentQuestionCommentId: comment.id,
                    questionId: question.id,
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
              handleClick={async () => await expandCollapseComments(comment.id)}
            >
              {!commentsList[comment.id] && (
                <>
                  <SVGOulineArrowDown />
                </>
              )}
              {commentsList[comment.id] &&
                commentsList[comment.id].isExpand && (
                  <>
                    <SVGOutlineArrowUp />
                  </>
                )}
              {commentsList[comment.id] &&
                !commentsList[comment.id].isExpand && (
                  <>
                    <SVGOulineArrowDown />
                  </>
                )}
              <span>
                {comment.comments_count}{" "}
                {comment.comments_count > 1 ? "replies" : "reply"}
              </span>
            </Button>
          </div>
        )}
      </div>
      {commentsList[comment.id] && commentsList[comment.id].isExpand && (
        <div className={`flex w-full flex-col gap-4 pl-4`}>
          {commentsList[comment.id].comments.map((_comment, index) => (
            <QuestionComment
              key={index}
              question={question}
              comment={_comment}
              commentsList={commentsList}
              expandCollapseComments={expandCollapseComments}
            />
          ))}
          {commentsList[comment.id].hasMore && (
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

export default QuestionComment;
