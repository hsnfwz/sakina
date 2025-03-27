function ClipCard({ clip }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg">
      <img
        src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/clip-thumbnails/${clip.clip_thumbnail_file_name}`}
        alt={clip.clip_thumbnail_file_name}
        width={1080}
        height={1920}
        className="block aspect-[9/16] w-full rounded-lg object-center"
      />
      <h1>{clip.title}</h1>
    </div>
  );
}

export default ClipCard;
