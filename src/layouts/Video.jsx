import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { getVideoById } from '../common/database/videos';
import { AuthContext } from '../common/context/AuthContextProvider';
import { BUTTON_COLOR } from '../common/enums';
import { increment } from '../common/database/rpc';
import {
  addVideoLike,
  getVideoLikeByUserIdAndVideoId,
  removeVideoLike,
} from '../common/database/video-likes';
import {
  getVideoViewByUserIdAndVideoId,
  addVideoView,
  updateVideoView,
} from '../common/database/video-views';
import Loading from '../components/Loading';
import MediaPlayer from '../components/MediaPlayer';
import Header from '../components/Header';
import Button from '../components/Button';
import SVGOutlineHeart from '../components/svgs/outline/SVGOutlineHeart';

function Video() {
  const { id } = useParams();
  const location = useLocation();
  const { authUser } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoLike, setVideoLike] = useState(null);
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  useEffect(() => {
    if (!location.state?.video) {
      getVideo();
    }

    if (location.state?.video) {
      setVideo(location.state.video);
    }
  }, [location]);

  useEffect(() => {
    if (authUser && video) {
      if (authUser.id !== video.user_id) {
        getVideoLike();
        getVideoView();
      }
    }
  }, [authUser, video]);

  async function getVideo() {
    setIsLoadingVideo(true);
    const { data } = await getVideoById(id);
    setVideo(data[0]);
    setIsLoadingVideo(false);
  }

  async function getVideoLike() {
    setIsLoadingLike(true);
    const { data } = await getVideoLikeByUserIdAndVideoId(
      authUser.id,
      video.id
    );
    setVideoLike(data[0]);
    setIsLoadingLike(false);
  }

  async function getVideoView() {
    const { data } = await getVideoViewByUserIdAndVideoId(
      authUser.id,
      video.id
    );

    if (data[0]) {
      await updateVideoView(data[0].id, {
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

  if (isLoadingVideo) {
    return <Loading />;
  }

  if (video) {
    return (
      <div className="flex w-full flex-col gap-4">
        <MediaPlayer media={video} width={1920} height={1080} />
        <Header>{video.title}</Header>
        {video.description && <p>{video.description}</p>}
        <div className="flex gap-2">
          {/* <Button
              color={BUTTON_COLOR.SOLID_GREEN}
              handleClick={() => {
                setModal({
                  type: 'COMMENT_MODAL',
                  data: {
                    parentDiscussionId: activeDiscussion.id,
                  },
                });
              }}
            >
              <SVGOutlineChat />
            </Button> */}
          {authUser && authUser.id !== video.user_id && (
            <Button
              isRound={true}
              color={
                videoLike ? BUTTON_COLOR.SOLID_RED : BUTTON_COLOR.OUTLINE_RED
              }
              isDisabled={isLoadingLike}
              handleClick={async () => {
                setIsLoadingLike(true);
                if (videoLike) {
                  await removeVideoLike(videoLike.id);
                  setVideoLike(null);
                } else {
                  const { data } = await addVideoLike({
                    user_id: authUser.id,
                    video_id: video.id,
                  });
                  setVideoLike(data[0]);
                }
                setIsLoadingLike(false);
              }}
            >
              <SVGOutlineHeart />
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default Video;
