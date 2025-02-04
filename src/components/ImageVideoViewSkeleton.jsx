import { useEffect, useState } from 'react';

function ImageVideoViewSkeleton({ isMasonryView, width, height }) {
  const [skeletonWidth, setSkeletonWidth] = useState(0);

  useEffect(() => {
    let width = 0;

    if (isMasonryView) {
      if (window.innerWidth < 640) {
        width = (window.innerWidth - 16 - 16 - 8) / 2;
      } else if (window.innerWidth >= 640) {
        width = (window.innerWidth - 16 - 16 - 8 - 8 - 8) / 4;
      }
    } else {
      width = window.innerWidth;
    }

    setSkeletonWidth(width);
  }, [isMasonryView]);

  return (
    <div
      style={{ aspectRatio: `${width}/${height}` }}
      className={`flex flex-col items-center justify-center bg-neutral-700 w-[${skeletonWidth}px] animate-pulse rounded-lg`}
    ></div>
  );
}

export default ImageVideoViewSkeleton;
