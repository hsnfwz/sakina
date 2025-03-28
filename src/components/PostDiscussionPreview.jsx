import { Link } from 'react-router';
import { getDate } from '../common/helpers';

function PostDiscussionPreview({ postDiscussion }) {
  return (
    <Link
      to={`/post/${postDiscussion.id}`}
      state={{ post: postDiscussion }}
      className="flex w-full flex-col gap-4 rounded-lg border-2 border-transparent p-2 hover:border-white focus:border-2 focus:border-white focus:outline-hidden focus:ring-0"
      ref={null}
    >
      <p className="text-neutral-700">
        {getDate(postDiscussion.created_at, true)}
      </p>
      {!postDiscussion.is_anonymous && <p>{postDiscussion.user.username}</p>}
      {postDiscussion.is_anonymous && <p>Anonymous</p>}
      <h1 className="font-bold">{postDiscussion.title}</h1>
      {postDiscussion.description && <p>{postDiscussion.description}</p>}
    </Link>
  );
}

export default PostDiscussionPreview;
