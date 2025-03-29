import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { getClipById } from '../common/database/clips';
import Loading from '../components/Loading';
import MediaPlayer from '../components/MediaPlayer';

function Clip() {
  const { id } = useParams();
  const location = useLocation();

  const [clip, setClip] = useState(null);
  const [isLoadingClip, setIsLoadingClip] = useState(false);

  useEffect(() => {
    if (!location.state?.clip) {
      getVideo();
    }

    if (location.state?.clip) {
      setClip(location.state.clip);
    }
  }, [location]);

  async function getVideo() {
    setIsLoadingClip(true);
    const { data } = await getClipById(id);
    setClip(data[0]);
    setIsLoadingClip(false);
  }

  if (isLoadingClip) {
    return <Loading />;
  }

  if (clip) {
    return (
      <MediaPlayer media={clip} mediaType="clips" width={1080} height={1920} />
    );
  }
}

export default Clip;
