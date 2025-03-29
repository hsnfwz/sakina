import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';

function UserCard({ user, elementRef }) {
  const { setShowModal } = useContext(ModalContext);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  return (
    <Link
      onClick={() => setShowModal({ type: null, data: null })}
      to={`/users/${user.username}`}
      state={{ user }}
      className="block w-[128px] snap-start rounded-lg"
      ref={elementRef}
    >
      <div className="flex w-full flex-col gap-2 rounded-lg">
        {user.avatar_file_name && (
          <img
            src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${user.avatar_file_name}`}
            alt={user.avatar_file_name}
            width={128}
            height={128}
            className={`aspect-square rounded-full object-center ${isLoadingImage ? 'hidden' : 'block'}`}
            onLoad={() => setIsLoadingImage(false)}
          />
        )}
        {!user.avatar_file_name && (
          <div className="aspect-square max-h-[128px] w-full max-w-[128px] rounded-full bg-neutral-200"></div>
        )}
        {user.avatar_file_name && (
          <div
            className={`aspect-square animate-pulse w-[128px] rounded-full bg-neutral-200 ${isLoadingImage ? 'block' : 'hidden'}`}
          ></div>
        )}
        <h1>{user.username}</h1>
      </div>
    </Link>
  );
}

export default UserCard;
