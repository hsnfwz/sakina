import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, Outlet } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { expectedUsernameFormat } from '../common/helpers.js';
import { supabase } from '../common/supabase.js';
import Header from '../components/Header.jsx';
import Anchor from '../components/Anchor.jsx';

function Settings() {
  const timerRef = useRef();

  const navigate = useNavigate();
  const { authSession } = useContext(AuthContext);
  const { authUser, isLoadingAuthUser, setAuthUser } = useContext(AuthContext);

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
          <Anchor
            active={
              location.pathname.includes('videos')
            }
            to="videos"
          >
            Videos
          </Anchor>
          <Anchor
            active={
              location.pathname.includes('clips')
            }
            to="clips"
          >
            Clips
          </Anchor>
          <Anchor
            active={
              location.pathname.includes('discussions')
            }
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

export default Settings;
