import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';

function UserCard({ user, elementRef }) {
  const { setModal } = useContext(ModalContext);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  return (
    <Link
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => setModal({ type: null, data: null })}
      to={`/users/${user.username}`}
      state={{ user }}
      className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-neutral-100 p-2 transition-all hover:border-sky-500 focus:z-50 focus:border-black focus:ring-0 focus:outline-0"
      ref={elementRef}
    >
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
        <div className="aspect-square max-h-[128px] w-full max-w-[128px] rounded-full bg-neutral-100"></div>
      )}
      {user.avatar_file_name && (
        <div
          className={`aspect-square max-h-[128px] w-full max-w-[128px] animate-pulse rounded-full bg-neutral-100 ${isLoadingImage ? 'block' : 'hidden'}`}
        ></div>
      )}
      <h1>{user.username}</h1>
    </Link>
  );
}

export default UserCard;
