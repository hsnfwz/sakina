import { Link } from 'react-router';

function ProfilePreview({ profile }) {
  return (
    <Link
      to={`/profile/${profile.username}`}
      state={{ profile }}
      className="flex w-full items-center gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0"
      onClick={() => setSearchResults([])}
    >
      {profile.avatar && (
        <img
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${profile.avatar.name}`}
          alt={profile.avatar.name}
          width={profile.avatar.width}
          height={profile.avatar.height}
          className="aspect-square w-full max-w-[64px] rounded-full bg-black object-cover"
        />
      )}
      {!profile.avatar && (
        <div className="aspect-square w-full max-w-[64px] rounded-full bg-neutral-700"></div>
      )}
      <div className="flex flex-col">
        <p>{profile.username}</p>
        {profile.display_name && (
          <p className="text-neutral-700">{profile.display_name}</p>
        )}
      </div>
    </Link>
  );
}

export default ProfilePreview;
