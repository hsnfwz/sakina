import { useState } from 'react';

function ClipCard({ clip }) {
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg">
      <img
        src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/clip-thumbnails/${clip.clip_thumbnail_file_name}`}
        alt={clip.clip_thumbnail_file_name}
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
  );
}

export default ClipCard;
