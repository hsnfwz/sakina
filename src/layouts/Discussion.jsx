import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { getDiscussionById } from "../common/database/discussions";
import Loading from "../components/Loading";

function Discussion() {
  const { id } = useParams();
  const location = useLocation();

  const [discussion, setDiscussion] = useState(null);
  const [isLoadingDiscussion, setIsLoadingDiscussion] = useState(false);

  useEffect(() => {
    if (!location.state?.discussion) {
      getDiscussion();
    }

    if (location.state?.discussion) {
      setDiscussion(location.state.discussion);
    }
  }, [location]);

  async function getDiscussion() {
    setIsLoadingDiscussion(true);
    const { data } = await getDiscussionById(id);
    setDiscussion(data[0]);
    setIsLoadingDiscussion(false);
  }

  if (isLoadingDiscussion) {
    return <Loading />;
  }

  if (discussion) {
    return (
      <div className="w-full flex flex-col gap-4">
        <h1>{discussion.title}</h1>
        <p>{discussion.description}</p>
      </div>
    );
  }
}

export default Discussion;
