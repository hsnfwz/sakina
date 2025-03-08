import { Link } from 'react-router';
import { getDate } from '../common/helpers';

function PostDiscussion({ post }) {
  return (
    <div className="flex flex-col gap-2 p-2">
      <p className="text-neutral-700">{getDate(post.created_at, true)}</p>
      {!post.is_anonymous && <p>{post.user.username}</p>}
      {post.is_anonymous && <p>Anonymous</p>}
      <h1 className="font-bold">{post.title}</h1>
      {post.description && <p>{post.description}</p>}
    </div>
  );
}

export default PostDiscussion;
