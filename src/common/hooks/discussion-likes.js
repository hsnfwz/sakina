import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import { getDiscussionLikeByUserIdAndDiscussionId } from '../database/discussion-likes';

function useDiscussionLike(discussion) {
  const { authUser } = useContext(AuthContext);
  const [discussionLike, setDiscussionLike] = useState(null);
  const [fetchingDiscussionLike, setFetchingDiscussionLike] = useState(false);

  useEffect(() => {
    async function getDiscussionLike() {
      setFetchingDiscussionLike(true);

      if (authUser && discussion) {
        if (authUser.id !== discussion.user_id) {
          const data = await getDiscussionLikeByUserIdAndDiscussionId(
            authUser.id,
            discussion.id
          );
          setDiscussionLike(data);
        }
      }

      setFetchingDiscussionLike(false);
    }

    getDiscussionLike();
  }, [authUser, discussion]);

  return [
    discussionLike,
    setDiscussionLike,
    fetchingDiscussionLike,
    setFetchingDiscussionLike,
  ];
}

export { useDiscussionLike };
