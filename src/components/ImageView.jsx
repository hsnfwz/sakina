import { useEffect, useState } from "react";
import IconButton from "./IconButton";
import ImageVideoViewSkeleton from "./ImageVideoViewSkeleton";

function ImageView({ fileNames, isMasonryView, autoPlayCarousel }) {
  const [isLoadingFile, setIsLoadingFile] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (!isLoadingFile) {
      if (fileNames.length > 1) {
        if (autoPlayCarousel) {
          const interval = setInterval(() => {
            if (carouselIndex === fileNames.length - 1) {
              setCarouselIndex(0);
            } else {
              setCarouselIndex(carouselIndex + 1);
            }
          }, 5000);

          return () => {
            clearInterval(interval);
          };
        } else {
          if (carouselIndex === fileNames.length) {
            setCarouselIndex(0);
          } else if (carouselIndex === -1) {
            setCarouselIndex(fileNames.length - 1);
          }
        }
      }
    }
  }, [carouselIndex, isLoadingFile]);

  return (
    <div className="relative">
      <ImageVideoViewSkeleton
        show={isLoadingFile}
        isMasonryView={isMasonryView}
      />
      {fileNames.map((fileName, index) => (
        <img
          key={index}
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/images/${fileName}`}
          alt={fileName}
          width=""
          height=""
          className={`z-1 ${index === carouselIndex ? "visible" : "hidden"} ${isLoadingFile ? "hidden" : "block"} aspect-auto rounded-lg object-cover`}
          onLoad={() => setIsLoadingFile(false)}
        />
      ))}
      {!isLoadingFile && fileNames.length > 1 && (
        <div className="z-2 absolute bottom-0 flex w-full gap-2 p-2">
          {fileNames.map((fileName, index) => (
            <div key={index} className={`h-2 w-full rounded-lg bg-white/50`}>
              {autoPlayCarousel && (
                <>
                  {carouselIndex > index && (
                    <div className={`h-2 w-full rounded-lg bg-white`}></div>
                  )}

                  {carouselIndex < index && (
                    <div className={`h-0 w-0 rounded-lg`}></div>
                  )}

                  {carouselIndex === index && (
                    <div
                      className={`app_animate-fill-slot h-2 rounded-lg bg-white`}
                    ></div>
                  )}
                </>
              )}
              {!autoPlayCarousel && (
                <>
                  {carouselIndex !== index && (
                    <div className={`h-0 w-0 rounded-lg`}></div>
                  )}

                  {carouselIndex === index && (
                    <div className={`h-2 rounded-lg bg-white`}></div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {!isLoadingFile && fileNames.length > 1 && !autoPlayCarousel && (
        <div className="z-3 absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-between gap-2 p-2">
          <IconButton handleClick={() => setCarouselIndex(carouselIndex - 1)}>
            <svg
              className="stroke-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </IconButton>
          <IconButton handleClick={() => setCarouselIndex(carouselIndex + 1)}>
            <svg
              className="stroke-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default ImageView;
