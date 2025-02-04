import { useEffect, useState } from 'react';
import IconButton from './IconButton';
import ImageVideoViewSkeleton from './ImageVideoViewSkeleton';
import SVGOutlineArrowLeft from './svgs/outline/SVGOutlineArrowLeft';
import SVGOutlineArrowRight from './svgs/outline/SVGOutlineArrowRight';

function ImageView({ images, isMasonryView, autoPlayCarousel }) {
  const [isLoadingFile, setIsLoadingFile] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  function isCarouselAspectRatioEqual(images) {
    const first = images[0];

    let i = 1;
    while (i < images.length) {
      const next = images[i];

      if (first.width / first.height !== next.width / next.height) {
        return false;
      }

      i++;
    }

    return true;
  }

  useEffect(() => {
    if (!isLoadingFile) {
      if (images.length > 1) {
        if (autoPlayCarousel) {
          const interval = setInterval(() => {
            if (carouselIndex === images.length - 1) {
              setCarouselIndex(0);
            } else {
              setCarouselIndex(carouselIndex + 1);
            }
          }, 5000);

          return () => {
            clearInterval(interval);
          };
        } else {
          if (carouselIndex === images.length) {
            setCarouselIndex(0);
          } else if (carouselIndex === -1) {
            setCarouselIndex(images.length - 1);
          }
        }
      }
    }
  }, [carouselIndex, isLoadingFile]);

  return (
    <div className="relative left-0 top-0">
      <div className="grid">
        {images.map((image, index) => (
          <div key={index} style={{ gridColumn: 1, gridRow: 1 }}>
            {isLoadingFile && (
              <div
                className={`${index === carouselIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <ImageVideoViewSkeleton
                  isMasonryView={isMasonryView}
                  width={isCarouselAspectRatioEqual(images) ? image.width : 1}
                  height={isCarouselAspectRatioEqual(images) ? image.height : 1}
                />
              </div>
            )}
            <img
              key={index}
              src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/images/${image.name}`}
              alt={image.name}
              width=""
              height=""
              className={`${index === carouselIndex ? 'opacity-100' : 'opacity-0'} ${isCarouselAspectRatioEqual(images) ? 'aspect-auto object-cover' : 'aspect-square object-contain'} rounded-lg bg-neutral-700`}
              onLoad={() => setIsLoadingFile(false)}
            />
          </div>
        ))}
      </div>
      {!isLoadingFile && images.length > 1 && (
        <div className="absolute bottom-0 flex w-full gap-2 p-2">
          {images.map((image, index) => (
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
      {!isLoadingFile && images.length > 1 && !autoPlayCarousel && (
        <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-between gap-2 p-2">
          <IconButton handleClick={() => setCarouselIndex(carouselIndex - 1)}>
            <SVGOutlineArrowLeft />
          </IconButton>
          <IconButton handleClick={() => setCarouselIndex(carouselIndex + 1)}>
            <SVGOutlineArrowRight />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default ImageView;
