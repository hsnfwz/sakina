import { useEffect, useState } from "react";

function ImageVideoViewSkeleton({ show, isMasonryView }) {
  const [skeletonWidth, setSkeletonWidth] = useState(0);

  useEffect(() => {
    const screenSize = window.innerWidth;
    let width = 0;

    if (isMasonryView) {
      if (screenSize < 640) {
        width = window.innerWidth - 32;
      } else if (screenSize >= 640 && screenSize < 768) {
        width = (window.innerWidth - 32 - 8) / 2;
      } else {
        width = (window.innerWidth - 32 - 16) / 3;
      }
    } else {
      width = screenSize;
    }

    setSkeletonWidth(width);
  }, [isMasonryView]);

  return (
    <div
      className={`${show ? "visible" : "hidden"} flex flex-col items-center justify-center bg-neutral-700 w-[${skeletonWidth}px] aspect-square animate-pulse rounded-lg`}
    ></div>
  );
}

export default ImageVideoViewSkeleton;
