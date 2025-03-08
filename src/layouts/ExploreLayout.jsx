import { Outlet } from 'react-router';
import NavPanel from '../components/NavPanel';

function ExploreLayout() {
  return (
    <div className="flex w-full flex-col gap-4">
      <NavPanel
        links={[
          {
            pathname: '/explore',
            to: 'images',
            label: 'Images',
            show: true,
          },
          {
            to: 'videos',
            label: 'Videos',
            show: true,
          },
          {
            to: 'discussions',
            label: 'Discussions',
            show: true,
          },
          {
            to: 'profiles',
            label: 'Profiles',
            show: true,
          },
        ]}
      />
      <Outlet />
    </div>
  );
}

export default ExploreLayout;
