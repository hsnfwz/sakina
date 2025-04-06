import { useContext } from 'react';
import { useLocation, Link } from 'react-router';
import { useElementIntersection } from '../common/hooks';
import { useUserHiddenVideos, useUserVideos } from '../common/hooks/videos.js';
import {
  updateVideoById,
} from '../common/database/videos.js';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import ContentTableGrid from '../components/ContentTableGrid.jsx';
import ContentTableCard from '../components/ContentTableCard.jsx';

function SettingsVideos() {
  const [elementRef, intersectingElement] = useElementIntersection();
  const [userVideos, fetchingUserVideos] = useUserVideos(intersectingElement);
  const [userHiddenVideos, fetchingUserHiddenVideos] = useUserHiddenVideos(intersectingElement);
  const { setModal } = useContext(ModalContext);
  const location = useLocation();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex gap-2">
        <Link
          onMouseDown={(event) => event.preventDefault()}
          className={`block w-full rounded-lg px-2 py-1 text-center ${location.search === '' || location.search === '?view=unarchived' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          to="?view=unarchived"
        >
          Unarchived
        </Link>
        <Link
          onMouseDown={(event) => event.preventDefault()}
          className={`block w-full rounded-lg px-2 py-1 text-center ${location.search === '?view=archived' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          to="?view=archived"
        >
          Archived
        </Link>
      </div>
      {(location.search === '' || location.search === '?view=unarchived') && (
        <>
          <ContentTableGrid>
            {userVideos.data.map((video, index) => (
              <ContentTableCard
                elementRef={
                  index === userVideos.data.length - 1 ? elementRef : null
                }
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
                    },
                  });
                }}
              />
            ))}
          </ContentTableGrid>
          {!userVideos.hasMore && <Loaded />}
          {fetchingUserVideos && <Loading />}
        </>
      )}

      {location.search === '?view=archived' && (
        <>
          <ContentTableGrid>
            {userHiddenVideos.data.map((video, index) => (
              <ContentTableCard
                elementRef={
                  index === userHiddenVideos.data.length - 1 ? elementRef : null
                }
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
          {!userHiddenVideos.hasMore && <Loaded />}
          {fetchingUserHiddenVideos && <Loading />}
        </>
      )}
    </div>
  );
}

export default SettingsVideos;
