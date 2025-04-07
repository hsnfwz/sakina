import { useContext, useState } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';

function VideoCard({ video, elementRef, orientation }) {
  const { setModal } = useContext(ModalContext);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  return (
    <Link
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => setModal({ type: null, data: null })}
      to={
        orientation === 'HORIZONTAL'
          ? `/videos/${video.id}`
          : `/clips/${video.id}`
      }
      state={{ video }}
      className={`group flex h-full w-full flex-col gap-2 rounded-lg border-2 border-transparent focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
      ref={elementRef}
    >
      <div className="relative h-full w-full">
        <img
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/video-thumbnails/${video.thumbnail_file_name}`}
          alt={video.thumbnail_file_name}
          width={orientation === 'HORIZONTAL' ? 1920 : 1080}
          height={orientation === 'HORIZONTAL' ? 1080 : 1920}
          className={`${orientation === 'HORIZONTAL' ? 'aspect-[16/9]' : 'aspect-[9/16]'} h-full w-full rounded-lg object-cover object-center ${isLoadingImage ? 'hidden' : 'block'}`}
          onLoad={() => setIsLoadingImage(false)}
        />
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-lg bg-black/50 fill-white text-white opacity-0 transition-all group-hover:opacity-100">
          <Play />
        </div>
        <div
          className={`${orientation === 'HORIZONTAL' ? 'aspect-[16/9]' : 'aspect-[9/16]'} h-full w-full animate-pulse rounded-lg bg-neutral-100 ${isLoadingImage ? 'block' : 'hidden'}`}
        ></div>
      </div>
      <h1>{video.title}</h1>
    </Link>
  );
}

export default VideoCard;
