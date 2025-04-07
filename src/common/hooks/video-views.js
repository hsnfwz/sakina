import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import {
  getVideoViewByUserIdAndVideoId,
  addVideoView,
  updateVideoView,
} from '../database/video-views';
import { increment } from '../database/rpc';

function useVideoView(video) {
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    async function getVideoView() {
      if (authUser && video) {
        if (authUser.id !== video.user_id) {
          const data = await getVideoViewByUserIdAndVideoId(
            authUser.id,
            video.id
          );

          if (data) {
            await updateVideoView(data.id, {
              updated_at: new Date(),
            });
          } else {
            await addVideoView({
              user_id: authUser.id,
              video_id: video.id,
            });
          }

          await increment('videos', video.id, 'views_count', 1);
        }
      }
    }

    getVideoView();
  }, [authUser, video]);
}

export { useVideoView };
