import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import PostImage from './PostImage.jsx';
import PostVideo from './PostVideo.jsx';

function Masonry({ elementRef, data }) {
  const screenResize = 0;
  const timerRef = useRef();
  const [masonry, setMasonry] = useState(null);

  function createMasonry(numberOfColumns) {
    const _masonry = {
      columns: {},
      lastPost: null,
    };

    let i = 0;
    while (i < numberOfColumns) {
      _masonry.columns[`column-${i}`] = [];
      i++;
    }

    let j = 0;
    while (j < data.length) {
      const post = data[j];

      if (j === data.length - 1) {
        _masonry.lastPost = post;
      }

      const col = j % numberOfColumns;
      _masonry.columns[`column-${col}`].push(post);

      j++;
    }

    setMasonry(_masonry);
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
  }, [data]);

  useEffect(() => {
    if (screenResize !== 0) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callCreateMasonry(), 1000);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [screenResize]);

  return (
    <>
      {masonry && (
        <div className="flex w-full gap-4">
          {Object.values(masonry.columns).map((column, columnIndex) => (
            <div key={columnIndex} className="flex w-full flex-col gap-4">
              {column.map((post, postIndex) => (
                <Link
                  to={`/post/${post.id}`}
                  state={{ post }}
                  className="group relative top-0 w-full rounded-lg border-2 border-transparent hover:border-white focus:border-2 focus:border-white focus:ring-0 focus:outline-hidden"
                  ref={post.id === masonry.lastPost.id ? elementRef : null}
                  key={postIndex}
                >
                  {post.type === 'IMAGE' && (
                    <PostImage
                      images={post.images}
                      isMasonryView={true}
                      autoPlayCarousel={true}
                    />
                  )}
                  {post.type === 'VIDEO' && (
                    <PostVideo
                      images={post.images}
                      videos={post.videos}
                      isMasonryView={true}
                    />
                  )}
                  <div className="absolute bottom-0 z-3 flex w-full flex-col justify-end gap-4 rounded-b-lg bg-black/50 p-4 opacity-0 backdrop-blur-sm group-hover:opacity-100">
                    <h1 className="text-black">{post.title}</h1>
                    <div className="flex items-center gap-2">
                      {post.user.avatar && (
                        <img
                          className="aspect-square w-full max-w-[40px] rounded-full object-cover"
                          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${post.user.avatar.name}`}
                          alt={post.user.avatar.name}
                          width={post.user.avatar.width}
                          height={post.user.avatar.height}
                        />
                      )}
                      <h2 className="text-xs text-black">
                        By {post.user.username}
                        {post.user.name && <span> - {post.user.name}</span>}
                      </h2>
                    </div>
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
