import { Link } from 'react-router';
import PostImage from './PostImage';

function PostImagePreview({ postImage }) {
  return (
    <Link
      to={`/post/${postImage.id}`}
      state={{ post: postImage }}
      className="block w-full max-w-[256px] rounded-lg border-2 border-transparent hover:border-white focus:border-2 focus:border-white focus:ring-0 focus:outline-hidden"
      ref={null}
    >
      <PostImage images={postImage.images} isPreview={true} />
    </Link>
  );
}

export default PostImagePreview;
