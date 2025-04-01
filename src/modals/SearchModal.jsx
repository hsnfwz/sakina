import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';
import { getUsersBySearchTerm } from '../common/database/users';
import { getVideosBySearchTerm } from '../common/database/videos';
import { getClipsBySearchTerm } from '../common/database/videos';
import { getDiscussionsBySearchTerm } from '../common/database/discussions';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import Anchor from '../components/Anchor';

function SearchModal() {
  const { modal } = useContext(ModalContext);
  const location = useLocation();

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (modal.type === 'SEARCH_MODAL') {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [modal]);

  return (
    <Modal show={show}>
      <nav className="flex w-full">
        <Anchor
          active={location.hash === '' || location.hash === '#users'}
          to="#users"
        >
          Users
        </Anchor>
        <Anchor active={location.hash === '#videos'} to="#videos">
          Videos
        </Anchor>
        <Anchor active={location.hash === '#clips'} to="#clips">
          Clips
        </Anchor>
        <Anchor active={location.hash === '#discussions'} to="#discussions">
          Discussions
        </Anchor>
      </nav>
      {(location.hash === '' || location.hash === '#users') && (
        <div>
          <SearchBar
            placeholder="Search users by name or username"
            handleSearch={getUsersBySearchTerm}
          />
        </div>
      )}
      {location.hash === '#videos' && (
        <div>
          <SearchBar
            placeholder="Search videos by title or description"
            handleSearch={getVideosBySearchTerm}
          />
        </div>
      )}
      {location.hash === '#clips' && (
        <div>
          <SearchBar
            placeholder="Search clips by title or description"
            handleSearch={getClipsBySearchTerm}
          />
        </div>
      )}
      {location.hash === '#discussions' && (
        <div>
          <SearchBar
            placeholder="Search discussions by title or description"
            handleSearch={getDiscussionsBySearchTerm}
          />
        </div>
      )}
    </Modal>
  );
}

export default SearchModal;
