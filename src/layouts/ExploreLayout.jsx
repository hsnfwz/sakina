import { Link, useLocation, Outlet } from 'react-router';

function ExploreLayout() {
  const location = useLocation();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2 sm:hidden">
        <Link
          to="posts"
          className={`${location.pathname === '/explore' || location.pathname.includes('/explore/posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
        >
          <span>Posts</span>
        </Link>
        <Link
          to="questions"
          className={`${location.pathname.includes('/explore/questions') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
        >
          <span>Questions</span>
        </Link>
        <Link
          to="profiles"
          className={`${location.pathname.includes('/explore/profiles') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
        >
          <span>Profiles</span>
        </Link>
      </div>
      <Outlet />
    </div>
  );
}

export default ExploreLayout;
