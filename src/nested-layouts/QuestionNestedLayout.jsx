import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { ExploreContext, ModalContext, UserContext } from '../common/contexts';
import { getDate } from '../common/helpers';
import Loaded from '../components/Loaded';
import { useElementIntersection } from '../common/hooks';
import {
  getQuestionById,
  getQuestionComments,
  addQuestionLike,
  archiveQuestion,
  removeQuestion,
  getQuestionLike,
  removeQuestionLike,
  unarchiveQuestion,
} from '../common/supabase';
import Button from '../components/Button';
import Loading from '../components/Loading';
import QuestionComment from '../components/QuestionComment';
import { BUTTON_COLOR } from '../common/enums';

function QuestionNestedLayout() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  const [elementRef, intersectingElement] = useElementIntersection();

  const [question, setQuestion] = useState(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  const [questionComments, setQuestionComments] = useState([]);
  const [isLoadingQuestionComments, setIsLoadingQuestionComments] =
    useState(false);
  const [hasMoreQuestionComments, setHasMoreQuestionComments] = useState(true);

  const [questionCommentsList, setQuestionCommentsList] = useState({});

  const [questionLike, setQuestionLike] = useState(null);
  const [isLoadingQuestionLike, setIsLoadingQuestionLike] = useState(false);

  const { questions, setQuestions } = useContext(ExploreContext);
  const { id } = useParams();

  useEffect(() => {
    if (location.state?.question) {
      setQuestion(location.state.question);
    } else {
      getQuestion();
    }
  }, [location]);

  useEffect(() => {
    if (question) {
      _getQuestionComments();
      _getQuestionLike();
    }
  }, [question]);

  useEffect(() => {
    if (intersectingElement && hasMoreQuestionComments) {
      _getQuestionComments();
    }
  }, [intersectingElement]);

  async function getQuestion() {
    setIsLoadingQuestion(true);
    const { data } = await getQuestionById(id);
    setQuestion(data[0]);
    setIsLoadingQuestion(false);
  }

  async function _getQuestionLike() {
    setIsLoadingQuestionLike(true);
    const { data } = await getQuestionLike(user.id, question.id);
    setQuestionLike(data[0]);
    setIsLoadingQuestionLike(false);
  }

  async function _getQuestionComments() {
    setIsLoadingQuestionComments(true);
    const { data, hasMore } = await getQuestionComments(
      question.id,
      null,
      questionComments.length
    );
    if (data.length > 0) {
      setQuestionComments([...questionComments, ...data]);
    }
    setHasMoreQuestionComments(hasMore);
    setIsLoadingQuestionComments(false);
  }

  async function expandCollapseComments(parentQuestionCommentId) {
    if (questionCommentsList[parentQuestionCommentId]) {
      const _questionCommentsListItem = {
        ...questionCommentsList[parentQuestionCommentId],
      };
      _questionCommentsListItem.isExpand = !_questionCommentsListItem.isExpand;
      const _questionCommentsList = { ...questionCommentsList };
      _questionCommentsList[parentQuestionCommentId] =
        _questionCommentsListItem;
      setQuestionCommentsList(_questionCommentsList);
    } else {
      await showMoreComments(parentQuestionCommentId);
    }
  }

  async function showMoreComments(parentQuestionCommentId) {
    setIsLoadingQuestionComments(true);

    let _questionCommentsListItem;
    if (questionCommentsList[parentQuestionCommentId]) {
      _questionCommentsListItem = {
        ...questionCommentsList[parentQuestionCommentId],
      };
    } else {
      _questionCommentsListItem = {
        comments: [],
        isExpand: true,
        hasMore: true,
      };
    }

    const { data, hasMore } = await getQuestionComments(
      question.id,
      parentQuestionCommentId,
      _questionCommentsListItem.comments.length
    );

    if (data.length > 0) {
      _questionCommentsListItem.comments = [
        ..._questionCommentsListItem.comments,
        ...data,
      ];
    }
    _questionCommentsListItem.hasMore = hasMore;

    const _questionCommentsList = { ...questionCommentsList };
    _questionCommentsList[parentQuestionCommentId] = _questionCommentsListItem;
    setQuestionCommentsList(_questionCommentsList);

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
                    to={`/profile/${question.user.username}#posts`}
                    state={{ profile: question.user }}
                    className={`text-xs underline hover:text-sky-500`}
                  >
                    {question.user.username}
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
                  {user.id === question.user.id && (
                    <div className="flex gap-2 self-start">
                      <Button
                        buttonColor={BUTTON_COLOR.BLUE}
                        handleClick={async () => {
                          if (questionLike) {
                            await removeQuestionLike(questionLike.id);
                            setQuestionLike(null);
                          } else {
                            const { data } = await addQuestionLike(
                              user.id,
                              question.id
                            );
                            setQuestionLike(data[0]);
                          }
                        }}
                      >
                        {isLoadingQuestionLike && <Loading />}
                        {!isLoadingQuestionLike && (
                          <>{questionLike ? 'Unlike' : 'Like'}</>
                        )}
                      </Button>
                      <Button
                        buttonColor={BUTTON_COLOR.RED}
                        handleClick={() => {
                          setShowModal({
                            type: 'CONFIRM_MODAL',
                            data: {
                              handleSubmit: async () => {
                                await archiveQuestion(question.id);
                                setQuestion(null);
                                const _questions = questions.filter(
                                  (_question) => question.id !== _question.id
                                );
                                setQuestions(_questions);
                                window.history.replaceState(null, '');
                              },
                              title: 'Archive Question',
                              description:
                                'Are you sure you want to archive your question? Users will no longer be able to view your question until you unarchive it.',
                            },
                          });
                        }}
                      >
                        Archive
                      </Button>
                      <Button
                        buttonColor={BUTTON_COLOR.RED}
                        handleClick={() => {
                          setShowModal({
                            type: 'CONFIRM_MODAL',
                            data: {
                              handleSubmit: async () => {
                                await removeQuestion(question.id);
                                setQuestion(null);
                                const _questions = questions.filter(
                                  (_question) => question.id !== _question.id
                                );
                                setQuestions(_questions);
                                window.history.replaceState(null, '');
                              },
                              title: 'Delete Question',
                              description:
                                'Are you sure you want to delete your question? This action cannot be undone.',
                            },
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {questionComments.length > 0 && (
            <div className={`flex w-full flex-col gap-4 overflow-auto`}>
              {questionComments.map((questionComment, index) => (
                <QuestionComment
                  key={index}
                  questionComment={questionComment}
                  questionCommentsList={questionCommentsList}
                  elementRef={
                    index === questionComments.length - 1 ? elementRef : null
                  }
                  expandCollapseComments={expandCollapseComments}
                  showMoreComments={showMoreComments}
                  showLink={true}
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
