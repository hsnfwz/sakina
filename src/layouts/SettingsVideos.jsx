import { useContext, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import {
  getVideosByUserId,
  updateVideoById,
} from '../common/database/videos.js';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import ContentTableGrid from '../components/ContentTableGrid.jsx';
import ContentTableCard from '../components/ContentTableCard.jsx';

function SettingsVideos() {
  const { authUser } = useContext(AuthContext);
  const { videos, setVideos } = useOutletContext();
  const { setModal } = useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      if (!videos.hasInitialized) {
        getVideos();
      }
    }
  }, [authUser]);

  async function getVideos() {
    setIsLoading(true);

    const { data, hasMore } = await getVideosByUserId(
      authUser.id,
      videos.data.length
    );

    const _videos = { ...videos };

    if (data.length > 0) {
      _videos.data = [...videos.data, ...data];
    }

    _videos.hasMore = hasMore;

    if (!videos.hasInitialized) {
      _videos.hasInitialized = true;
    }

    setVideos(_videos);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <ContentTableGrid>
        {videos.data.map((video, index) => (
          <ContentTableCard
            key={index}
            content={video}
            handleEdit={() =>
              setModal({
                type: 'EDIT_MODAL',
                data: {
                  title: video.title,
                  description: video.description,
                  is_anonymous: video.is_anonymous,
                  handleEdit: async (payload) =>
                    await updateVideoById(video.id, payload),
                },
              })
            }
            handleHide={() => {
              setModal({
                type: 'HIDE_MODAL',
                data: {
                  title: video.title,
                  handleHide: async () =>
                    await updateVideoById(video.id, { is_hidden: true }),
                }
              })
            }}
          />
        ))}
      </ContentTableGrid>
      {!videos.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default SettingsVideos;
