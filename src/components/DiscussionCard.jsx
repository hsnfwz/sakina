function DiscussionCard({ discussion }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg p-2">
      <h1>{discussion.title}</h1>
      {discussion.description && (
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {discussion.description}
        </p>
      )}
    </div>
  );
}

export default DiscussionCard;
