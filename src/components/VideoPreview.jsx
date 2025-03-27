import { Link } from 'react-router';
import VideoContent from './VideoContent';

function VideoPreview({ video, isAutoPlay }) {
  return (
    <Link
      to={`/post/${video.id}`}
      state={{ post: video }}
      className="flex h-full w-full border-2 border-transparent focus:border-2 focus:border-white focus:outline-none focus:ring-0"
      ref={null}
    >
      <VideoContent video={video} isPreview={true} isAutoPlay={isAutoPlay} />
    </Link>
  );
}

export default VideoPreview;
