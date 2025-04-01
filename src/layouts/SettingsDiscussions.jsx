import { useContext, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import {
  getDiscussionsByUserId,
  updateDiscussionById,
} from '../common/database/discussions.js';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import ContentTableGrid from '../components/ContentTableGrid.jsx';
import ContentTableCard from '../components/ContentTableCard.jsx';

function SettingsDiscussions() {
  const { authUser } = useContext(AuthContext);
  const { discussions, setDiscussions } = useOutletContext();
  const { setModal } = useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      if (!discussions.hasInitialized) {
        getDiscussions();
      }
    }
  }, [authUser]);

  async function getDiscussions() {
    setIsLoading(true);

    const { data, hasMore } = await getDiscussionsByUserId(
      authUser.id,
      discussions.data.length
    );

    const _discussions = { ...discussions };

    if (data.length > 0) {
      _discussions.data = [...discussions.data, ...data];
    }

    _discussions.hasMore = hasMore;
    _discussions.hasInitialized = true;

    setDiscussions(_discussions);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <ContentTableGrid>
        {discussions.data.map((discussion, index) => (
          <ContentTableCard
            key={index}
            content={discussion}
            handleEdit={() =>
              setModal({
                type: 'EDIT_MODAL',
                data: {
                  title: discussion.title,
                  description: discussion.description,
                  is_anonymous: discussion.is_anonymous,
                  handleEdit: async (payload) =>
                    await updateDiscussionById(discussion.id, payload),
                },
              })
            }
            handleHide={() => {
              setModal({
                type: 'HIDE_MODAL',
                data: {
                  title: discussion.title,
                  handleHide: async () =>
                    await updateDiscussionById(discussion.id, {
                      is_hidden: true,
                    }),
                },
              });
            }}
          />
        ))}
      </ContentTableGrid>
      {!discussions.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default SettingsDiscussions;
