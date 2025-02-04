import { useContext } from 'react';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import {
  ModalContext,
  UserContext,
  NotificationsContext,
} from '../common/contexts';
import Footer from './Footer';
import Button from './Button';
import SVGSolidHome from './svgs/solid/SVGSolidHome';
import SVGOutlineHome from './svgs/outline/SVGOutlineHome';
import SVGSolidCompass from './svgs/solid/SVGSolidCompass';
import SVGOutlineCompass from './svgs/outline/SVGOutlineCompass';
import SVGSolidBell from './svgs/solid/SVGSolidBell';
import SVGOutlineBell from './svgs/outline/SVGOutlineBell';
import SVGSolidUser from './svgs/solid/SVGSolidUser';
import SVGOutlineUser from './svgs/outline/SVGOutlineUser';
import SVGSolidSettings from './svgs/solid/SVGSolidSettings';
import SVGOutlineSettings from './svgs/outline/SVGOutlineSettings';
import SVGSolidShield from './svgs/solid/SVGSolidShield';
import SVGOutlineShield from './svgs/outline/SVGOutlineShield';
import SVGOutlinePlus from './svgs/outline/SVGOutlinePlus';
import SVGSolidUserArrow from './svgs/solid/SVGSolidUserArrow';
import SVGSolidUserPlus from './svgs/solid/SVGSolidUserPlus';
import SVGOutlineUserArrow from './svgs/outline/SVGOutlineUserArrow';
import SVGOutlineUserPlus from './svgs/outline/SVGOutlineUserPlus';
import { BUTTON_COLOR } from '../common/enums';
import { formatCount } from '../common/helpers.js';
import SearchBar from './SearchBar.jsx';

