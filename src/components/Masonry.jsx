import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { ScreenSizeContext } from "../common/contexts.js";
import ImageView from "./ImageView.jsx";
import VideoView from "./VideoView.jsx";

function Masonry({ posts, elementRef }) {
  const [masonry, setMasonry] = useState(null);

  const { screenSize } = useContext(ScreenSizeContext);

  function createMasonry(posts, numberOfColumns) {
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
    while (j < posts.length) {
      const post = posts[j];

      if (j === posts.length - 1) {
        masonryInfo.lastPostId = post.id;
      }

      const col = j % numberOfColumns;
      masonryInfo.columns[`column-${col}`].push(post);

      j++;
    }

    setMasonry(masonryInfo);
  }

  let timer;
  useEffect(() => {
    timer = setTimeout(() => {
      if (screenSize < 640) {
        createMasonry(posts, 1);
      } else if (screenSize >= 640 && screenSize < 768) {
        createMasonry(posts, 2);
      } else {
        createMasonry(posts, 3);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [posts, screenSize]);

  // useEffect(() => {
  //   let previousScreenSize = window.innerWidth;

  //   if (previousScreenSize < 640) {
  //     createMasonry(posts, 1);
  //   } else if (previousScreenSize >= 640 && previousScreenSize < 768) {
  //     createMasonry(posts, 2);
  //   } else {
  //     createMasonry(posts, 3);
  //   }

  //     window.addEventListener("resize", () => {
  //         if (window.innerWidth < 640 && previousScreenSize >= 640) {
  //           createMasonry(posts, 1);
  //         } else if (
  //           window.innerWidth >= 640 &&
  //           window.innerWidth < 768 &&
  //           (previousScreenSize < 640 || previousScreenSize >= 768)
  //         ) {
  //           createMasonry(posts, 2);
  //         } else if (window.innerWidth >= 768 && previousScreenSize < 768) {
  //           createMasonry(posts, 3);
  //         }

  //         previousScreenSize = window.innerWidth;

  //         // setAddedEventListener(true);
  //     });
  // }, [posts]);

  return (
    <>
      {masonry && (
        // <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex w-full gap-2">
          {Object.values(masonry.columns).map((column, columnIndex) => (
            <div key={columnIndex} className="flex w-full flex-col gap-2">
              {column.map((post, postIndex) => (
                <Link
                  to={`/posts/${post.id}`}
                  state={{ post }}
                  className="group relative top-0 w-full rounded-lg border border-transparent hover:border-white focus:border focus:border-white focus:outline-none focus:ring-0"
                  ref={post.id === masonry.lastPostId ? elementRef : null}
                  key={postIndex}
                  target="_blank"
                >
                  {post.type === "IMAGE" && (
                    <ImageView
                      fileNames={JSON.parse(post.files)}
                      isMasonryView={true}
                      autoPlayCarousel={true}
                    />
                  )}
                  {post.type !== "IMAGE" && (
                    <VideoView
                      fileNames={JSON.parse(post.files)}
                      isMasonryView={true}
                      videoType={post.type}
                    />
                  )}
                  <div className="z-3 absolute bottom-0 flex w-full flex-col justify-end gap-4 rounded-b-lg bg-black/75 p-4 opacity-0 backdrop-blur group-hover:opacity-100">
                    <h1 className="text-white">{post.title}</h1>
                    {!post.is_archived && (
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
