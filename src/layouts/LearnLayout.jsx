import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { ModalContext } from "../common/contexts";
import { ScrollDataContext } from "../common/contexts.js";
import { useElementIntersection } from "../common/hooks";
import { supabase } from "../common/supabase";
import Loading from "../components/Loading";
import { getDate } from "../common/helpers.js";
import { UserContext } from "../common/contexts";

function LearnLayout() {
  const { scrollData, setScrollData } = useContext(ScrollDataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (scrollData.type !== "QUESTIONS") {
        setIsLoadingQuestions(true);
        const abortController = new AbortController();
        await getQuestions(abortController);
        setIsLoadingQuestions(false);
        return () => {
          abortController.abort();
        };
      }
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

    if (intersectingElement && scrollData.hasMoreData) initialize();
  }, [intersectingElement]);

  useEffect(() => {
    if (scrollData && scrollData.type === "QUESTIONS") {
      window.scroll({ top: scrollData.scrollYPosition, behavior: "instant" });
    }
  }, []);

  async function getQuestions(abortController) {
    let _scrollData;
    if (scrollData.type !== "QUESTIONS") {
      _scrollData = {
        type: "QUESTIONS",
        data: [],
        hasMoreData: true,
        scrollY: 0,
      };
    } else {
      _scrollData = { ...scrollData };
    }

    const limit = 6;
    const { data, error } = await supabase
      .from("questions")
      .select("*, user_id(*)")
      .order("created_at", { ascending: false })
      .range(_scrollData.data.length, limit + _scrollData.data.length - 1)
      .abortSignal(abortController.signal);

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      _scrollData.data = [..._scrollData.data, ...data];

      if (data.length < limit) {
        _scrollData.hasMoreData = false;
      }

      setScrollData(_scrollData);
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {isLoadingQuestions && <Loading />}
      {scrollData.type === "QUESTIONS" &&
        scrollData.data.map((question, index) => (
          <Link
            key={index}
            to={`/questions/${question.id}`}
            className="flex w-full flex-col gap-4 rounded-lg border-2 border-neutral-700 p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0"
            ref={index === scrollData.data.length - 1 ? elementRef : null}
            state={{ question }}
          >
            <div className="flex gap-4">
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
            {question.description && (
              <p className="line-clamp-4">{question.description}</p>
            )}
          </Link>
        ))}
    </div>
  );
}

export default LearnLayout;
