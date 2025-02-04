import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { ModalContext, UserContext } from '../common/contexts';
import { getDate } from '../common/helpers';
import Loaded from '../components/Loaded';
import { useElementIntersection } from '../common/hooks';
import {
  getQuestionById,
  getQuestionComments,
  getReplyComments,
} from '../common/supabase';
import Button from '../components/Button';
import Loading from '../components/Loading';
import QuestionComment from '../components/QuestionComment';
import { BUTTON_COLOR } from '../common/enums';

function QuestionNestedLayout() {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);
  const { id } = useParams();
  const location = useLocation();
  const [elementRef, intersectingElement] = useElementIntersection();

  const [question, setQuestion] = useState(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [questionComments, setQuestionComments] = useState([]);
  const [isLoadingQuestionComments, setIsLoadingQuestionComments] =
    useState(false);
  const [hasMoreQuestionComments, setHasMoreQuestionComments] = useState(true);
  const [commentsList, setCommentsList] = useState({});

  useEffect(() => {
    if (location.state?.question) {
      setQuestion(location.state.question);
    } else {
      getQuestion();
    }
  }, [location]);

  useEffect(() => {
    if (question) {
      getComments();
    }
  }, [question]);

  useEffect(() => {
    if (intersectingElement && hasMoreQuestionComments) {
      getComments();
    }
  }, [intersectingElement]);

  async function getQuestion() {
    setIsLoadingQuestion(true);
    const { data } = await getQuestionById(id);
    setQuestion(data[0]);
    setIsLoadingQuestion(false);
  }

  async function getComments() {
    setIsLoadingQuestionComments(true);
    const { data, hasMore } = await getQuestionComments(
      id,
      questionComments.length
    );
    if (data.length > 0) {
      setQuestionComments([...questionComments, ...data]);
    }
    setHasMoreQuestionComments(hasMore);
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

    const { data, hasMore } = await getReplyComments(
      id,
      parentQuestionCommentId,
      _commentsListItem.comments.length
    );

    if (data.length > 0) {
      _commentsListItem.comments = [..._commentsListItem.comments, ...data];
    }
    _commentsListItem.hasMore = hasMore;

    const _commentsList = { ...commentsList };
    _commentsList[parentQuestionCommentId] = _commentsListItem;
    setCommentsList(_commentsList);

    setIsLoadingQuestionComments(false);
  }

  return (
    <div className="flex w-full">
      {isLoadingQuestion && <Loading />}
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
                    buttonColor={BUTTON_COLOR.GREEN}
                    handleClick={() => console.log('boost')}
                  >
                    Boost
                  </Button>
                  <Button
                    buttonColor={BUTTON_COLOR.BLUE}
                    handleClick={() => {
                      setShowModal({
                        type: 'COMMENT_MODAL',
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
          {isLoadingQuestionComments && <Loading />}
          {questionComments.length === 0 && <Loaded />}
        </div>
      )}
    </div>
  );
}

export default QuestionNestedLayout;
