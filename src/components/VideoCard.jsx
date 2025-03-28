import { useState } from 'react';

function VideoCard({ video }) {
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  return (
    <div className="flex flex-col gap-2 rounded-lg">
      <img
        src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/video-thumbnails/${video.video_thumbnail_file_name}`}
        alt={video.video_thumbnail_file_name}
        width={1920}
        height={1080}
        className={`aspect-[16/9] rounded-lg object-center ${isLoadingImage ? 'hidden' : 'block'}`}
        onLoad={() => setIsLoadingImage(false)}
      />
      <div
        className={`aspect-[16/9] animate-pulse rounded-lg bg-neutral-200 ${isLoadingImage ? 'block' : 'hidden'}`}
      ></div>
      <h1>{video.title}</h1>
    </div>
  );
}

export default VideoCard;
