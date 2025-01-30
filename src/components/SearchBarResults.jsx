import { Link } from "react-router";

function SearchBarResults({
  searchTerm,
  posts,
  profiles,
  questions,
  clearSearchResults,
}) {
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
          <div className="flex flex-col gap-2">
            {posts.map((post, index) => (
              <Link
                onClick={clearSearchResults}
                key={index}
                to={`/posts/${post.id}`}
                state={{ post }}
                className="flex flex-col gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0"
              >
                <p>{post.title}</p>
                {post.description && <p>{post.description}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
      {questions.length > 0 && (
        <div className="flex flex-col gap-2">
          <h1 className="p-2 font-bold">Questions</h1>
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => (
              <Link
                onClick={clearSearchResults}
                key={index}
                to={`/questions/${question.id}`}
                state={{ question }}
                className="flex flex-col gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0"
              >
                <p>{question.title}</p>
                {question.description && <p>{question.description}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
      {profiles.length > 0 && (
        <div className="flex flex-col gap-2">
          <h1 className="p-2 font-bold">Users</h1>
          <div className="flex flex-col gap-2">
            {profiles.map((profile, index) => (
              <Link
                onClick={clearSearchResults}
                key={index}
                to={`/profile/${profile.username}#posts`}
                state={{ profile }}
                className="flex flex-col gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0"
              >
                <p>
                  {profile.username}
                  {profile.display_name ? ` - ${profile.display_name}` : ""}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBarResults;
