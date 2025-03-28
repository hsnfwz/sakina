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
import ExploreDiscussions from './layouts/ExploreDiscussions.jsx';
import ExploreProfiles from './layouts/ExploreProfiles.jsx';
import Video from './layouts/Video.jsx';
import Clip from './layouts/Clip.jsx';
import Discussion from './layouts/Discussion.jsx';
import User from './layouts/User.jsx';
import NotFound from './layouts/NotFound.jsx';
import Settings from './layouts/Settings.jsx';
import SignUp from './layouts/SignUp.jsx';
import SignIn from './layouts/SignIn.jsx';
import UserVideos from './layouts/UserVideos.jsx';
import UserClips from './layouts/UserClips.jsx';
import UserDiscussions from './layouts/UserDiscussions.jsx';

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
          { path: ':id', Component: Clip },
        ],
      },
      {
        path: '/discussions',
        children: [
          { index: true, Component: ExploreDiscussions },
          { path: ':id', Component: Discussion },
        ],
      },
      {
        path: '/users',
        children: [
          { index: true, Component: ExploreProfiles },
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
        index: true,
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
  - look into making classes with tailwind properties to avoid using hardcoded enum values


    - FIX: scroll position and intersections for infinite scrolls and intersection
    - ensure all changes to content is updated in the global state
    - make inputs green when they are correctly inputted to indicate progress to the user
    - make inputs red when they are incorrectly inputted to indicate error to the user
    - hide/unhide content
    - edit content
    - @ mentions
    - notifications
      - is_read
      - auto-expire notifications within x time
      - auto-delete rejected posts within 24 hours

    - counts for followers, following, posts, comments, likes, views
    - make sure custom inputs can listen to important keys (enter, spacebar, etc.)
    - show preview of post before submission

    FUTURE:
    - allow user to select a video frame to set as their thumbnail
    - allow users to block/mute/remove user discussing unwanted topics on their videos
    - pined content
    - scheduled content
    - expired content
    - notifications for activity by people you follow
    - analytics page
    - stories (24 hours) + archived stories
    - playlists
    - collections (similar to albums and playlists)
    - rewards and promotion/spotlight system
    - message and sharing
    - livestreaming
    - email change page flow
    - delete account - mark user as 'inactive' and keep all content, simply hide the user info from posts
    - verified users, banned users
    - captcha protection when signing up/logging in
    - RLS configuration for all tables
    - stripe subscriptions configuration - https://stripe.com/en-ca/payments
    - SMTP server configuration - https://supabase.com/docs/guides/auth/auth-smtp
    - auth email templates configuration - https://supabase.com/docs/guides/auth/auth-email-templates
    - rate limit supabase requests for data and storage to avoid potential spam - ex: when a user constantly refreshes the page
  */
