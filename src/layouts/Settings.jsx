import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, Outlet } from 'react-router';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import Header from '../components/Header.jsx';
import Anchor from '../components/Anchor.jsx';

function Settings() {
  const navigate = useNavigate();
  const { authSession } = useContext(AuthContext);
  const { authUser, isLoadingAuthUser } = useContext(AuthContext);

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
    if (!isLoadingAuthUser && !authUser) {
      navigate('/');
    }
  }, [isLoadingAuthUser, authUser]);

  if (!isLoadingAuthUser && authSession && authUser) {
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
