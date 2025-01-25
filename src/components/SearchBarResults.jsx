import { Link } from "react-router";

function SearchBarResults({ searchTerm, posts, profiles }) {
  // const [highlightTitle, setHighlightTitle] = useState(null);
  // const [highlightDescription, setHighlightDescription] = useState(null);

  // const [highlightUsername, setHighlightUsername] = useState(null);
  // const [highlightDisplayName, setHighlightDisplayName] = useState(null);

  // function getHighlightTitleDescription(post) {
  //   const postTitle = post.title;
  //   const regExp = new RegExp(searchInput, "ig");
  //   const title = postTitle.replace(
  //     regExp,
  //     `<span className="bg-sky-500 text-white rounded-lg p-1">${searchInput}</span>`,
  //   );
  //   setHighlightTitle(title);

  //   if (post.description) {
  //     const postDescription = post.description;
  //     const regExp = new RegExp(searchInput, "ig");
  //     const description = postDescription.replace(
  //       regExp,
  //       `<span className="bg-sky-500 text-white rounded-lg p-1">${searchInput}</span>`,
  //     );
  //     setHighlightDescription(description);
  //   }
  // }

  // function getHighlightDisplayNameUsername(user) {
  //   const lowerCaseSearchInput = searchInput.toLowerCase();

  //   const lowercaseUsername = user.username.toLowerCase();
  //   const username = lowercaseUsername.replaceAll(
  //     lowerCaseSearchInput,
  //     `<span className="bg-sky-500 text-white rounded-lg p-1">${lowerCaseSearchInput}</span>`,
  //   );
  //   setHighlightUsername(username);

  //   if (user.display_name) {
  //     const lowercaseDisplayName = user.display_name.toLowerCase();
  //     const displayName = lowercaseDisplayName.replaceAll(
  //       lowerCaseSearchInput,
  //       `<span className="bg-sky-500 text-white rounded-lg p-1">${lowerCaseSearchInput}</span>`,
  //     );
  //     setHighlightDisplayName(displayName);
  //   }
  // }

  return (
    <div className="flex flex-col rounded-lg">
      {posts.length > 0 && (
        <div className="flex flex-col gap-2">
          <h1 className="p-2 font-bold">Posts</h1>
          <div className="flex flex-col">
            {posts.map((post, index) => (
              <Link
                key={index}
                to={`/posts/${post.id}`}
                state={{ post }}
                className="flex flex-col gap-4 border border-neutral-700 p-2 first:rounded-t-lg last:rounded-b-lg hover:border-white"
                target="_blank"
              >
                {/* {highlightTitle && <span>{parse(highlightTitle)}{highlightDescription && <span> - {parse(highlightDescription)}</span>}</span>} */}
                {
                  <span>
                    {post.title}
                    {post.description && <span> - {post.description}</span>}
                  </span>
                }
              </Link>
            ))}
          </div>
        </div>
      )}
      {profiles.length > 0 && (
        <div className="flex flex-col gap-2">
          <h1 className="p-2 font-bold">Users</h1>
          <div className="flex flex-col">
            {profiles.map((profile, index) => (
              <Link
                key={index}
                to={`/users/${profile.username}#posts`}
                state={{ profile }}
                className="flex flex-col gap-4 border border-neutral-700 p-2 first:rounded-t-lg last:rounded-b-lg hover:border-white"
                target="_blank"
              >
                {/* {highlightUsername && <span>{parse(highlightUsername)}{highlightDisplayName && <span> - {parse(highlightDisplayName)}</span>}</span>} */}
                {
                  <span>
                    {profile.username}
                    {profile.display_name && (
                      <span> - {profile.display_name}</span>
                    )}
                  </span>
                }
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBarResults;
