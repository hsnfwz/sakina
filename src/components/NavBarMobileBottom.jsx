import { useContext } from 'react';
import { Link, useLocation } from 'react-router';
import { UserContext, NotificationsContext } from '../common/contexts';
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

import { formatCount } from '../common/helpers';

function NavBarMobileBottom() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { notificationsCount, isLoadingNotificationsCount } =
    useContext(NotificationsContext);

  return (
    <div className="fixed bottom-0 z-40 block w-full bg-black p-4 sm:hidden">
      <nav className="flex w-full justify-around gap-2">
        <Link
          to="/"
          className={`${location.pathname === '/' ? 'fill-sky-500' : 'fill-white'} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname === '/' && <SVGSolidHome />}
          {location.pathname !== '/' && <SVGOutlineHome />}
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
            to={`/${user.username}`}
            state={{ profile: user }}
            className={`${location.pathname.includes(`/${user.username}`) ? 'fill-sky-500' : 'fill-white'} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
          >
            {location.pathname.includes(`/${user.username}`) && (
              <SVGSolidUser />
            )}
            {!location.pathname.includes(`/${user.username}`) && (
              <SVGOutlineUser />
            )}
          </Link>
        )}
        <Link
          to="/settings"
          className={`${location.pathname === '/settings' ? 'fill-sky-500' : 'fill-white'} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname === '/settings' && <SVGSolidSettings />}
          {location.pathname !== '/settings' && <SVGOutlineSettings />}
        </Link>
      </nav>
    </div>
  );
}

export default NavBarMobileBottom;
