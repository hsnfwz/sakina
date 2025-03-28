import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { searchAcceptedDiscussionPosts } from '../common/database/posts.js';
import TextInput from './TextInput.jsx';
import Loading from './Loading.jsx';
import Loaded from './Loaded.jsx';

function PostDiscussionsSearchBar() {
  const timerRef = useRef();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);

  async function search(event) {
    setIsLoadingSearchResults(true);

    setSearchTerm(event.target.value);

    clearTimeout(timerRef.current);

    if (event.target.value.length === 0) {
      setSearchResults([]);
      setIsLoadingSearchResults(false);
    } else {
      timerRef.current = setTimeout(async () => {
        const { data, hasMore } =
          await searchAcceptedDiscussionPosts(searchTerm);
        setSearchResults(data);
        setIsLoadingSearchResults(false);
      }, 1000);
    }
  }

  return (
    <div className="flex w-full flex-col gap-4 bg-black">
      <div className="flex w-full items-center gap-2">
        <TextInput
          placeholder="Search Profiles"
          handleInput={search}
          value={searchTerm}
        />
      </div>
      {searchResults.map((profile, index) => (
        <Link
          key={index}
          to={`/profile/${profile.username}`}
          state={{ profile }}
          className="flex items-center gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:border-white focus:border-2 focus:border-white focus:outline-hidden focus:ring-0"
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
            {profile.name && <p className="text-neutral-700">{profile.name}</p>}
          </div>
        </Link>
      ))}
      {!isLoadingSearchResults && searchTerm && searchResults.length === 0 && (
        <Loaded />
      )}
      {isLoadingSearchResults && <Loading />}
    </div>
  );
}

export default PostDiscussionsSearchBar;
