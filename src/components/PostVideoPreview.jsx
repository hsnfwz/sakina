import { Link } from 'react-router';
import PostVideo from './PostVideo';

function PostVideoPreview({ postVideo }) {
  return (
    <Link
      to={`/post/${postVideo.id}`}
      state={{ post: postVideo }}
      className="block w-full max-w-[256px] rounded-lg border-2 border-transparent hover:border-white focus:border-2 focus:border-white focus:outline-hidden focus:ring-0"
      ref={null}
    >
      <PostVideo
        images={postVideo.images}
        videos={postVideo.videos}
        isPreview={true}
      />
    </Link>
  );
}

export default PostVideoPreview;
