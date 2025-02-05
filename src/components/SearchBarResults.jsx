import { Link } from 'react-router';
import parse from 'html-react-parser';
import { useContext } from 'react';
import { ModalContext } from '../common/contexts';

function SearchBarResults({
  searchTerm,
  posts,
  profiles,
  questions,
  clearSearchResults,
}) {
  const { setShowModal } = useContext(ModalContext);

  function getHighlightText(text) {
    const lowercaseText = text.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const highlightText = lowercaseText.replaceAll(
      lowerCaseSearchTerm,
      `<span className="bg-sky-500 text-white rounded-lg p-1">${lowerCaseSearchTerm}</span>`
    );

    return highlightText;
  }

  return (
    <div className="flex flex-col rounded-lg">
      {posts.length > 0 && (
        <div className="flex flex-col gap-2">
          <h1 className="p-2 font-bold">Posts</h1>
          <div className="flex flex-col gap-2">
            {posts.map((post, index) => (
              <Link
                onClick={() => {
                  clearSearchResults();
                }}
                key={index}
                to={`/post/${post.id}`}
                state={{ post }}
                className="flex flex-col gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0"
              >
                <p>{parse(getHighlightText(post.title))}</p>
                {post.description && (
                  <p>{parse(getHighlightText(post.description))}</p>
                )}
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
                onClick={() => {
                  clearSearchResults();
                }}
                key={index}
                to={`/question/${question.id}`}
                state={{ question }}
                className="flex flex-col gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0"
              >
                <p>{parse(getHighlightText(question.title))}</p>
                {question.description && (
                  <p>{parse(getHighlightText(question.description))}</p>
                )}
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
                onClick={() => {
                  clearSearchResults();
                }}
                key={index}
                to={`/profile/${profile.username}`}
                state={{ profile }}
                className="flex flex-col gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0"
              >
                <p>{parse(getHighlightText(profile.username))}</p>
                <p>
                  {profile.display_name &&
                    parse(getHighlightText(profile.display_name))}
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
