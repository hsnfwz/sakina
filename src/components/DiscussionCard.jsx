import { useContext } from 'react';
import { Link } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';

function DiscussionCard({ discussion, elementRef }) {
  const { setShowModal } = useContext(ModalContext);

  return (
    <Link
      onClick={() => setShowModal({ type: null, data: null })}
      to={`/discussions/${discussion.id}`}
      state={{ discussion }}
      className="block w-[320px] snap-start rounded-lg border-2 border-neutral-200"
      ref={elementRef}
    >
      <div className="flex w-full flex-col gap-2 rounded-lg p-2">
        <h1>{discussion.title}</h1>
        {discussion.description && (
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
            {discussion.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default DiscussionCard;
