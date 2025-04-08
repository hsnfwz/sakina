import { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import Header from '../components/Header.jsx';
import Anchor from '../components/Anchor.jsx';

function Home() {
  const { authUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (authUser) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [authUser]);

  if (show) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Header>Home</Header>
        <nav className="flex w-full">
          <Anchor
            active={
              location.pathname === '/home' ||
              location.pathname.includes('videos')
            }
            to="videos"
          >
            Videos
          </Anchor>
          <Anchor active={location.pathname.includes('clips')} to="clips">
            Clips
          </Anchor>
          <Anchor
            active={location.pathname.includes('discussions')}
            to="discussions"
          >
            Discussions
          </Anchor>
        </nav>
        <Outlet />
      </div>
    );
  }
}

export default Home;
