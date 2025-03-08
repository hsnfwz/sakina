import { Link } from 'react-router';
import PostImage from './PostImage';
import PostVideo from './PostVideo';
import PostDiscussion from './PostDiscussion';

function Post({ post, isPreview }) {
  return (
    <Link
      to={`/post/${post.id}`}
      state={{ post }}
      className="block w-full max-w-[400px] rounded-lg border-2 border-transparent hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0"
      ref={null}
    >
      {post.type === 'IMAGE' && (
        <PostImage images={post.images} isPreview={isPreview} />
      )}
      {post.type === 'VIDEO' && (
        <PostVideo
          images={post.images}
          videos={post.videos}
          isPreview={isPreview}
        />
      )}
      {post.type === 'DISCUSSION' && (
        <PostDiscussion post={post} isPreview={isPreview} />
      )}
    </Link>
  );
}

export default Post;
