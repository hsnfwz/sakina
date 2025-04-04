import { useContext, useEffect, useState } from 'react';
import { useOutletContext, useLocation, Link } from 'react-router';
import { useElementIntersection } from '../common/hooks';
import {
  getVideosByUserId,
  getHiddenVideosByUserId,
  updateVideoById,
} from '../common/database/videos.js';
import {
  getDiscussionsByUserId,
  getHiddenDiscussionsByUserId,
  updateDiscussionById,
} from '../common/database/discussions.js';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import ContentTableGrid from '../components/ContentTableGrid.jsx';
import ContentTableCard from '../components/ContentTableCard.jsx';

function SettingsVideos() {
  const [elementRef, intersectingElement] = useElementIntersection();
  const { authUser } = useContext(AuthContext);
  const {
    videos,
    setVideos,
    hiddenVideos,
    setHiddenVideos,
    clips,
    setClips,
    hiddenClips,
    setHiddenClips,
    discussions,
    setDiscussions,
    hiddenDiscussions,
    setHiddenDiscussions,
  } = useOutletContext();
  const { setModal } = useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [contentType, setContentType] = useState('');
  const [contentView, setContentView] = useState('');

  useEffect(() => {
    if (authUser) {
      if (location.search === '' || location.search.includes('videos')) {
        if (!videos.hasInitialized) {
          getVideos();
        }
      }

      if (location.search.includes('clips')) {
        if (!clips.hasInitialized) {
          getClips();
        }
      }

      if (location.search.includes('discussions')) {
        if (!discussions.hasInitialized) {
          getDiscussions();
        }
      }

      if (
        (location.search === '' || location.search.includes('videos')) &&
        contentType !== 'videos'
      ) {
        setContentType('videos');
      }

      if (location.search.includes('clips') && contentType !== 'clips') {
        setContentType('clips');
      }

      if (
        location.search.includes('discussions') &&
        contentType !== 'discussions'
      ) {
        setContentType('discussions');
      }

      if (
        (location.search === '' || location.search.includes('shown')) &&
        contentView !== 'shown'
      ) {
        setContentView('shown');
      }

      if (location.search.includes('hidden') && contentView !== 'hidden') {
        setContentView('hidden');
      }
    }
  }, [authUser, location]);

  useEffect(() => {
    if (authUser) {
      if (location.search === '' || location.search.includes('videos')) {
        if (intersectingElement && videos.hasMore) {
          getVideos();
        }
      }

      if (location.search.includes('clips')) {
        if (intersectingElement && clips.hasMore) {
          getClips();
        }
      }

      if (location.search.includes('discussions')) {
        if (intersectingElement && discussions.hasMore) {
          getDiscussions();
        }
      }
    }
  }, [intersectingElement]);

  async function getVideos() {
    setIsLoading(true);

    const [videosResponse, hiddenVideosResponse] = await Promise.all([
      getVideosByUserId(authUser.id, 'HORIZONTAL', videos.data.length),
      getHiddenVideosByUserId(
        authUser.id,
        'HORIZONTAL',
        hiddenVideos.data.length
      ),
    ]);

    const _videos = { ...videos };

    if (videosResponse.data.length > 0) {
      _videos.data = [...videos.data, ...videosResponse.data];
    }

    _videos.hasMore = videosResponse.hasMore;
    _videos.hasInitialized = true;

    const _hiddenVideos = { ...hiddenVideos };

    if (hiddenVideosResponse.data.length > 0) {
      _hiddenVideos.data = [...hiddenVideos.data, ...hiddenVideosResponse.data];
    }

    _hiddenVideos.hasMore = hiddenVideosResponse.hasMore;
    _hiddenVideos.hasInitialized = true;

    setVideos(_videos);
    setHiddenVideos(_hiddenVideos);

    setIsLoading(false);
  }

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

  async function getDiscussions() {
    setIsLoading(true);

    const [discussionsResponse, hiddenDiscussionsResponse] = await Promise.all([
      getDiscussionsByUserId(authUser.id, discussions.data.length),
      getHiddenDiscussionsByUserId(authUser.id, hiddenDiscussions.data.length),
    ]);

    const _discussions = { ...discussions };

    if (discussionsResponse.data.length > 0) {
      _discussions.data = [...discussions.data, ...discussionsResponse.data];
    }

    _discussions.hasMore = discussionsResponse.hasMore;
    _discussions.hasInitialized = true;

    const _hiddenDiscussions = { ...hiddenDiscussions };

    if (hiddenDiscussionsResponse.data.length > 0) {
      _hiddenDiscussions.data = [
        ...hiddenDiscussions.data,
        ...hiddenDiscussionsResponse.data,
      ];
    }

    _hiddenDiscussions.hasMore = hiddenDiscussionsResponse.hasMore;
    _hiddenDiscussions.hasInitialized = true;

    setDiscussions(_discussions);
    setHiddenDiscussions(_hiddenDiscussions);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex gap-2">
        <Link
          onMouseDown={(event) => event.preventDefault()}
          className={`block w-full rounded-lg px-2 py-1 text-center ${contentType === 'videos' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          to={`?type=videos&view=${contentView}`}
        >
          Videos
        </Link>
        <Link
          onMouseDown={(event) => event.preventDefault()}
          className={`block w-full rounded-lg px-2 py-1 text-center ${contentType === 'clips' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          to={`?type=clips&view=${contentView}`}
        >
          Clips
        </Link>
        <Link
          onMouseDown={(event) => event.preventDefault()}
          className={`block w-full rounded-lg px-2 py-1 text-center ${contentType === 'discussions' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          to={`?type=discussions&view=${contentView}`}
        >
          Discussions
        </Link>
      </div>
      <div className="flex gap-2">
        <Link
          onMouseDown={(event) => event.preventDefault()}
          className={`block w-full rounded-lg px-2 py-1 text-center ${contentView === 'shown' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          to={`?type=${contentType}&view=shown`}
        >
          Shown
        </Link>
        <Link
          onMouseDown={(event) => event.preventDefault()}
          className={`block w-full rounded-lg px-2 py-1 text-center ${contentView === 'hidden' ? 'bg-sky-500 text-white hover:bg-sky-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'} flex items-center justify-center border-2 border-transparent text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          to={`?type=${contentType}&view=hidden`}
        >
          Hidden
        </Link>
      </div>
      {contentType === 'videos' && contentView === 'shown' && (
        <>
          <ContentTableGrid>
            {videos.data.map((video, index) => (
              <ContentTableCard
              elementRef={
                index === videos.data.length - 1 ? elementRef : null
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
          {!videos.hasMore && <Loaded />}
        </>
      )}

      {contentType === 'videos' && contentView === 'hidden' && (
        <>
          <ContentTableGrid>
            {hiddenVideos.data.map((video, index) => (
              <ContentTableCard
              elementRef={
                index === hiddenVideos.data.length - 1 ? elementRef : null
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
          {!hiddenVideos.hasMore && <Loaded />}
        </>
      )}
      {contentType === 'clips' && contentView === 'shown' && (
        <>
          <ContentTableGrid>
            {clips.data.map((clip, index) => (
              <ContentTableCard
              elementRef={
                index === clips.data.length - 1 ? elementRef : null
              }
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

      {contentType === 'clips' && contentView === 'hidden' && (
        <>
          <ContentTableGrid>
            {hiddenClips.data.map((clip, index) => (
              <ContentTableCard
              elementRef={
                index === hiddenClips.data.length - 1 ? elementRef : null
              }
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
                handleUnhide={() => {
                  setModal({
                    type: 'UNHIDE_MODAL',
                    data: {
                      title: clip.title,
                      handleUnhide: async () =>
                        await updateVideoById(clip.id, { is_hidden: false }),
                    },
                  });
                }}
              />
            ))}
          </ContentTableGrid>
          {!hiddenClips.hasMore && <Loaded />}
        </>
      )}
      {contentType === 'discussions' && contentView === 'shown' && (
        <>
          <ContentTableGrid>
            {discussions.data.map((discussion, index) => (
              <ContentTableCard
              elementRef={
                index === discussions.data.length - 1 ? elementRef : null
              }
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
        </>
      )}

      {contentType === 'discussions' && contentView === 'hidden' && (
        <>
          <ContentTableGrid>
            {hiddenDiscussions.data.map((discussion, index) => (
              <ContentTableCard
              elementRef={
                index === hiddenDiscussions.data.length - 1 ? elementRef : null
              }
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
                handleUnhide={() => {
                  setModal({
                    type: 'UNHIDE_MODAL',
                    data: {
                      title: discussion.title,
                      handleUnhide: async () =>
                        await updateDiscussionById(discussion.id, {
                          is_hidden: false,
                        }),
                    },
                  });
                }}
              />
            ))}
          </ContentTableGrid>
          {!hiddenDiscussions.hasMore && <Loaded />}
        </>
      )}
      {isLoading && <Loading />}
    </div>
  );
}

export default SettingsVideos;
