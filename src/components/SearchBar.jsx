import { useContext, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router';
import { BUTTON_COLOR } from '../common/enums.js';
import TextInput from './TextInput.jsx';
import Loading from './Loading.jsx';
import Loaded from './Loaded.jsx';
import Button from './Button.jsx';
import UserCard from './UserCard.jsx';
import VideoCard from './VideoCard.jsx';
import ClipCard from './ClipCard.jsx';
import DiscussionCard from './DiscussionCard.jsx';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';

function SearchBar({ placeholder, handleSearch }) {
  const location = useLocation();
  const { setShowModal } = useContext(ModalContext);
  const timerRef = useRef();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true);

  async function handleInput(event) {
    setIsLoadingSearchResults(true);

    setSearchTerm(event.target.value);

    clearTimeout(timerRef.current);

    if (event.target.value.length === 0) {
      setSearchResults([]);
      setIsLoadingSearchResults(false);
    } else {
      timerRef.current = setTimeout(async () => {
        const { data, hasMore } = await handleSearch(searchTerm);

        setSearchResults(data);
        setHasMoreSearchResults(hasMore);

        setIsLoadingSearchResults(false);
      }, 1000);
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <TextInput
        placeholder={placeholder}
        handleInput={handleInput}
        value={searchTerm}
      />

      {isLoadingSearchResults && <Loading />}

      {searchResults.length > 0 && (
        <>
          {(location.hash === '' || location.hash === '#users') && (
            <>
              {searchResults.map((user, index) => (
                <UserCard key={index} user={user} />
              ))}
            </>
          )}
          {location.hash === '#videos' && (
            <>
              {searchResults.map((video, index) => (
                <VideoCard key={index} video={video} />
              ))}
            </>
          )}
          {location.hash === '#clips' && (
            <>
              {searchResults.map((clip, index) => (
                <ClipCard key={index} clip={clip} />
              ))}
            </>
          )}
          {location.hash === '#discussions' && (
            <>
              {searchResults.map((discussion, index) => (
                <DiscussionCard key={index} discussion={discussion} />
              ))}
            </>
          )}

          {hasMoreSearchResults && (
            <Button
              handleClick={async () => {
                setIsLoadingSearchResults(true);
                const { data, hasMore } = await search(
                  searchTerm,
                  searchResults.length
                );
                if (data.length > 0) {
                  setSearchResults([...searchResults, ...data]);
                }
                setHasMoreSearchResults(hasMore);
                setIsLoadingSearchResults(false);
              }}
              isDisabled={isLoadingSearchResults}
              color={BUTTON_COLOR.BLUE}
            >
              Load More
            </Button>
          )}
          {!hasMoreSearchResults && <Loaded />}
        </>
      )}
    </div>
  );
}

export default SearchBar;
