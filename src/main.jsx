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
import Search from './layouts/Search.jsx';
import Videos from './layouts/Videos.jsx';
import Clips from './layouts/Clips.jsx';
import ExploreDiscussions from './layouts/ExploreDiscussions.jsx';
import ExploreProfiles from './layouts/ExploreProfiles.jsx';
import Video from './layouts/Video.jsx';
import Clip from './layouts/Clip.jsx';
import Discussion from './layouts/Discussion.jsx';
import Profile from './layouts/Profile.jsx';
import NotFound from './layouts/NotFound.jsx';
import Settings from './layouts/Settings.jsx';
import SignUp from './layouts/SignUp.jsx';
import SignIn from './layouts/SignIn.jsx';

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
        path: 'sign-up',
        Component: SignUp,
        index: true,
      },
      {
        path: 'sign-in',
        Component: SignIn,
        index: true,
      },
      {
        path: 'home',
        Component: Home,
        children: [
          { index: true, Component: HomeVideos },
          { path: 'videos', Component: HomeVideos },
          { path: 'clips', Component: HomeClips },
          { path: 'discussions', Component: HomeDiscussions },
        ],
      },
      {
        path: 'search',
        Component: Search,
        index: true,
      },
      {
        path: 'videos',
        children: [
          { index: true, Component: Videos },
          { path: ':id', Component: Video },
        ],
      },
      {
        path: 'clips',
        children: [
          { index: true, Component: Clips },
          { path: ':id', Component: Clip },
        ],
      },
      {
        path: 'discussions',
        children: [
          { index: true, Component: ExploreDiscussions },
          { path: ':id', Component: Discussion },
        ],
      },
      {
        path: 'users',
        children: [
          { index: true, Component: ExploreProfiles },
          { path: ':id', Component: Profile },
        ],
      },
      {
        path: 'settings',
        Component: Settings,
        index: true,
      },
      {
        path: '*',
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

  - search modal
  - skeleton for loading the contents
  - search - split results into those you follow, those you can discover, and those you have posted for each type of content

  - upgrade tailwind
  - FIX: intersection for discussions and profiles not working

    BACKLOG:
    - make inputs green when they are correctly inputted to indicate progress to the user
    - make inputs red when they are incorrectly inputted to indicate error to the user

    - FIX: all global state changes across the app due to new state structure
    - FIX: profile followers, following, comments, and views nested layouts
    - FIX: make sure all state and url state is up to date whenever changes are made - we do not want stale data

    - hide/unhide videos and discussions

    - @ mentions

    - notifications
      - is_read
      - auto-expire notifications within x time
      - auto-delete rejected posts within 24 hours

    - counts for followers, following, posts, comments, likes, views

    - video play and pause with space bar
    - make sure custom inputs can listen to important keys (enter, spacebar, etc.)

    - show preview of post before submission
    - allow user to select a video frame to set as their thumbnail

    FUTURE:
    - allow users to block/mute/remove user discussing unwanted topics on their videos
    - pined content
    - scheduled content
    - expired content
    - edit content
    - notifications for activity by people you follow
    - analytics page
    - stories (24 hours) + archived stories
    - video timestamps/chapters similar to youtube
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

    COSTS
    - $25/month - Supabase
    - $20/month - Vercel
    - $20/year - Namecheap
    - 2.9% + 0.30C - Stripe
    - $5-25/month - SMTP Server Provider
    - supabase additional storage and egress costs

    FREE
    - $0
    - upload up to 5 files per post
    - max 2 GB per file
    - no priority review, 24 hours wait time
    - no priority search
    - no analytics page
    - no priority support
    - no supporter badge

    PRO
    - $4.99/month or $49.99/year (save $10)
    - upload up to 20 files per post (4x more!)
    - max 10GB per file (5x more!)
    - priority review, 2 hours wait time
    - priority search
    - analytics page
    - priority support
    - supporter badge
  */
