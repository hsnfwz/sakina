import { useContext, useEffect, useState } from 'react';
import {
  getQuestionCommentById,
  getQuestionComments,
} from '../common/supabase';
import Loading from '../components/Loading';
import { useLocation, useParams } from 'react-router';
import QuestionComment from '../components/QuestionComment';
import { ModalContext, UserContext } from '../common/contexts';
import Button from '../components/Button';
import { BUTTON_COLOR } from '../common/enums';
import { Link } from 'react-router';
import { getDate } from '../common/helpers';

function QuestionCommentLayout() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [questionComment, setQuestionComment] = useState(null);
  // const [isLoadingQuestionComments, setIsLoadingQuestionComments] = useState(false);
  const { id } = useParams();
  const { setShowModal } = useContext(ModalContext);

  const [questionCommentsList, setQuestionCommentsList] = useState({});

  useEffect(() => {
    if (location.state?.questionComment) {
      setQuestionComment(location.state.questionComment);
    } else {
      getQuestionComment();
    }
  }, [location]);

  async function getQuestionComment() {
    setIsLoading(true);
    const { data } = await getQuestionCommentById(id);
    setQuestionComment(data[0]);
    setIsLoading(false);
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
    // setIsLoadingQuestionComments(true);

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
      questionComment.question.id,
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

    // setIsLoadingQuestionComments(false);
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {isLoading && <Loading />}
      {!isLoading && questionComment && (
        <>
          <Link
            to={`/question/${questionComment.question.id}`}
            className="flex w-full flex-col gap-4 whitespace-nowrap rounded-lg border-2 border-neutral-700 p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0 sm:whitespace-normal"
            state={{ question: questionComment.question }}
          >
            <div className="flex w-full gap-4">
              {questionComment.question.is_anonymous && (
                <p className="text-xs">Anonymous</p>
              )}
              {!questionComment.question.is_anonymous && (
                <p className="text-xs">
                  {questionComment.question.user.username}
                </p>
              )}
              <p className="text-xs text-neutral-700">
                {getDate(questionComment.question.created_at, true)}
              </p>
            </div>
            <h1>{questionComment.question.title}</h1>
            {questionComment.question.description && (
              <p>{questionComment.question.description}</p>
            )}
          </Link>
          <QuestionComment
            questionComment={questionComment}
            questionCommentsList={questionCommentsList}
            expandCollapseComments={expandCollapseComments}
            showMoreComments={showMoreComments}
            showLink={false}
          />
        </>
      )}
    </div>
  );
}

export default QuestionCommentLayout;
