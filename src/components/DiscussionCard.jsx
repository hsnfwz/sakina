import { useContext } from 'react';
import { Link } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';

function DiscussionCard({ discussion, elementRef }) {
  const { setModal } = useContext(ModalContext);

  return (
    <Link
      onClick={() => setModal({ type: null, data: null })}
      to={`/discussions/${discussion.id}`}
      state={{ discussion }}
      className="block w-full rounded-lg border-2 border-neutral-200 bg-white"
      ref={elementRef}
    >
      <div className="flex w-full flex-col gap-2 rounded-lg p-2">
        <h1>{discussion.title}</h1>
        {discussion.description && (
          <p className="overflow-hidden text-ellipsis">
            {discussion.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default DiscussionCard;
