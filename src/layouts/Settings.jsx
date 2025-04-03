import { useContext, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import Header from '../components/Header.jsx';
import Anchor from '../components/Anchor.jsx';

function Settings() {
  const { authSession } = useContext(AuthContext);
  const { authUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  const [videos, setVideos] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [clips, setClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  const [discussions, setDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  useEffect(() => {
    if (authSession && authUser) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [authUser, authSession]);

  if (show) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Header>Settings</Header>
        <nav className="flex w-full">
          <Anchor
            active={
              location.pathname === '/settings' ||
              location.pathname.includes('account')
            }
            to="account"
          >
            Account
          </Anchor>
          <Anchor active={location.pathname.includes('videos')} to="videos">
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
        <Outlet
          context={{
            videos,
            setVideos,
            clips,
            setClips,
            discussions,
            setDiscussions,
          }}
        />
      </div>
    );
  }
}

export default Settings;
