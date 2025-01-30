import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { ModalContext, UserContext } from "../common/contexts";
import { useElementIntersection } from "../common/hooks";
import { supabase } from "../common/supabase";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { getDate } from "../common/helpers";
import NotFoundLayout from "./NotFoundLayout";
import { Link } from "react-router";
import QuestionComment from "../components/QuestionComment";

function QuestionLayout() {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);
  const { id } = useParams();
  const location = useLocation();
  const [question, setQuestion] = useState(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [questionComments, setQuestionComments] = useState([]);
  const [isLoadingQuestionComments, setIsLoadingQuestionComments] =
    useState(false);
  const [hasMoreQuestionComments, setHasMoreQuestionComments] = useState(true);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [commentsList, setCommentsList] = useState({});

  useEffect(() => {
    async function initialize() {
      setIsLoadingQuestion(true);
      if (location.state?.question) {
        setQuestion(location.state.question);
      } else {
        const { data, error } = await supabase
          .from("questions")
          .select("*, user_id(*)")
          .eq("id", id);

        if (error) {
          console.log(error);
        } else {
          setQuestion(data[0]);
        }
      }
      setIsLoadingQuestion(false);
    }

    window.scroll({ top: 0, behavior: "instant" });
    initialize();
  }, []);

  useEffect(() => {
    async function initialize() {
      await getQuestionComments();
    }

    if (question && hasMoreQuestionComments) initialize();
  }, [question, intersectingElement]);

  async function getQuestionComments() {
    setIsLoadingQuestionComments(true);
    const limit = 6;
    const questionCommentsResult = await supabase
      .from("question_comments")
      .select("*")
      .eq("question_id", question.id)
      .is("parent_question_comment_id", null)
      .order("created_at", { ascending: false })
      .range(questionComments.length, limit + questionComments.length - 1);

    if (questionCommentsResult.error) {
      console.log(questionCommentsResult.error);
    } else {
      setQuestionComments(questionCommentsResult.data);

      if (questionCommentsResult.data.length < limit) {
        setHasMoreQuestionComments(false);
      }
    }
    setIsLoadingQuestionComments(false);
  }

  async function expandCollapseComments(parentQuestionCommentId) {
    if (commentsList[parentQuestionCommentId]) {
      const _commentsListItem = { ...commentsList[parentQuestionCommentId] };
      _commentsListItem.isExpand = !_commentsListItem.isExpand;
      const _commentsList = { ...commentsList };
      _commentsList[parentQuestionCommentId] = _commentsListItem;
      setCommentsList(_commentsList);
    } else {
      await showMoreComments(parentQuestionCommentId);
    }
  }

  async function showMoreComments(parentQuestionCommentId) {
    setIsLoadingQuestionComments(true);

    let _commentsListItem;
    if (commentsList[parentQuestionCommentId]) {
      _commentsListItem = { ...commentsList[parentQuestionCommentId] };
    } else {
      _commentsListItem = {
        comments: [],
        isExpand: true,
        hasMore: true,
      };
    }

    const limit = 6;
    const { data, error } = await supabase
      .from("question_comments")
      .select("*")
      .eq("question_id", question.id)
      .eq("parent_question_comment_id", parentQuestionCommentId)
      .order("created_at", { ascending: false })
      .range(
        _commentsListItem.comments.length,
        limit + _commentsListItem.comments.length - 1,
      );

    if (error) {
      console.log(error);
    } else {
      _commentsListItem.comments = [..._commentsListItem.comments, ...data];

      if (data.length < limit) {
        _commentsListItem.hasMore = false;
      }

      const _commentsList = { ...commentsList };
      _commentsList[parentQuestionCommentId] = _commentsListItem;
      setCommentsList(_commentsList);
    }

    setIsLoadingQuestionComments(false);
  }

  return (
    <div className="flex w-full">
      {isLoadingQuestion && <Loading />}
      {!isLoadingQuestion && !question && <NotFoundLayout />}
      {!isLoadingQuestion && question && (
        <div className="flex w-full flex-col gap-8">
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full gap-4">
                {question.is_anonymous && <p className="text-xs">Anonymous</p>}
                {!question.is_anonymous && (
                  <Link
                    to={`/profile/${question.user_id.username}#posts`}
                    state={{ profile: question.user_id }}
                    className={`text-xs underline hover:text-sky-500`}
                  >
                    {question.user_id.username}
                  </Link>
                )}
                <p className="text-xs text-neutral-700">
                  {getDate(question.created_at, true)}
                </p>
              </div>
              <h1>{question.title}</h1>
              {question.description && <p>{question.description}</p>}
              {user && (
                <div className="flex gap-2 self-start">
                  <Button
                    tailwindColor="emerald"
                    handleClick={() => console.log("boost")}
                  >
                    Boost
                  </Button>
                  <Button
                    tailwindColor="sky"
                    handleClick={() => {
                      setShowModal({
                        type: "COMMENT_MODAL",
                        data: {
                          parentQuestionCommentId: null,
                          questionId: question.id,
                        },
                      });
                    }}
                  >
                    Reply
                  </Button>
                </div>
              )}
            </div>
          </div>
          {questionComments.length === 0 && <p>No comments</p>}
          {questionComments.length > 0 && (
            <div className={`flex w-full flex-col gap-4 overflow-auto`}>
              {questionComments.map((comment, index) => (
                <QuestionComment
                  key={index}
                  question={question}
                  comment={comment}
                  commentsList={commentsList}
                  elementRef={
                    index === questionComments.length - 1 ? elementRef : null
                  }
                  expandCollapseComments={expandCollapseComments}
                  showMoreComments={showMoreComments}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionLayout;
