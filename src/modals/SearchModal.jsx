import { useContext, useEffect, useState, useRef } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import { getUsersBySearchTerm } from '../common/database/users';
import { getVideosBySearchTerm } from '../common/database/videos';
import { getDiscussionsBySearchTerm } from '../common/database/discussions';
import { BUTTON_COLOR } from '../common/enums.js';
import Modal from '../components/Modal';
import TextInput from '../components/TextInput.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import Button from '../components/Button.jsx';
import UserCard from '../components/UserCard.jsx';
import VideoCard from '../components/VideoCard.jsx';
import DiscussionCard from '../components/DiscussionCard.jsx';

function SearchModal() {
  const { modal, setModal } = useContext(ModalContext);
  const timerRef = useRef();

  const [show, setShow] = useState(false);
  const [view, setView] = useState('USERS');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true);

  async function handleInput(event, search, orientation) {
    setIsLoadingSearchResults(true);

    setSearchTerm(event.target.value);

    clearTimeout(timerRef.current);

    if (event.target.value.length === 0) {
      setSearchResults([]);
      setIsLoadingSearchResults(false);
    } else {
      timerRef.current = setTimeout(async () => {
        let response;
        if (orientation) {
          response = await search(searchTerm, orientation);
        } else {
          response = await search(searchTerm);
        }
        const { data, hasMore } = response;

        setSearchResults(data);
        setHasMoreSearchResults(hasMore);

        setIsLoadingSearchResults(false);
      }, 1000);
    }
  }

  useEffect(() => {
    if (modal.type === 'SEARCH_MODAL') {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [modal]);

  function handleClose() {
    setView('USERS');
  }

  return (
    <Modal show={show} handleClose={handleClose}>
      <div className="flex w-full gap-2">
        <button
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setView('USERS');
          }}
          type="button"
          className={`${view === 'USERS' ? 'bg-sky-500 text-white' : 'bg-white text-black'} text-whote cursor-pointer rounded-full border-2 border-sky-500 px-2 py-1 transition-all hover:bg-sky-700 hover:text-white focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
        >
          Users
        </button>
        <button
          onMouseDown={(event) => event.preventDefault()}
          type="button"
          className={`${view === 'VIDEOS' ? 'bg-sky-500 text-white' : 'bg-white text-black'} text-whote cursor-pointer rounded-full border-2 border-sky-500 px-2 py-1 transition-all hover:bg-sky-700 hover:text-white focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          onClick={() => {
            setView('VIDEOS');
          }}
        >
          Videos
        </button>
        <button
          type="button"
          className={`${view === 'CLIPS' ? 'bg-sky-500 text-white' : 'bg-white text-black'} text-whote cursor-pointer rounded-full border-2 border-sky-500 px-2 py-1 transition-all hover:bg-sky-700 hover:text-white focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setView('CLIPS');
          }}
        >
          Clips
        </button>
        <button
          type="button"
          className={`${view === 'DISCUSSIONS' ? 'bg-sky-500 text-white' : 'bg-white text-black'} text-whote cursor-pointer rounded-full border-2 border-sky-500 px-2 py-1 transition-all hover:bg-sky-700 hover:text-white focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setView('DISCUSSIONS');
          }}
        >
          Discussions
        </button>
      </div>

      {view === 'USERS' && (
        <TextInput
          placeholder="Search users by name or username"
          handleInput={(event) => handleInput(event, getUsersBySearchTerm)}
          value={searchTerm}
          label="Search users by name or username"
        />
      )}
      {view === 'VIDEOS' && (
        <TextInput
          placeholder="Search videos by title or description"
          handleInput={(event) =>
            handleInput(event, getVideosBySearchTerm, 'HORIZONTAL')
          }
          value={searchTerm}
          label="Search videos by title or description"
        />
      )}
      {view === 'CLIPS' && (
        <TextInput
          placeholder="Search clips by title or description"
          handleInput={(event) =>
            handleInput(event, getVideosBySearchTerm, 'VERTICAL')
          }
          value={searchTerm}
          label="Search clips by title or description"
        />
      )}
      {view === 'DISCUSSIONS' && (
        <TextInput
          placeholder="Search discussions by title or description"
          handleInput={(event) =>
            handleInput(event, getDiscussionsBySearchTerm)
          }
          value={searchTerm}
          label="Search discussions by title or description"
        />
      )}

      {searchResults.length > 0 && (
        <>
          {view === 'USERS' && (
            <>
              {searchResults.map((user, index) => (
                <UserCard key={index} user={user} />
              ))}
            </>
          )}
          {view === 'VIDEOS' && (
            <>
              {searchResults.map((video, index) => (
                <VideoCard key={index} video={video} orientation="HORIZONTAL" />
              ))}
            </>
          )}
          {view === 'CLIPS' && (
            <>
              {searchResults.map((clip, index) => (
                <VideoCard key={index} video={clip} orientation="VERTICAL" />
              ))}
            </>
          )}
          {view === 'DISCUSSIONS' && (
            <>
              {searchResults.map((discussion, index) => (
                <DiscussionCard key={index} discussion={discussion} />
              ))}
            </>
          )}

          {hasMoreSearchResults && (
            <Button
              color={BUTTON_COLOR.SOLID_BLUE}
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
            >
              Show More
            </Button>
          )}
          {!hasMoreSearchResults && <Loaded />}
        </>
      )}
      {isLoadingSearchResults && <Loading />}
      <div className="flex gap-2 self-end">
        <Button
          color={BUTTON_COLOR.OUTLINE_BLACK}
          handleClick={() => {
            handleClose();
            setModal({ type: null, data: null });
          }}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default SearchModal;
