import { useContext } from 'react';
import { Link } from 'react-router';
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

function NavBar() {
  const location = useLocation();
  const { authUser } = useContext(AuthContext);
  const { setShowModal } = useContext(ModalContext);

  return (
    <nav className="flex w-full gap-1 rounded-lg bg-neutral-200 p-1">
      <Button
        handleClick={() => setShowModal({ type: 'SEARCH_MODAL' })}
        color={BUTTON_COLOR.SOLID_GREEN}
      >
        <SVGOutlineSearch />
      </Button>
      {authUser && (
        <Link
          className={`w-full rounded-lg border-2 border-transparent bg-white hover:border-sky-500 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden ${location.pathname.includes('/home') ? 'fill-sky-500' : ''} flex items-center justify-center`}
          to="/home"
        >
          <SVGOutlineHome />
        </Link>
      )}
      <Link
        className={`w-full rounded-lg border-2 border-transparent bg-white hover:border-sky-500 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden ${location.pathname.includes('/explore') ? 'fill-sky-500' : ''} flex items-center justify-center`}
        to="/explore"
      >
        <SVGOutlineCompass />
      </Link>
      {authUser && (
        <>
          <Link
            className={`w-full rounded-lg border-2 border-transparent bg-white hover:border-sky-500 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden ${location.pathname.includes('/users') ? 'fill-sky-500' : ''} flex items-center justify-center`}
            state={{ user: authUser }}
            to={`/users/${authUser.username}`}
          >
            {authUser.avatar_file_name && (
              <img
                src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${authUser.avatar_file_name}`}
                alt={authUser.username}
                width={32}
                height={32}
                className={`rounded-full border-2 ${location.pathname.includes('/users') ? 'border-sky-500' : 'border-transparent'}`}
              />
            )}
            {!authUser.avatar_file_name && <SVGOutlineUser />}
          </Link>
          <Link
            className={`w-full rounded-lg border-2 border-transparent bg-white hover:border-sky-500 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden ${location.pathname.includes('/notifications') ? 'fill-sky-500' : ''} flex items-center justify-center`}
            to="/notifications"
          >
            <SVGOutlineBell />
          </Link>
          <Link
            className={`w-full rounded-lg border-2 border-transparent bg-white hover:border-sky-500 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden ${location.pathname.includes('/settings') ? 'fill-sky-500' : ''} flex items-center justify-center`}
            to="/settings"
          >
            <SVGOutlineSettings />
          </Link>
        </>
      )}

      {authUser && (
        <Button
          handleClick={() => setShowModal({ type: 'CREATE_MODAL' })}
          color={BUTTON_COLOR.SOLID_GREEN}
        >
          <SVGOutlinePlus />
        </Button>
      )}

      {!authUser && (
        <>
          <Link
            className={`w-full rounded-lg border-2 border-transparent bg-white hover:border-sky-500 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden ${location.pathname.includes('/sign-in') ? 'text-sky-500' : ''} flex items-center justify-center`}
            to="/sign-in"
          >
            Sign In
          </Link>
          <Link
            className={`w-full rounded-lg border-2 border-transparent bg-white hover:border-sky-500 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden ${location.pathname.includes('/sign-up') ? 'text-sky-500' : ''} flex items-center justify-center`}
            to="/sign-up"
          >
            Sign Up
          </Link>
        </>
      )}
    </nav>
  );
}

export default NavBar;
