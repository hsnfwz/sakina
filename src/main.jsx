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
import Clip from './layouts/Clip.jsx';
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
import SettingsVideos from './layouts/SettingsVideos.jsx';
import SettingsClips from './layouts/SettingsClips.jsx';
import SettingsDiscussions from './layouts/SettingsDiscussions.jsx';

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
        path: '/videos',
        children: [
          { index: true, Component: Clips },
          { path: ':id', Component: Clip },
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
          { path: 'videos', Component: SettingsVideos },
          { path: 'clips', Component: SettingsClips },
          { path: 'discussions', Component: SettingsDiscussions },
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
  - FIX closing comment modal refreshes the page
  - FIX go back and forth between discussions doesnt save the comments

  video
  - add skip 5 seconds forward and back for video using arrow keys
  - enable/disable looping
  - autplay queue of videos (ex: playlists)

  - tab index - make sure we cannot access stuff behind modals - focus trap
  - FIX file upload button not opening when clicking space bar
  - style file upload button

  - user card design
  - refresh data after each edit/delete and make sure link state is refreshed too
  - unhide content
  - explore - show newest and most popular this week
  - handle links for content
  - modals opening animation
  - transitions between pages
  - fetch more when intersecting last element - check for all content pages

  - show preview of post before submission

  - look into making classes with tailwind properties to avoid using hardcoded enum values in js
  - restore scroll position

  - @ mentions

  notifications
    - notification card
    - notifications for activity by people you follow - enable/disable preference
    - is_read

  - views, likes, follows, anonymous

  sign-up/sign-in
  - make inputs green when they are correctly inputted to indicate progress to the user
  - make inputs red when they are incorrectly inputted to indicate error to the user

  FUTURE:
  - allow a single parent user account to manage multiple child user accounts (under the same email address)
  - allow an account to have collaborators with permissions
  - livestreaming
  - counts for all types of content
  - allow user to select a video frame to set as their thumbnail
  - allow users to block/mute/remove user discussing unwanted topics on their videos
  - pinned content
  - scheduled content
  - expired content
  - analytics page
  - stories (24 hours) + archived stories
  - playlists
  - collections (similar to albums and playlists)
  - rewards and promotion/spotlight system
  - messaging and sharing
  - email change page flow
  - delete account - mark user as 'inactive' and keep all content, simply hide the user info from posts
  - banned users
  - captcha protection when signing up/logging in
  - RLS configuration for all tables
  - stripe subscriptions configuration - https://stripe.com/en-ca/payments
  - SMTP server configuration - https://supabase.com/docs/guides/auth/auth-smtp
  - auth email templates configuration - https://supabase.com/docs/guides/auth/auth-email-templates
*/
