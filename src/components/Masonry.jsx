import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ScreenResizeContext, ScrollDataContext } from "../common/contexts.js";
import ImageView from "./ImageView.jsx";
import VideoView from "./VideoView.jsx";

function Masonry({ elementRef }) {
  const { scrollData, setScrollData } = useContext(ScrollDataContext);
  const { screenResize } = useContext(ScreenResizeContext);
  const [masonry, setMasonry] = useState(null);
  const [isMasonryCreated, setIsMasonryCreated] = useState(false);
  const timerRef = useRef();

  function createMasonry(numberOfColumns) {
    const masonryInfo = {
      columns: {},
      lastPostId: null,
    };

    let i = 0;
    while (i < numberOfColumns) {
      masonryInfo.columns[`column-${i}`] = [];
      i++;
    }

    let j = 0;
    while (j < scrollData.data.length) {
      const post = scrollData.data[j];

      if (j === scrollData.data.length - 1) {
        masonryInfo.lastPostId = post.id;
      }

      const col = j % numberOfColumns;
      masonryInfo.columns[`column-${col}`].push(post);

      j++;
    }

    setMasonry(masonryInfo);
    if (!isMasonryCreated) setIsMasonryCreated(true);
  }

  function callCreateMasonry() {
    if (screenResize === 0) {
      if (window.innerWidth < 640) {
        createMasonry(2);
      } else if (window.innerWidth >= 640) {
        createMasonry(4);
      }
    } else {
      if (screenResize < 640) {
        createMasonry(2);
      } else if (screenResize >= 640) {
        createMasonry(4);
      }
    }
  }

  useEffect(() => {
    callCreateMasonry();
  }, [scrollData]);

  useEffect(() => {
    if (isMasonryCreated && scrollData && scrollData.type === "POSTS") {
      window.scroll({ top: scrollData.scrollYPosition, behavior: "instant" });
    }
  }, [isMasonryCreated]);

  useEffect(() => {
    if (screenResize !== 0) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callCreateMasonry(), 1000);

      return () => {
        clearTimeout(timerRef.current);
      };
    }
  }, [screenResize]);

  return (
    <>
      {masonry && (
        <div className="flex w-full gap-4">
          {Object.values(masonry.columns).map((column, columnIndex) => (
            <div key={columnIndex} className="flex w-full flex-col gap-4">
              {column.map((post, postIndex) => (
                <Link
                  to={`/posts/${post.id}`}
                  state={{ post }}
                  className="group relative top-0 w-full rounded-lg border-2 border-transparent hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0"
                  ref={post.id === masonry.lastPostId ? elementRef : null}
                  key={postIndex}
                  id={post.id}
                  onClick={() => {
                    setScrollData({
                      ...scrollData,
                      scrollYPosition: window.scrollY,
                      elementId: post.id,
                    });
                  }}
                >
                  {post.type === "IMAGE" && (
                    <ImageView
                      images={post.images}
                      isMasonryView={true}
                      autoPlayCarousel={true}
                    />
                  )}
                  {post.type !== "IMAGE" && (
                    <VideoView
                      images={post.images}
                      videos={post.videos}
                      isMasonryView={true}
                    />
                  )}
                  <div className="z-3 absolute bottom-0 flex w-full flex-col justify-end gap-4 rounded-b-lg bg-black/50 p-4 opacity-0 backdrop-blur group-hover:opacity-100">
                    <h1 className="text-white">{post.title}</h1>
                    {post.status === "ACCEPTED" && (
                      <div className="flex items-center gap-2">
                        {post.user_id.avatar_file && (
                          <img
                            className="aspect-square w-full max-w-[40px] rounded-full object-cover"
                            src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${post.user_id.avatar_file}`}
                            alt={post.user_id.avatar_file}
                          />
                        )}
                        <h2 className="text-xs text-white">
                          By {post.user_id.username}
                          {post.user_id.display_name && (
                            <span> - {post.user_id.display_name}</span>
                          )}
                        </h2>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Masonry;
