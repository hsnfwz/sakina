import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { ModalContext } from "../common/contexts";
import { useElementIntersection } from "../common/hooks";
import { supabase } from "../common/supabase";
import IconButton from "../components/IconButton";
import Loading from "../components/Loading";
import SVGPlus from "../components/svg/SVGPlus";

function LearnLayout() {
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true);
  const { setShowModal } = useContext(ModalContext);

  const [elementRef, isIntersecting] = useElementIntersection();

  async function getQuestions(abortController) {
    const limit = 6;
    const { data, error } = await supabase
      .from("questions")
      .select("*, user_id(*)")
      .order("created_at", { ascending: false })
      .range(questions.length, limit + questions.length - 1)
      .abortSignal(abortController.signal);

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      setQuestions([...questions, ...data]);

      if (data.length < limit) {
        setHasMoreQuestions(false);
      }
    }
  }

  useEffect(() => {
    async function initialize() {
      setIsLoadingQuestions(true);
      const abortController = new AbortController();
      await getQuestions(abortController);
      setIsLoadingQuestions(false);
      return () => {
        abortController.abort();
      };
    }

    initialize();
  }, []);

  useEffect(() => {
    async function initialize() {
      setIsLoadingQuestions(true);
      const abortController = new AbortController();
      await getQuestions(abortController);
      setIsLoadingQuestions(false);
      return () => {
        abortController.abort();
      };
    }

    if (hasMoreQuestions) initialize();
  }, [isIntersecting]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-2">
        <h1 className="text-2xl">Questions</h1>
        <IconButton handleClick={() => setShowModal({ type: "QUESTION_MODAL" })}>
          <SVGPlus />
        </IconButton>
      </div>

      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <Link
            key={index}
            to={`/questions/${question.id}`}
            className="flex w-full flex-col gap-4 rounded-lg border border-neutral-700 p-2 hover:border-white focus:border focus:border-white focus:outline-none focus:ring-0"
            ref={index === questions.length - 1 ? elementRef : null}
            state={{ question }}
            target="_blank"
          >
            <h1>{question.title}</h1>
            {!question.is_anonymous && (
              <p className="text-xs">By {question.user_id.username}</p>
            )}
          </Link>
        ))}
      </div>
      {isLoadingQuestions && <Loading />}
    </div>
  );
}

export default LearnLayout;
