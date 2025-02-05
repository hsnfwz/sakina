import { useEffect, useContext, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { ExploreContext, ScrollContext } from '../common/contexts';
import { getDate } from '../common/helpers';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getQuestions } from '../common/supabase';

function ExploreQuestionsNestedLayout() {
  const {
    questions,
    setQuestions,
    elementRefQuestions,
    intersectingElementQuestions,
    hasMoreQuestions,
    setHasMoreQuestions,
    isLoadingQuestions,
    setIsLoadingQuestions,
    hasInitializedQuestions,
    setHasInitializedQuestions,
  } = useContext(ExploreContext);

  const { scrollRef } = useContext(ScrollContext);

  // const handleScroll = useCallback(() => {
  //   scrollRef.current.exploreQuestions.scrollY = window.scrollY;
  // }, []);

  useEffect(() => {
    async function initialize() {
      if (!hasInitializedQuestions) {
        await getExploreQuestions();
      }

      window.scroll({
        top: scrollRef.current.exploreQuestions.scrollY,
        behavior: 'instant',
      });
    }

    initialize();

    const handleScroll = () =>
      (scrollRef.current.exploreQuestions.scrollY = window.scrollY);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (intersectingElementQuestions && hasMoreQuestions) {
      getExploreQuestions();
    }
  }, [intersectingElementQuestions]);

  async function getExploreQuestions() {
    setIsLoadingQuestions(true);
    const { data, hasMore } = await getQuestions(questions.length);

    if (data.length > 0) {
      setQuestions([...questions, ...data]);
    }

    setHasMoreQuestions(hasMore);
    setIsLoadingQuestions(false);
    if (!hasInitializedQuestions) setHasInitializedQuestions(true);
  }

  return (
    <div>
      {questions.length > 0 && (
        <div className="flex flex-col gap-4">
          {questions.map((question, index) => (
            <Link
              key={index}
              to={`/question/${question.id}`}
              className="flex flex-col gap-4 rounded-lg border-2 border-neutral-700 p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0"
              ref={index === questions.length - 1 ? elementRefQuestions : null}
              state={{ question }}
            >
              <div className="flex gap-4">
                {question.is_anonymous && <p className="text-xs">Anonymous</p>}
                {!question.is_anonymous && (
                  <p className="text-xs">{question.user.username}</p>
                )}
                <p className="text-xs text-neutral-700">
                  {getDate(question.created_at, true)}
                </p>
              </div>
              <h1>{question.title}</h1>
              {question.description && (
                <p className="line-clamp-4">{question.description}</p>
              )}
            </Link>
          ))}
          {!hasMoreQuestions && <Loaded />}
        </div>
      )}
      {isLoadingQuestions && <Loading />}
    </div>
  );
}

export default ExploreQuestionsNestedLayout;
