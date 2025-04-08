import { useContext } from 'react';
import { MessageCircle, Heart } from 'lucide-react';
import { useParams } from 'react-router';
import { AuthContext } from '../common/context/AuthContextProvider';
import { BUTTON_COLOR } from '../common/enums';
import { addVideoLike, removeVideoLike } from '../common/database/video-likes';
import { useVideo } from '../common/hooks/videos';
import { useVideoLike } from '../common/hooks/video-likes';
import { useVideoView } from '../common/hooks/video-views';
import { ModalContext } from '../common/context/ModalContextProvider';
import Loading from '../components/Loading';
import MediaPlayer from '../components/MediaPlayer';
import Header from '../components/Header';
import Button from '../components/Button';

function Video() {
  const { authUser } = useContext(AuthContext);
  const { setModal } = useContext(ModalContext);
  const { id } = useParams();
  const [video, fetchingVideo] = useVideo(id);
  const [videoLike, setVideoLike, fetchingVideoLike, setFetchingVideoLike] =
    useVideoLike(video);
  useVideoView(video);

  async function handleLike() {
    setFetchingVideoLike(true);

    const data = await addVideoLike({
      user_id: authUser.id,
      video_id: video.id,
    });

    setVideoLike(data);

    setFetchingVideoLike(false);
  }

  async function handleUnlike() {
    setFetchingVideoLike(true);

    await removeVideoLike(videoLike.id);
    setVideoLike(null);

    setFetchingVideoLike(false);
  }

  async function handleLikeUnlike() {
    if (videoLike) {
      await handleUnlike();
    } else {
      await handleLike();
    }
  }

  if (fetchingVideo) {
    return <Loading />;
  }

  if (!fetchingVideo && video) {
    return (
      <div className="flex w-full flex-col gap-4">
        <MediaPlayer media={video} width={1920} height={1080} />
        <Header>{video.title}</Header>
        {video.description && <p>{video.description}</p>}
        <div className="flex gap-2">
          <Button
            isRound={true}
            color={BUTTON_COLOR.SOLID_GREEN}
            handleClick={() => {
              setModal({
                type: 'COMMENT_MODAL',
                data: {
                  parentDiscussionId: null,
                },
              });
            }}
          >
            <MessageCircle />
          </Button>
          {authUser && authUser.id !== video.user_id && (
            <Button
              isRound={true}
              color={
                videoLike ? BUTTON_COLOR.SOLID_RED : BUTTON_COLOR.OUTLINE_RED
              }
              isDisabled={fetchingVideoLike}
              handleClick={handleLikeUnlike}
            >
              <Heart />
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default Video;
