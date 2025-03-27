function VideoCard({ video }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg">
      <img
        src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/video-thumbnails/${video.video_thumbnail_file_name}`}
        alt={video.video_thumbnail_file_name}
        width={1920}
        height={1080}
        className="block aspect-[16/9] rounded-lg object-center"
      />
      <h1>{video.title}</h1>
    </div>
  );
}

export default VideoCard;
