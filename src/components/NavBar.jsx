import { useContext, useState, useRef } from 'react';
import {
  Search,
  Home,
  Compass,
  Bell,
  Settings,
  Plus,
  CircleUserRound,
} from 'lucide-react';
import { useLocation } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider';
import { BUTTON_COLOR } from '../common/enums';
import Button from './Button';
import Anchor from './Anchor.jsx';

function NavBar() {
  const location = useLocation();
  const { authUser } = useContext(AuthContext);
  const { setModal } = useContext(ModalContext);

  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const searchButtonRef = useRef();

  return (
    <nav className="flex w-full items-center justify-center gap-2 rounded-lg">
      <Button
        elementRef={searchButtonRef}
        isRound={true}
        handleClick={() => {
          setModal({ type: 'SEARCH_MODAL' });
        }}
        color={BUTTON_COLOR.SOLID_GREEN}
      >
        <Search />
      </Button>
      <div className="flex w-full">
        {authUser && (
          <Anchor active={location.pathname.includes('/home')} to="/home">
            <Home />
          </Anchor>
        )}
        <Anchor active={location.pathname.includes('/explore')} to="/explore">
          <Compass />
        </Anchor>
        {authUser && (
          <>
            <Anchor
              active={location.pathname === `/users/${authUser.username}`}
              state={{ user: authUser }}
              to={`/users/${authUser.username}`}
            >
              {authUser.avatar_file_name && (
                <img
                  src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${authUser.avatar_file_name}`}
                  alt={authUser.username}
                  width={24}
                  height={24}
                  className={`rounded-full ${isLoadingImage ? 'hidden' : 'block'}`}
                  onLoad={() => setIsLoadingImage(false)}
                />
              )}
              {authUser.avatar_file_name && (
                <div
                  className={`aspect-square w-[24px] animate-pulse rounded-full bg-neutral-100 ${isLoadingImage ? 'block' : 'hidden'}`}
                ></div>
              )}
              {!authUser.avatar_file_name && <CircleUserRound />}
            </Anchor>

            <Anchor
              active={location.pathname.includes('/notifications')}
              to="/notifications"
            >
              <Bell />
            </Anchor>
            <Anchor
              active={location.pathname.includes('/settings')}
              to="/settings"
            >
              <Settings />
            </Anchor>
          </>
        )}
        {!authUser && (
          <>
            <Anchor
              active={location.pathname.includes('/sign-in')}
              to="/sign-in"
            >
              Sign In
            </Anchor>
            <Anchor
              active={location.pathname.includes('/sign-up')}
              to="/sign-up"
            >
              Sign Up
            </Anchor>
          </>
        )}
      </div>

      {authUser && (
        <Button
          isRound={true}
          handleClick={() => setModal({ type: 'CREATE_MODAL' })}
          color={BUTTON_COLOR.SOLID_GREEN}
        >
          <Plus />
        </Button>
      )}
    </nav>
  );
}

export default NavBar;
