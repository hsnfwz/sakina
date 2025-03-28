import { useContext } from 'react';
import { Link, useLocation } from 'react-router';
import { ModalContext } from '../common/contexts';
import { AuthContext } from '../common/context/AuthContextProvider';
import SVGOutlineHome from './svgs/outline/SVGOutlineHome';
import SVGSolidHome from './svgs/solid/SVGSolidHome';
import SVGSolidCompass from './svgs/solid/SVGSolidCompass';
import SVGOutlineCompass from './svgs/outline/SVGOutlineCompass';
import SVGSolidUser from './svgs/solid/SVGSolidUser';
import SVGOutlineUser from './svgs/outline/SVGOutlineUser';
import SVGOutlineBell from './svgs/outline/SVGOutlineBell';
import SVGSolidBell from './svgs/solid/SVGSolidBell';
import SVGSolidSettings from './svgs/solid/SVGSolidSettings';
import SVGOutlineSettings from './svgs/outline/SVGOutlineSettings';
import SVGSolidUserArrow from './svgs/solid/SVGSolidUserArrow';
import SVGSolidUserPlus from './svgs/solid/SVGSolidUserPlus';
import SVGOutlineUserArrow from './svgs/outline/SVGOutlineUserArrow';
import SVGOutlineUserPlus from './svgs/outline/SVGOutlineUserPlus';
import { formatCount } from '../common/helpers';
import IconButton from './IconButton';
import SVGOutlinePlus from './svgs/outline/SVGOutlinePlus';
import { BUTTON_COLOR } from '../common/enums';

function NavBarMobileBottom({
  notificationsCount,
  isLoadingNotificationsCount,
  postsCount,
  isLoadingPostsCount,
}) {
  const { authUser } = useContext(AuthContext);
  const { setShowModal } = useContext(ModalContext);
  const location = useLocation();

  return (
    <div className="fixed bottom-0 z-40 block w-full bg-white p-2">
      <nav className="mx-auto flex w-full max-w-(--breakpoint-md) justify-around gap-2">
        <Link
          to="/home"
          className={`${location.pathname === '/home' ? 'fill-sky-500' : 'fill-black'} flex gap-2 rounded-full border-2 border-transparent bg-white p-2 hover:bg-neutral-200 focus:border-2 focus:border-white focus:outline-hidden focus:ring-0`}
        >
          <div className="relative left-0 top-0">
            {location.pathname === '/home' && (
              <div className="relative left-0 top-0">
                <SVGSolidHome />
              </div>
            )}
            {location.pathname !== '/home' && (
              <div className="relative left-0 top-0">
                <SVGOutlineHome />
              </div>
            )}
            {!isLoadingPostsCount && postsCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-xs text-black">
                {formatCount(postsCount)}
              </span>
            )}
          </div>
        </Link>

        <Link
          to="/explore"
          className={`${location.pathname.includes('/explore') ? 'fill-sky-500' : 'fill-black'} flex gap-2 rounded-full border-2 border-transparent bg-white p-2 hover:bg-neutral-200 focus:border-2 focus:border-white focus:outline-hidden focus:ring-0`}
        >
          {location.pathname.includes('/explore') && <SVGSolidCompass />}
          {!location.pathname.includes('/explore') && <SVGOutlineCompass />}
        </Link>
        {authUser && (
          <IconButton
            handleClick={() => setShowModal({ type: 'CREATE_MODAL' })}
            buttonColor={BUTTON_COLOR.GREEN}
          >
            <SVGOutlinePlus />
          </IconButton>
        )}
        {/* {authUser && (
          <Link
            to="/notifications"
            className={`${location.pathname.includes('/notifications') ? 'fill-sky-500' : 'fill-black'} flex gap-2 rounded-full border-2 border-transparent bg-white p-2 hover:bg-neutral-200 focus:border-2 focus:border-white focus:outline-hidden focus:ring-0`}
          >
            <div className="relative left-0 top-0">
              {location.pathname.includes('/notifications') && (
                <div className="relative left-0 top-0">
                  <SVGSolidBell />
                </div>
              )}
              {!location.pathname.includes('/notifications') && (
                <div className="relative left-0 top-0">
                  <SVGOutlineBell />
                </div>
              )}
              {!isLoadingNotificationsCount && notificationsCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-xs text-black">
                  {formatCount(notificationsCount)}
                </span>
              )}
            </div>
          </Link>
        )} */}
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            state={{ profile: authUser }}
            className={`${location.pathname.includes(`/profile/${authUser.username}`) ? 'fill-sky-500' : 'fill-black'} flex gap-2 rounded-full border-2 border-transparent bg-white p-2 hover:bg-neutral-200 focus:border-2 focus:border-white focus:outline-hidden focus:ring-0`}
          >
            {location.pathname.includes(`/profile/${authUser.username}`) && (
              <SVGSolidUser />
            )}
            {!location.pathname.includes(`/profile/${authUser.username}`) && (
              <SVGOutlineUser />
            )}
          </Link>
        )}
        {authUser && (
          <Link
            to="/settings"
            className={`${location.pathname === '/settings' ? 'fill-sky-500' : 'fill-black'} flex gap-2 rounded-full border-2 border-transparent bg-white p-2 hover:bg-neutral-200 focus:border-2 focus:border-white focus:outline-hidden focus:ring-0`}
          >
            {location.pathname === '/settings' && <SVGSolidSettings />}
            {location.pathname !== '/settings' && <SVGOutlineSettings />}
          </Link>
        )}
        {!authUser && (
          <>
            <Link
              to="/log-in"
              className={`${location.pathname === '/log-in' ? 'fill-sky-500' : 'fill-black'} flex gap-4 rounded-full border-2 border-transparent bg-white p-2 hover:bg-neutral-200 focus:border-2 focus:border-white focus:outline-hidden focus:ring-0`}
            >
              {location.pathname === '/log-in' && <SVGSolidUserArrow />}
              {location.pathname !== '/log-in' && <SVGOutlineUserArrow />}
            </Link>
            <Link
              to="/sign-up"
              className={`${location.pathname === '/sign-up' ? 'fill-sky-500' : 'fill-black'} flex gap-4 rounded-full border-2 border-transparent bg-white p-2 hover:bg-neutral-200 focus:border-2 focus:border-white focus:outline-hidden focus:ring-0`}
            >
              {location.pathname === '/sign-up' && <SVGSolidUserPlus />}
              {location.pathname !== '/sign-up' && <SVGOutlineUserPlus />}
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default NavBarMobileBottom;
