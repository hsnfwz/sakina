function UserCard({ user }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg">
      {user.avatar_file_name && (
        <img
          src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${user.avatar_file_name}`}
          alt={user.avatar_file_name}
          width={128}
          height={128}
          className="block aspect-square w-full rounded-full object-center"
        />
      )}
      {!user.avatar_file_name && (
        <div className="aspect-square max-h-[128px] w-full max-w-[128px] rounded-full bg-neutral-200"></div>
      )}
      <h1>{user.username}</h1>
    </div>
  );
}

export default UserCard;
