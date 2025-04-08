import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import {
  getDiscussionViewByUserIdAndDiscussionId,
  addDiscussionView,
  updateDiscussionView,
} from '../database/discussion-views';
import { increment } from '../database/rpc';

function useDiscussionView(discussion) {
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    async function getDiscussionView() {
      if (authUser && discussion) {
        if (authUser.id !== discussion.user_id) {
          const data = await getDiscussionViewByUserIdAndDiscussionId(
            authUser.id,
            discussion.id
          );

          if (data) {
            await updateDiscussionView(data.id, {
              updated_at: new Date(),
            });
          } else {
            await addDiscussionView({
              user_id: authUser.id,
              discussion_id: discussion.id,
            });
          }

          await increment('discussions', discussion.id, 'views_count', 1);
        }
      }
    }

    getDiscussionView();
  }, [authUser, discussion]);
}

export { useDiscussionView };
