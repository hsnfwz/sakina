import { useContext } from 'react';
import { Link } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';

function DiscussionCard({ discussion, elementRef, showDescription }) {
  const { setModal } = useContext(ModalContext);

  return (
    <Link
      onClick={() => setModal({ type: null, data: null })}
      to={`/discussions/${discussion.id}`}
      state={{ discussion }}
      className="flex w-full flex-col gap-2 rounded-lg border-2 border-neutral-100 bg-white p-2 transition-all hover:border-sky-500 focus:z-50 focus:border-black focus:ring-0 focus:outline-0"
      ref={elementRef}
    >
      <h1>{discussion.title}</h1>
      {showDescription && discussion.description && (
        <p>{discussion.description}</p>
      )}
    </Link>
  );
}

export default DiscussionCard;