function NavBar({}) {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);
  const location = useLocation();
  const { notificationsCount, isLoadingNotificationsCount } =
    useContext(NotificationsContext);

  return (
    <div className="fixed left-0 top-0 z-40 hidden h-full w-full max-w-[300px] bg-black p-4 sm:block">
      <nav className="flex h-full w-full flex-col gap-4 sm:overflow-auto">
        <SearchBar />
        {user && user.user_role === 'SUPER_ADMIN' && (
          <Link
            to="/admin"
            className={`${location.pathname === '/admin' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
          >
            {location.pathname === '/admin' && <SVGSolidShield />}
            {location.pathname !== '/admin' && <SVGOutlineShield />}
            <span
              className={`${location.pathname === '/admin' ? 'text-sky-500' : 'text-white'}`}
            >
              Admin
            </span>
          </Link>
        )}
        <Link
          to="/"
          className={`${location.pathname === '/' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname === '/' && <SVGSolidHome />}
          {location.pathname !== '/' && <SVGOutlineHome />}
          <span
            className={`${location.pathname === '/' ? 'text-sky-500' : 'text-white'}`}
          >
            Home
          </span>
        </Link>
        <Link
          to="/explore"
          className={`${location.pathname.includes('/explore') ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname.includes('/explore') && <SVGSolidCompass />}
          {!location.pathname.includes('/explore') && <SVGOutlineCompass />}
          <span
            className={`${location.pathname.includes('/explore') ? 'text-sky-500' : 'text-white'}`}
          >
            Explore
          </span>
        </Link>

        {location.pathname.includes('/explore') && (
          <div className="flex flex-col gap-4 rounded-lg bg-neutral-700 p-4">
            <Link
              to="/explore/posts"
              className={`${location.pathname === '/explore' || location.pathname.includes('/explore/posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
            >
              <span>Posts</span>
            </Link>
            <Link
              to="/explore/questions"
              className={`${location.pathname.includes('/explore/questions') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
            >
              <span>Questions</span>
            </Link>
            <Link
              to="/explore/profiles"
              className={`${location.pathname.includes('/explore/profiles') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
            >
              <span>Profiles</span>
            </Link>
          </div>
        )}

        {user && (
          <Link
            to="/notifications"
            className={`${location.pathname.includes('/notifications') ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
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

            <span
              className={`${location.pathname.includes('/notifications') ? 'text-sky-500' : 'text-white'}`}
            >
              Notifications
            </span>
          </Link>
        )}

        {user && location.pathname.includes('/notifications') && (
          <div className="flex flex-col gap-4 rounded-lg bg-neutral-700 p-4">
            <Link
              className={`${location.pathname === `/notifications` || location.pathname.includes('accepted-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/notifications/accepted-posts`}
              state={{ profile: user }}
            >
              Accepted Posts
            </Link>
            <Link
              className={`${location.pathname.includes('pending-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/notifications/pending-posts`}
              state={{ profile: user }}
            >
              Pending Posts
            </Link>
            <Link
              className={`${location.pathname.includes('rejected-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/notifications/rejected-posts`}
              state={{ profile: user }}
            >
              Rejected Posts
            </Link>
            <Link
              className={`${location.pathname.includes('views') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/notifications/views`}
              state={{ profile: user }}
            >
              Views
            </Link>
            <Link
              className={`${location.pathname.includes('likes') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/notifications/likes`}
              state={{ profile: user }}
            >
              Likes
            </Link>
            <Link
              className={`${location.pathname.includes('followers') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/notifications/followers`}
              state={{ profile: user }}
            >
              Followers
            </Link>
            <Link
              className={`${location.pathname.includes('comments') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/notifications/comments`}
              state={{ profile: user }}
            >
              Comments
            </Link>
          </div>
        )}

        {user && (
          <Link
            to={`/${user.username}`}
            state={{ profile: user }}
            className={`${location.pathname.includes(`/${user.username}`) ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
          >
            {location.pathname.includes(`/${user.username}`) && (
              <SVGSolidUser />
            )}
            {!location.pathname.includes(`/${user.username}`) && (
              <SVGOutlineUser />
            )}
            <span
              className={`${location.pathname.includes(`/${user.username}`) ? 'text-sky-500' : 'text-white'}`}
            >
              Profile
            </span>
          </Link>
        )}

        {user && location.pathname.includes(`/${user.username}`) && (
          <div className="flex flex-col gap-4 rounded-lg bg-neutral-700 p-4">
            <Link
              className={`${location.pathname === `/${user.username}` || location.pathname.includes('accepted-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/${user.username}/accepted-posts`}
              state={{ profile: user }}
            >
              Posts
            </Link>

            <Link
              className={`${location.pathname.includes('pending-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/${user.username}/pending-posts`}
              state={{ profile: user }}
            >
              Pending Posts
            </Link>
            <Link
              className={`${location.pathname.includes('rejected-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/${user.username}/rejected-posts`}
              state={{ profile: user }}
            >
              Rejected Posts
            </Link>
            <Link
              className={`${location.pathname.includes('archived-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/${user.username}/archived-posts`}
              state={{ profile: user }}
            >
              Archived Posts
            </Link>
            <Link
              className={`${location.pathname.includes('viewed-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/${user.username}/viewed-posts`}
              state={{ profile: user }}
            >
              Viewed Posts
            </Link>

            <Link
              className={`${location.pathname.includes('followers') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/${user.username}/followers`}
              state={{ profile: user }}
            >
              Followers
            </Link>
            <Link
              className={`${location.pathname.includes('following') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`/${user.username}/following`}
              state={{ profile: user }}
            >
              Following
            </Link>
          </div>
        )}

        <Link
          to="/settings"
          className={`${location.pathname === '/settings' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname === '/settings' && <SVGSolidSettings />}
          {location.pathname !== '/settings' && <SVGOutlineSettings />}
          <span
            className={`${location.pathname === '/settings' ? 'text-sky-500' : 'text-white'}`}
          >
            Settings
          </span>
        </Link>

        {user && (
          <Button
            handleClick={() => setShowModal({ type: 'CREATE_MODAL' })}
            buttonColor={BUTTON_COLOR.GREEN}
          >
            <SVGOutlinePlus />
            <span>Create</span>
          </Button>
        )}
        {!user && (
          <>
            <Link
              onClick={() =>
                setShowModal({
                  type: null,
                  data: null,
                })
              }
              to="/log-in"
              className={`${location.pathname === '/log-in' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
            >
              {location.pathname === '/log-in' && <SVGSolidUserArrow />}
              {location.pathname !== '/log-in' && <SVGOutlineUserArrow />}
              <span
                className={`${location.pathname === '/log-in' ? 'text-sky-500' : 'text-white'}`}
              >
                Log In
              </span>
            </Link>
            <Link
              onClick={() =>
                setShowModal({
                  type: null,
                  data: null,
                })
              }
              to="/sign-up"
              className={`${location.pathname === '/sign-up' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
            >
              {location.pathname === '/sign-up' && <SVGSolidUserPlus />}
              {location.pathname !== '/sign-up' && <SVGOutlineUserPlus />}
              <span
                className={`${location.pathname === '/sign-up' ? 'text-sky-500' : 'text-white'}`}
              >
                Sign Up
              </span>
            </Link>
          </>
        )}

        <Footer />
      </nav>
    </div>
  );
}

export default NavBar;
