import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { ModalContext, UserContext } from "../common/contexts";
import { useElementIntersection } from "../common/hooks";
import { supabase } from "../common/supabase";
import Button from "../components/Button";
import Loading from "../components/Loading";

const characterLimit = 2000;

function QuestionLayout() {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext)

  const { id } = useParams();
  const location = useLocation();
  const [question, setQuestion] = useState(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  const [questionComment, setQuestionComment] = useState(null);
  const [isLoadingQuestionComment, setIsLoadingQuestionComment] =
    useState(false);

  const [questionComments, setQuestionComments] = useState([]);
  const [isLoadingQuestionComments, setIsLoadingQuestionComments] =
    useState(false);

  const [hasMoreQuestionComments, setHasMoreQuestionComments] = useState(true);

  const [elementRef, isIntersecting] = useElementIntersection();

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

    initialize();
  }, []);

  useEffect(() => {
    async function initialize() {
      if (user && question) {
        setIsLoadingQuestionComment(true);
        const questionCommentResult = await supabase
          .from("question_comments")
          .select("*")
          .eq("user_id", user.id)
          .eq("question_id", question.id);

        if (questionCommentResult.error) {
          console.log(questionCommentResult.error);
        } else {
          setQuestionComment(questionCommentResult.data[0]);
        }
        setIsLoadingQuestionComment(false);
      }
    }

    initialize();
  }, [user, question]);

  useEffect(() => {
    async function initialize() {
      await getQuestionComments();
    }

    if (question && hasMoreQuestionComments) initialize();
  }, [question, isIntersecting]);

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

  return (
    <div className="flex w-full flex-col gap-8">
      {isLoadingQuestion && <Loading />}

      {!isLoadingQuestion && question && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl">{question.title}</h1>
          {question.description && <p>{question.description}</p>}
          {!question.is_anonymous && (
            <p className="text-xs">By {question.user_id.username}</p>
          )}

          {user && questionComment && (
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl">Your Comment</h1>
              <p>{questionComment.description}</p>
            </div>
          )}

{user && !questionComment && (
          <Button outline={true} handleClick={() => setShowModal({ type: 'COMMENT_MODAL', data: { parentQuestionCommentId: null, questionId: question.id } })}>Comment</Button>
            
          )}


          {questionComments.length > 0 && (
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl">Comments</h1>
              <div className="flex flex-col gap-4">
                {questionComments.map((comment, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-neutral-700 p-2 flex flex-col gap-2"
                    ref={
                      index === questionComments.length - 1 ? elementRef : null
                    }
                  >
                    {!comment.is_anonymous && (
                      <p className="text-xs">By {comment.user_id.username}</p>
                    )}
                    <p>{comment.description}</p>
                      <Button outline={true} handleClick={() => {
                        setShowModal({
                          type: 'COMMENT_MODAL',
                          data: {
                            parentQuestionCommentId: comment.id,
                            questionId: question.id
                          }
                        });
                      }}>Reply</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionLayout;
