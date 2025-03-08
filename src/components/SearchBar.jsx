import { useRef, useState } from 'react';
import TextInput from './TextInput.jsx';
import Loading from './Loading.jsx';
import Loaded from './Loaded.jsx';
import ProfilePreview from './ProfilePreview.jsx';
import PostDiscussionPreview from './PostDiscussionPreview.jsx';
import PostVideoPreview from './PostVideoPreview.jsx';
import PostImagePreview from './PostImagePreview.jsx';
import Button from './Button.jsx';
import { BUTTON_COLOR } from '../common/enums.js';

function SearchBar({ searchType, search }) {
  const timerRef = useRef();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true);

  async function _search(event) {
    setIsLoadingSearchResults(true);

    setSearchTerm(event.target.value);

    clearTimeout(timerRef.current);

    if (event.target.value.length === 0) {
      setSearchResults([]);
      setIsLoadingSearchResults(false);
    } else {
      timerRef.current = setTimeout(async () => {
        const { data, hasMore } = await search(searchTerm);
        setSearchResults(data);
        setHasMoreSearchResults(hasMore);
        setIsLoadingSearchResults(false);
      }, 1000);
    }
  }

  return (
    <div className="flex w-full flex-col gap-4 bg-black">
      <TextInput
        placeholder={searchType.placeholder}
        handleInput={_search}
        value={searchTerm}
      />

      {isLoadingSearchResults && <Loading />}

      {searchResults.length > 0 && (
        <>
          {searchType.type === 'PROFILES' && (
            <>
              {searchResults.map((searchResult, index) => (
                <ProfilePreview key={index} profile={searchResult} />
              ))}
            </>
          )}
          {searchType.type === 'POST_IMAGES' && (
            <>
              {searchResults.map((searchResult, index) => (
                <PostImagePreview key={index} postImage={searchResult} />
              ))}
            </>
          )}
          {searchType.type === 'POST_VIDEOS' && (
            <>
              {searchResults.map((searchResult, index) => (
                <PostVideoPreview key={index} postVideo={searchResult} />
              ))}
            </>
          )}
          {searchType.type === 'POST_DISCUSSIONS' && (
            <>
              {searchResults.map((searchResult, index) => (
                <PostDiscussionPreview
                  key={index}
                  postDiscussion={searchResult}
                />
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
              buttonColor={BUTTON_COLOR.BLUE}
            >
              Load More
            </Button>
          )}
          {!hasMoreSearchResults && <Loaded />}
        </>
      )}

      {searchResults.length > 0 && (
        <div className="h-[2px] w-full rounded-full bg-neutral-700"></div>
      )}
    </div>
  );
}

export default SearchBar;
