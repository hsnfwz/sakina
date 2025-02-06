import { useRef, useState } from 'react';
import { searchProfiles } from '../common/supabase.js';
import { searchAcceptedPosts } from '../common/database/posts.js';
import IconButton from './IconButton.jsx';
import SearchBarResults from './SearchBarResults.jsx';
import TextInput from './TextInput.jsx';
import SVGOutlineX from './svgs/outline/SVGOutlineX.jsx';

function SearchBar() {
  const timerRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');

  const [acceptedPosts, setAcceptedPosts] = useState([]);
  const [isLoadingAcceptedPosts, setIsLoadingAcceptedPosts] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  async function findPosts(searchTerm) {
    setIsLoadingAcceptedPosts(true);

    const data = await searchAcceptedPosts(searchTerm);

    if (data) {
      setAcceptedPosts(data);
    }
    setIsLoadingAcceptedPosts(false);
  }

  async function findProfiles(searchTerm) {
    setLoadingProfiles(true);

    const data = await searchProfiles(searchTerm);

    if (data) {
      setProfiles(data);
    }
    setLoadingProfiles(false);
  }

  async function search(event) {
    setSearchTerm(event.target.value);

    clearTimeout(timerRef.current);
    if (event.target.value && event.target.value.length > 0) {
      timerRef.current = setTimeout(async () => {
        await Promise.all([
          findPosts(event.target.value),
          findProfiles(event.target.value),
        ]);
      }, 1000);
    } else {
      clearSearchResults();
    }
  }

  function clearSearch() {
    setSearchTerm('');
    clearSearchResults();
  }

  function clearSearchResults() {
    setAcceptedPosts([]);
    setProfiles([]);
  }

  return (
    <div className="flex w-full flex-col gap-4 bg-black">
      <div className="flex w-full items-center gap-2">
        <TextInput
          placeholder="Search"
          handleInput={search}
          value={searchTerm}
        />
        {/* <IconButton handleClick={clearSearch}>
          <SVGOutlineX />
        </IconButton> */}
      </div>
      {(acceptedPosts.length > 0 || profiles.length > 0) && (
        <SearchBarResults
          searchTerm={searchTerm}
          posts={acceptedPosts}
          profiles={profiles}
          clearSearchResults={clearSearchResults}
        />
      )}
    </div>
  );
}

export default SearchBar;
