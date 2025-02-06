import { Link, useLocation, Outlet } from 'react-router';

function ExploreLayout() {
  const location = useLocation();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex">
        <Link
          to="images"
          className={`${location.pathname === '/explore' || location.pathname.includes('images') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
        >
          Images
        </Link>
        <Link
          to="videos"
          className={`${location.pathname.includes('videos') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
        >
          Videos
        </Link>
        <Link
          to="discussions"
          className={`${location.pathname.includes('discussions') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
        >
          Discussions
        </Link>
        <Link
          to="profiles"
          className={`${location.pathname.includes('profiles') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
        >
          Profiles
        </Link>
      </div>
      <Outlet />
    </div>
  );
}

export default ExploreLayout;
