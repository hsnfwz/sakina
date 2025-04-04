import { useContext, useState } from 'react';
import { useLocation } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider';
import { BUTTON_COLOR } from '../common/enums';
import SVGOutlineHome from './svgs/outline/SVGOutlineHome';
import SVGOutlineCompass from './svgs/outline/SVGOutlineCompass';
import SVGOutlineBell from './svgs/outline/SVGOutlineBell';
import SVGOutlineUser from './svgs/outline/SVGOutlineUser';
import SVGOutlineSettings from './svgs/outline/SVGOutlineSettings';
import SVGOutlinePlus from './svgs/outline/SVGOutlinePlus';
import SVGOutlineSearch from './svgs/outline/SVGOutlineSearch.jsx';
import Button from './Button';
import Anchor from './Anchor.jsx';

function NavBar() {
  const location = useLocation();
  const { authUser } = useContext(AuthContext);
  const { setModal } = useContext(ModalContext);

  const [isLoadingImage, setIsLoadingImage] = useState(true);

  return (
    <nav className="w-full rounded-lg flex gap-2 justify-center items-center">
      <Button
              isRound={true}

        handleClick={() => setModal({ type: 'SEARCH_MODAL' })}
        color={BUTTON_COLOR.SOLID_GREEN}
      >
        <SVGOutlineSearch />
      </Button>
      <div className="flex w-full">
        {authUser && (
          <Anchor active={location.pathname.includes('/home')} to="/home">
            <SVGOutlineHome />
          </Anchor>
        )}
        <Anchor active={location.pathname.includes('/explore')} to="/explore">
          <SVGOutlineCompass />
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
              {!authUser.avatar_file_name && <SVGOutlineUser />}
            </Anchor>

            <Anchor
              active={location.pathname.includes('/notifications')}
              to="/notifications"
            >
              <SVGOutlineBell />
            </Anchor>
            <Anchor
              active={location.pathname.includes('/settings')}
              to="/settings"
            >
              <SVGOutlineSettings />
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
          <SVGOutlinePlus />
        </Button>
      )}
    </nav>
  );
}

export default NavBar;
