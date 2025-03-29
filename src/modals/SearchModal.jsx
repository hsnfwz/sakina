import { useContext } from 'react';
import { useLocation } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';
import { getUsersBySearchTerm } from '../common/database/users';
import { getVideosBySearchTerm } from '../common/database/videos';
import { getClipsBySearchTerm } from '../common/database/clips';
import { getDiscussionsBySearchTerm } from '../common/database/discussions';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import Anchor from '../components/Anchor';

function SearchModal() {
  const { showModal } = useContext(ModalContext);

  const location = useLocation();

  if (showModal.type === 'SEARCH_MODAL') {
    return (
      <Modal>
        <nav className="flex w-full">
          <Anchor
            active={location.hash === '' || location.hash === '#videos'}
            to="#videos"
          >
            Videos
          </Anchor>
          <Anchor active={location.hash === '#clips'} to="#clips">
            Clips
          </Anchor>
          <Anchor active={location.hash === '#discussions'} to="#discussions">
            Discussions
          </Anchor>
          <Anchor active={location.hash === '#users'} to="#users">
            Users
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
}

export default SearchModal;
