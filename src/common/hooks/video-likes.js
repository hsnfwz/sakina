import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import { getVideoLikeByUserIdAndVideoId } from '../database/video-likes';

function useVideoLike(video) {
  const { authUser } = useContext(AuthContext);
  const [videoLike, setVideoLike] = useState(null);
  const [fetchingVideoLike, setFetchingVideoLike] = useState(false);

  useEffect(() => {
    async function getVideoLike() {
      setFetchingVideoLike(true);

      if (authUser && video) {
        if (authUser.id !== video.user_id) {
          const data = await getVideoLikeByUserIdAndVideoId(
            authUser.id,
            video.id
          );
          setVideoLike(data);
        }
      }

      setFetchingVideoLike(false);
    }

    getVideoLike();
  }, [authUser, video]);

  return [videoLike, setVideoLike, fetchingVideoLike, setFetchingVideoLike];
}

export { useVideoLike };
