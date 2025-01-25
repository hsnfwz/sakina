import { useState } from "react";
import ImageVideoViewSkeleton from "./ImageVideoViewSkeleton";

function VideoView({ fileNames, isMasonryView, videoType }) {
  const [isLoadingFile, setIsLoadingFile] = useState(true);

  return (
    <div>
      <ImageVideoViewSkeleton
        show={isLoadingFile}
        isMasonryView={isMasonryView}
      />
      <video
        width=""
        height=""
        controls={false}
        className={`aspect-auto rounded-lg bg-black ${isLoadingFile ? "hidden" : "block"}`}
        poster={fileNames[1]}
        autoPlay={true}
        muted={true}
        loop={true}
        onCanPlay={() => setIsLoadingFile(false)}
      >
        <source
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/${videoType === "VERTICAL_VIDEO" ? "vertical-videos" : "horizontal-videos"}/${fileNames[0]}`}
          type="video/mp4"
        />
        <source
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/${videoType === "VERTICAL_VIDEO" ? "vertical-videos" : "horizontal-videos"}/${fileNames[0]}`}
          type="video/m4v"
        />
        <source
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/${videoType === "VERTICAL_VIDEO" ? "vertical-videos" : "horizontal-videos"}/${fileNames[0]}`}
          type="video/mov"
        />
      </video>
    </div>
  );
}

export default VideoView;
