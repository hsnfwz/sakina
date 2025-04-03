import { useContext, useEffect, useState } from 'react';
import { useOutletContext, useLocation } from 'react-router';
import {
  getVideosByUserId,
  updateVideoById,
  getHiddenVideosByUserId,
} from '../common/database/videos';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import ContentTableGrid from '../components/ContentTableGrid.jsx';
import ContentTableCard from '../components/ContentTableCard.jsx';

function SettingsClips() {
  const { authUser } = useContext(AuthContext);
  const { clips, setClips, hiddenClips, setHiddenClips } = useOutletContext();
  const { setModal } = useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (authUser) {
      if (!clips.hasInitialized) {
        getClips();
      }
    }
  }, [authUser]);

  async function getClips() {
    setIsLoading(true);

    const [clipsResponse, hiddenClipsResponse] = await Promise.all([
      getVideosByUserId(authUser.id, 'VERTICAL', clips.data.length),
      getHiddenVideosByUserId(authUser.id, 'VERTICAL', hiddenClips.data.length),
    ]);

    const _clips = { ...clips };

    if (clipsResponse.data.length > 0) {
      _clips.data = [...clips.data, ...clipsResponse.data];
    }

    _clips.hasMore = clipsResponse.hasMore;
    _clips.hasInitialized = true;

    const _hiddenClips = { ...hiddenClips };

    if (hiddenClipsResponse.data.length > 0) {
      _hiddenClips.data = [...hiddenClips.data, ...hiddenClipsResponse.data];
    }

    _hiddenClips.hasMore = hiddenClipsResponse.hasMore;
    _hiddenClips.hasInitialized = true;

    setClips(_clips);
    setHiddenClips(_hiddenClips);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {(location.search === '' || location.search.includes('shown')) && (
        <>
          <ContentTableGrid>
            {clips.data.map((clip, index) => (
              <ContentTableCard
                key={index}
                content={clip}
                handleEdit={() =>
                  setModal({
                    type: 'EDIT_MODAL',
                    data: {
                      title: clip.title,
                      description: clip.description,
                      is_anonymous: clip.is_anonymous,
                      handleEdit: async (payload) =>
                        await updateVideoById(clip.id, payload),
                    },
                  })
                }
                handleHide={() => {
                  setModal({
                    type: 'HIDE_MODAL',
                    data: {
                      title: clip.title,
                      handleHide: async () =>
                        await updateVideoById(clip.id, { is_hidden: true }),
                    },
                  });
                }}
              />
            ))}
          </ContentTableGrid>
          {!clips.hasMore && <Loaded />}
        </>
      )}
      {location.search.includes('hidden') && (
        <>
          <ContentTableGrid>
            {hiddenClips.data.map((video, index) => (
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
                handleUnhide={() => {
                  setModal({
                    type: 'UNHIDE_MODAL',
                    data: {
                      title: video.title,
                      handleUnhide: async () =>
                        await updateVideoById(video.id, { is_hidden: false }),
                    },
                  });
                }}
              />
            ))}
          </ContentTableGrid>
          {!hiddenClips.hasMore && <Loaded />}
        </>
      )}
      {isLoading && <Loading />}
    </div>
  );
}

export default SettingsClips;
