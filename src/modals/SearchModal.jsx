import { useContext } from 'react';
import { Link, useLocation } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import { getUsersBySearchTerm } from '../common/database/users';
import { getVideosBySearchTerm } from '../common/database/videos';
import { getClipsBySearchTerm } from '../common/database/clips';
import { getDiscussionsBySearchTerm } from '../common/database/discussions';

function SearchModal() {
  const { showModal } = useContext(ModalContext);

  const location = useLocation();

  if (showModal.type === 'SEARCH_MODAL') {
    return (
      <Modal>
        <nav className="flex w-full bg-black text-white">
          <Link className="px-4 py-2 text-xs" to="#users">
            Users
          </Link>
          <Link className="px-4 py-2 text-xs" to="#videos">
            Videos
          </Link>
          <Link className="px-4 py-2 text-xs" to="#clips">
            Clips
          </Link>
          <Link className="px-4 py-2 text-xs" to="#discussions">
            Discussions
          </Link>
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
