import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { getVideoById } from '../common/database/videos';
import Loading from '../components/Loading';
import MediaPlayer from '../components/MediaPlayer';

function Video() {
  const { id } = useParams();
  const location = useLocation();

  const [video, setVideo] = useState(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  useEffect(() => {
    if (!location.state?.video) {
      getVideo();
    }

    if (location.state?.video) {
      setVideo(location.state.video);
    }
  }, [location]);

  async function getVideo() {
    setIsLoadingVideo(true);
    const { data } = await getVideoById(id);
    setVideo(data[0]);
    setIsLoadingVideo(false);
  }

  if (isLoadingVideo) {
    return <Loading />;
  }

  if (video) {
    return (
      <MediaPlayer media={video} mediaType="videos" width={1920} height={1080} />
    );
  }
}

export default Video;
