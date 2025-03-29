import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';

function ClipCard({ clip, elementRef }) {
  const { setShowModal } = useContext(ModalContext);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  return (
    <Link
      onClick={() => setShowModal({ type: null, data: null })}
      to={`/clips/${clip.id}`}
      state={{ clip }}
      className="block w-[320px] snap-start rounded-lg"
      ref={elementRef}
    >
      <div className="flex w-full flex-col gap-2 rounded-lg">
        <img
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/clip-thumbnails/${clip.thumbnail_file_name}`}
          alt={clip.thumbnail_file_name}
          width={1080}
          height={1920}
          className={`aspect-9/16 w-full rounded-lg object-center ${isLoadingImage ? 'hidden' : 'block'}`}
          onLoad={() => setIsLoadingImage(false)}
        />
        <div
          className={`aspect-9/16 animate-pulse rounded-lg bg-neutral-200 ${isLoadingImage ? 'block' : 'hidden'}`}
        ></div>
        <h1>{clip.title}</h1>
      </div>
    </Link>
  );
}

export default ClipCard;
