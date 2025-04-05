import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './index.css';

import App from './App.jsx';
import Welcome from './layouts/Welcome.jsx';
import Home from './layouts/Home.jsx';
import HomeClips from './layouts/HomeClips.jsx';
import HomeDiscussions from './layouts/HomeDiscussions.jsx';
import HomeVideos from './layouts/HomeVideos.jsx';
import Explore from './layouts/Explore.jsx';
import Videos from './layouts/Videos.jsx';
import Clips from './layouts/Clips.jsx';
import Discussions from './layouts/Discussions.jsx';
import Users from './layouts/Users.jsx';
import Video from './layouts/Video.jsx';
import Discussion from './layouts/Discussion.jsx';
import User from './layouts/User.jsx';
import NotFound from './layouts/NotFound.jsx';
import Settings from './layouts/Settings.jsx';
import SignUp from './layouts/SignUp.jsx';
import SignIn from './layouts/SignIn.jsx';
import ForgotPassword from './layouts/ForgotPassword.jsx';
import ResetPassword from './layouts/ResetPassword.jsx';
import UserVideos from './layouts/UserVideos.jsx';
import UserClips from './layouts/UserClips.jsx';
import UserDiscussions from './layouts/UserDiscussions.jsx';
import Notifications from './layouts/Notifications.jsx';
import SettingsAccount from './layouts/SettingsAccount.jsx';
import SettingsContent from './layouts/SettingsContent.jsx';
import UserActivity from './layouts/UserActivity.jsx';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Welcome,
        index: true,
      },
      {
        path: '/sign-up',
        Component: SignUp,
        index: true,
      },
      {
        path: '/sign-in',
        Component: SignIn,
        index: true,
      },
      {
        path: '/forgot-password',
        Component: ForgotPassword,
        index: true,
      },
      {
        path: '/reset-password',
        Component: ResetPassword,
        index: true,
      },
      {
        path: '/home',
        Component: Home,
        children: [
          { index: true, Component: HomeVideos },
          { path: 'videos', Component: HomeVideos },
          { path: 'clips', Component: HomeClips },
          { path: 'discussions', Component: HomeDiscussions },
        ],
      },
      {
        path: '/explore',
        Component: Explore,
        index: true,
      },
      {
        path: '/notifications',
        Component: Notifications,
        index: true,
      },
      {
        path: '/videos',
        children: [
          { index: true, Component: Videos },
          { path: ':id', Component: Video },
        ],
      },
      {
        path: '/clips',
        children: [
          { index: true, Component: Clips },
          { path: ':id', Component: Video },
        ],
      },
      {
        path: '/discussions',
        children: [
          { index: true, Component: Discussions },
          { path: ':id', Component: Discussion },
        ],
      },
      {
        path: '/users',
        children: [
          { index: true, Component: Users },
          {
            path: ':username',
            Component: User,
            children: [
              { index: true, Component: UserVideos },
              { path: 'videos', Component: UserVideos },
              { path: 'clips', Component: UserClips },
              { path: 'discussions', Component: UserDiscussions },
              { path: 'activity', Component: UserActivity },
            ],
          },
        ],
      },
      {
        path: '/settings',
        Component: Settings,
        children: [
          { index: true, Component: SettingsAccount },
          { path: 'account', Component: SettingsAccount },
          { path: 'content', Component: SettingsContent },
        ],
      },
      {
        path: '/*',
        Component: NotFound,
        index: true,
      },
    ],
  },
]);

const root = document.getElementById('root');

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

/* 
  - make sure buttons are disabled when loading their state (hide/unhide)

  - can we npm icons instead of creating SVG files? (ex: lucida)

  activeUser && activeDiscussion
  - don't show the content switching visually

  - likes for comments - every time we fetch comments/nested comments, get each their respective like record

  - home page
  - video discussions
  - bookmarks (save for later)
  - playlists + search playlists + explore playlists + user playlists
  - look into vimeo for video hosting - upload videos from sakina to vimeo and retreive the ID to store in the DB

  video
  - add skip 5 seconds forward and back for video using arrow keys
  - enable/disable looping
  - autplay queue of videos (ex: playlists)
  - visually display audio using Web Audio API

  - look into new supabase UI for file uploads
        - show preview of post before submission
        - create/avatar modal upload progress indicator

  - implement the same filter system from settings in explore page and activity page
        - individual filtered activity pages
        - individual filtered explore pages

  - refresh data after each add/edit/delete and make sure link state is refreshed too
  - restore scroll position
  - @ mentions


  BEFORE RELEASE
  - dev and prod datatables
  - rate limiting to avoid spamming the database
  - email change page flow
  - delete account - mark user as 'inactive' and keep all content, simply hide the user info from posts
  - banned users
  - captcha protection when signing up/logging in
  - RLS configuration for all tables
  - stripe subscriptions configuration - https://stripe.com/en-ca/payments
  - SMTP server configuration - https://supabase.com/docs/guides/auth/auth-smtp
  - auth email templates configuration - https://supabase.com/docs/guides/auth/auth-email-templates
  - subscriptions to supabase, email service, vimeo, and stripe


  FUTURE FEATURES:
  - realtime notifications, messaging, and sharing
  - livestreaming
  - select thumbnail from video frame
  - block/mute users
  - analytics page
  - revenue system for content creators
  - gamification system
  - stories
*/
