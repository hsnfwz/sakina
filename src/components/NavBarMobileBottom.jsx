import { useContext } from 'react';
import { Link, useLocation } from 'react-router';
import { UserContext } from '../common/contexts';
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

function NavBarMobileBottom({
  notificationsCount,
  isLoadingNotificationsCount,
  postsCount,
  isLoadingPostsCount,
}) {
  const { user } = useContext(UserContext);
  const location = useLocation();

  return (
    <div className="fixed bottom-0 z-40 block w-full bg-black p-4 sm:hidden">
      <nav className="flex w-full justify-around gap-2">
        <Link
          to="/"
          className={`${location.pathname === '/' ? 'fill-sky-500' : 'fill-white'} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          <div className="relative left-0 top-0">
            {location.pathname === '/' && (
              <div className="relative left-0 top-0">
                <SVGSolidHome />
              </div>
            )}
            {location.pathname !== '/' && (
              <div className="relative left-0 top-0">
                <SVGOutlineHome />
              </div>
            )}
            {!isLoadingPostsCount && postsCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-xs text-white">
                {formatCount(postsCount)}
              </span>
            )}
          </div>
        </Link>

        <Link
          to="/explore"
          className={`${location.pathname === '/explore' ? 'fill-sky-500' : 'fill-white'} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname === '/explore' && <SVGSolidCompass />}
          {location.pathname !== '/explore' && <SVGOutlineCompass />}
        </Link>
        {user && (
          <Link
            to="/notifications"
            className={`${location.pathname.includes('/notifications') ? 'fill-sky-500' : 'fill-white'} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
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
                <span className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-xs text-white">
                  {formatCount(notificationsCount)}
                </span>
              )}
            </div>
          </Link>
        )}
        {user && (
          <Link
            to={`/profile/${user.username}`}
            state={{ profile: user }}
            className={`${location.pathname.includes(`/profile/${user.username}`) ? 'fill-sky-500' : 'fill-white'} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
          >
            {location.pathname.includes(`/profile/${user.username}`) && (
              <SVGSolidUser />
            )}
            {!location.pathname.includes(`/profile/${user.username}`) && (
              <SVGOutlineUser />
            )}
          </Link>
        )}
        {user && (
          <Link
            to="/settings"
            className={`${location.pathname === '/settings' ? 'fill-sky-500' : 'fill-white'} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
          >
            {location.pathname === '/settings' && <SVGSolidSettings />}
            {location.pathname !== '/settings' && <SVGOutlineSettings />}
          </Link>
        )}
        {!user && (
          <>
            <Link
              to="/log-in"
              className={`${location.pathname === '/log-in' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
            >
              {location.pathname === '/log-in' && <SVGSolidUserArrow />}
              {location.pathname !== '/log-in' && <SVGOutlineUserArrow />}
            </Link>
            <Link
              to="/sign-up"
              className={`${location.pathname === '/sign-up' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
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
