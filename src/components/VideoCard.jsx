import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';

function VideoCard({ video, elementRef }) {
  const { setShowModal } = useContext(ModalContext);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  return (
    <Link
      onClick={() => setShowModal({ type: null, data: null })}
      to={`/videos/${video.id}`}
      state={{ video }}
      className="block w-[320px] snap-start rounded-lg"
      ref={elementRef}
    >
      <div className="flex flex-col gap-2 rounded-lg">
        <img
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/video-thumbnails/${video.thumbnail_file_name}`}
          alt={video.thumbnail_file_name}
          width={1920}
          height={1080}
          className={`aspect-16/9 rounded-lg object-center ${isLoadingImage ? 'hidden' : 'block'}`}
          onLoad={() => setIsLoadingImage(false)}
        />
        <div
          className={`aspect-16/9 animate-pulse rounded-lg bg-neutral-200 ${isLoadingImage ? 'block' : 'hidden'}`}
        ></div>
        <h1>{video.title}</h1>
      </div>
    </Link>
  );
}

export default VideoCard;
