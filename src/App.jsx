import { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import {
  ModalContext,
  SessionContext,
  UserContext,
  DataContext,
  ScrollContext,
} from './common/contexts';
import { supabase } from './common/supabase';
import { getNotificationsCountByProfileId } from './common/database/notifications.js';
import { getPendingPostsCount } from './common/database/posts.js';
import CommentModal from './modals/CommentModal.jsx';
import Loading from './components/Loading.jsx';
import NavBar from './components/NavBar';
import NavBarMobileTop from './components/NavBarMobileTop.jsx';
import NavBarMobileBottom from './components/NavBarMobileBottom.jsx';
import PostModal from './modals/PostModal.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ExploreLayout from './layouts/ExploreLayout.jsx';
import ForbiddenLayout from './layouts/ForbiddenLayout.jsx';
import ForgotPasswordLayout from './layouts/ForgotPasswordLayout.jsx';
import HomeLayout from './layouts/HomeLayout.jsx';
import LogInLayout from './layouts/LogInLayout.jsx';
import NoContentLayout from './layouts/NoContentLayout.jsx';
import NotFoundLayout from './layouts/NotFoundLayout.jsx';
import NotificationsLayout from './layouts/NotificationsLayout.jsx';
import ResetPasswordLayout from './layouts/ResetPasswordLayout.jsx';
import SettingsLayout from './layouts/SettingsLayout.jsx';
import SignUpLayout from './layouts/SignUpLayout.jsx';

import PostLayout from './layouts/PostLayout.jsx';
import ProfileLayout from './layouts/ProfileLayout.jsx';

import ProfileAcceptedPostsNestedLayout from './nested-layouts/ProfileAcceptedPostsNestedLayout.jsx';
import ProfilePendingPostsNestedLayout from './nested-layouts/ProfilePendingPostsNestedLayout.jsx';
import ProfileRejectedPostsNestedLayout from './nested-layouts/ProfileRejectedPostsNestedLayout.jsx';
import ProfileArchivedPostsNestedLayout from './nested-layouts/ProfileArchivedPostsNestedLayout.jsx';
import ProfileViewedPostsNestedLayout from './nested-layouts/ProfileViewedPostsNestedLayout.jsx';
import ProfileFollowersNestedLayout from './nested-layouts/ProfileFollowersNestedLayout.jsx';
import ProfileFollowingNestedLayout from './nested-layouts/ProfileFollowingNestedLayout.jsx';

import CommentLayout from './layouts/CommentLayout.jsx';

import ExploreImagePostsNestedLayout from './nested-layouts/ExploreImagePostsNestedLayout.jsx';
import ExploreVideoPostsNestedLayout from './nested-layouts/ExploreVideoPostsNestedLayout.jsx';
import ExploreDiscussionPostsNestedLayout from './nested-layouts/ExploreDiscussionPostsNestedLayout.jsx';
import ExploreProfilesNestedLayout from './nested-layouts/ExploreProfilesNestedLayout.jsx';

import ConfirmModal from './modals/ConfirmModal.jsx';
import AvatarModal from './modals/AvatarModal.jsx';

import WelcomeLayout from './layouts/WelcomeLayout.jsx';
import { getFollowersBySenderProfileId } from './common/database/followers.js';
import { getPostsCountByProfileId } from './common/database/posts.js';

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const scrollRef = useRef({
    exploreAcceptedImagePosts: {
      scrollX: 0,
      scrollY: 0,
    },
    exploreAcceptedVideoPosts: {
      scrollX: 0,
      scrollY: 0,
    },
    exploreAcceptedDiscussionPosts: {
      scrollX: 0,
      scrollY: 0,
    },
    exploreProfiles: {
      scrollX: 0,
      scrollY: 0,
    },
    notifications: {
      scrollX: 0,
      scrollY: 0,
    },
  });

  const [showModal, setShowModal] = useState({
    type: null,
    data: null,
  });

  const [adminPendingPosts, setAdminPendingPosts] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [homeAcceptedPosts, setHomeAcceptedPosts] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [notifications, setNotifications] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [exploreAcceptedImagePosts, setExploreAcceptedImagePosts] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [exploreAcceptedVideoPosts, setExploreAcceptedVideoPosts] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [exploreAcceptedDiscussionPosts, setExploreAcceptedDiscussionPosts] =
    useState({
      data: [],
      hasMoreData: true,
      hasInitializedData: false,
    });

  const [exploreProfiles, setExploreProfiles] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profileAcceptedPosts, setProfileAcceptedPosts] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profilePendingPosts, setProfilePendingPosts] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profileRejectedPosts, setProfileRejectedPosts] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profileArchivedPosts, setProfileArchivedPosts] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profileViewedPosts, setProfileViewedPosts] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profileAcceptedComments, setProfileAcceptedComments] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profilePendingComments, setProfilePendingComments] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profileRejectedComments, setProfileRejectedComments] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profileArchivedComments, setProfileArchivedComments] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profileViewedComments, setProfileViewedComments] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profileFollowers, setProfileFollowers] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [profileFollowing, setProfileFollowing] = useState({
    data: [],
    hasMoreData: true,
    hasInitializedData: false,
  });

  const [activeProfile, setActiveProfile] = useState(null);

  async function getUser(session, abortController) {
    const { data, error } = await supabase
      .from('users')
      .select('*, avatar:avatar_id(*)')
      .eq('id', session.user.id)
      .abortSignal(abortController.signal);

    if (error) {
      console.log(error);
    } else {
      setUser(data[0]);
    }
  }

  useEffect(() => {
    async function getAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (!session) setLoadingUser(false);
    }

    getAuth();
  }, []);

  useEffect(() => {
    async function initialize() {
      const abortController = new AbortController();

      setLoadingUser(true);
      await getUser(session, abortController);
      setLoadingUser(false);

      return () => {
        abortController.abort();
      };
    }

    if (session) {
      initialize();
    } else {
      setUser(null);
    }
  }, [session]);

  const [newPendingPostsCount, setNewPendingPostsCount] = useState(0);
  const [pendingPostsCount, setPendingPostsCount] = useState(0);
  const [isLoadingPendingPostsCount, setIsLoadingPendingPostsCount] =
    useState(false);
  const [pendingPostPayload, setPendingPostPayload] = useState(null);

  useEffect(() => {
    if (pendingPostPayload) {
      setNewPendingPostsCount(newPendingPostsCount + 1);
      setPendingPostsCount(pendingPostsCount + 1);
    }
  }, [pendingPostPayload]);

  useEffect(() => {
    async function initialize() {
      setIsLoadingPendingPostsCount(true);
      const { count } = await getPendingPostsCount();
      setPendingPostsCount(count);
      setIsLoadingPendingPostsCount(false);

      const postChangesChannel = supabase
        .channel('pending-post-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'posts',
            filter: 'status=eq.PENDING',
          },
          (payload) => {
            setPendingPostPayload(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'posts',
            filter: 'status=eq.PENDING',
          },
          (payload) => {
            setPendingPostPayload(payload);
          }
        )
        .subscribe();

      return () => {
        postChangesChannel.unsubscribe();
      };
    }

    if (user && user.user_role === 'SUPER_ADMIN') {
      initialize();
    }
  }, [user]);

  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [isLoadingNotificationsCount, setIsLoadingNotificationsCount] =
    useState(false);
  const [notificationPayload, setNotificationPayload] = useState(null);

  useEffect(() => {
    if (notificationPayload) {
      setNewNotificationsCount(newNotificationsCount + 1);
      setNotificationsCount(notificationsCount + 1);
    }
  }, [notificationPayload]);

  useEffect(() => {
    async function initialize() {
      setIsLoadingNotificationsCount(true);
      const { count } = await getNotificationsCountByProfileId(user.id);
      setNotificationsCount(count);
      setIsLoadingNotificationsCount(false);

      const notificationsInsertChannel = supabase
        .channel('notifications-insert')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `receiver_user_id=eq.${user.id}`,
          },
          (payload) => setNotificationPayload(payload)
        )
        .subscribe();

      return () => notificationsInsertChannel.unsubscribe();
    }

    if (user) {
      initialize();
    }
  }, [user]);

  const receiverProfileIds = useRef([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [isLoadingPostsCount, setIsLoadingPostsCount] = useState(false);
  const [postPayload, setPostPayload] = useState(null);

  useEffect(() => {
    if (
      postPayload &&
      !postPayload.new.is_anonymous &&
      !postPayload.new.is_archived
    ) {
      const hasReceiverProfileId = receiverProfileIds.current.filter(
        (receiverProfileId) => receiverProfileId === postPayload.new.user_id
      );

      if (hasReceiverProfileId.length > 0) {
        setNewPostsCount(newPostsCount + 1);
        setPostsCount(postsCount + 1);
      }
    }
  }, [postPayload]);

  useEffect(() => {
    async function initialize() {
      // setIsLoadingPostsCount(true);
      // const { count } = await getPostsCountByProfileId(user.id);
      // setPostsCount(count);
      // setIsLoadingPostsCount(false);

      const { data } = await getFollowersBySenderProfileId(user.id);
      receiverProfileIds.current = data.map((follower) => follower.receiver.id);

      const postChangesChannel = supabase
        .channel('accepted-post-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'posts',
            filter: 'status=eq.ACCEPTED',
          },
          (payload) => setPostPayload(payload)
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'posts',
            filter: 'status=eq.ACCEPTED',
          },
          (payload) => setPostPayload(payload)
        )
        .subscribe();

      return () => {
        postChangesChannel.unsubscribe();
      };
    }

    if (user) {
      initialize();
    }
  }, [user]);

  return (
    <BrowserRouter>
      <SessionContext.Provider value={{ session, setSession }}>
        <UserContext.Provider value={{ loadingUser, user, setUser }}>
          <ModalContext.Provider value={{ showModal, setShowModal }}>
            <DataContext.Provider
              value={{
                homeAcceptedPosts,
                setHomeAcceptedPosts,
                adminPendingPosts,
                setAdminPendingPosts,
                notifications,
                setNotifications,
                exploreAcceptedImagePosts,
                setExploreAcceptedImagePosts,
                exploreAcceptedVideoPosts,
                setExploreAcceptedVideoPosts,
                exploreAcceptedDiscussionPosts,
                setExploreAcceptedDiscussionPosts,
                exploreProfiles,
                setExploreProfiles,
                profileAcceptedPosts,
                setProfileAcceptedPosts,
                profilePendingPosts,
                setProfilePendingPosts,
                profileRejectedPosts,
                setProfileRejectedPosts,
                profileArchivedPosts,
                setProfileArchivedPosts,
                profileViewedPosts,
                setProfileViewedPosts,
                profileAcceptedComments,
                setProfileAcceptedComments,
                profilePendingComments,
                setProfilePendingComments,
                profileRejectedComments,
                setProfileRejectedComments,
                profileArchivedComments,
                setProfileArchivedComments,
                profileViewedComments,
                setProfileViewedComments,
                profileFollowers,
                setProfileFollowers,
                profileFollowing,
                setProfileFollowing,
                activeProfile,
                setActiveProfile,
              }}
            >
              <ScrollContext.Provider value={{ scrollRef }}>
                {loadingUser && <Loading />}

                {!loadingUser && (
                  <>
                    <NavBar
                      notificationsCount={notificationsCount}
                      isLoadingNotificationsCount={isLoadingNotificationsCount}
                      postsCount={postsCount}
                      isLoadingPostsCount={isLoadingPostsCount}
                      pendingPostsCount={pendingPostsCount}
                      isLoadingPendingPostsCount={isLoadingPendingPostsCount}
                    />
                    <NavBarMobileBottom
                      notificationsCount={notificationsCount}
                      isLoadingNotificationsCount={isLoadingNotificationsCount}
                      postsCount={postsCount}
                      isLoadingPostsCount={isLoadingPostsCount}
                    />
                    <NavBarMobileTop
                      pendingPostsCount={pendingPostsCount}
                      isLoadingPendingPostsCount={isLoadingPendingPostsCount}
                    />

                    {showModal.type === 'AVATAR_MODAL' && <AvatarModal />}

                    {showModal.type === 'POST_MODAL' && <PostModal />}

                    {showModal.type === 'COMMENT_MODAL' && <CommentModal />}

                    {showModal.type === 'CONFIRM_MODAL' && <ConfirmModal />}
                  </>
                )}

                {!loadingUser && (
                  <main
                    className={`relative left-0 top-0 mb-[76px] flex w-full flex-col gap-4 p-4 sm:mb-0 sm:pl-[216px]`}
                  >
                    <Routes>
                      <Route
                        path="/"
                        element={
                          user ? (
                            <HomeLayout
                              postsCount={postsCount}
                              setPostsCount={setPostsCount}
                              newPostsCount={newPostsCount}
                              setNewPostsCount={setNewPostsCount}
                              isLoadingPostsCount={isLoadingPostsCount}
                            />
                          ) : (
                            <WelcomeLayout />
                          )
                        }
                      />

                      <Route
                        path="admin"
                        element={
                          user && user.user_role === 'SUPER_ADMIN' ? (
                            <AdminLayout
                              setPendingPostsCount={setPendingPostsCount}
                              newPendingPostsCount={newPendingPostsCount}
                              setNewPendingPostsCount={setNewPendingPostsCount}
                            />
                          ) : (
                            <ForbiddenLayout />
                          )
                        }
                      />
                      <Route
                        path="log-in"
                        element={user ? <NoContentLayout /> : <LogInLayout />}
                      />
                      <Route
                        path="sign-up"
                        element={user ? <NoContentLayout /> : <SignUpLayout />}
                      />
                      <Route
                        path="forgot-password"
                        element={<ForgotPasswordLayout />}
                      />
                      <Route
                        path="reset-password"
                        element={
                          user ? <ResetPasswordLayout /> : <NoContentLayout />
                        }
                      />
                      <Route path="explore" element={<ExploreLayout />}>
                        <Route
                          index
                          element={<ExploreImagePostsNestedLayout />}
                        />
                        <Route
                          path="images"
                          element={<ExploreImagePostsNestedLayout />}
                        />
                        <Route
                          path="videos"
                          element={<ExploreVideoPostsNestedLayout />}
                        />
                        <Route
                          path="discussions"
                          element={<ExploreDiscussionPostsNestedLayout />}
                        />
                        <Route
                          path="profiles"
                          element={<ExploreProfilesNestedLayout />}
                        />
                        <Route path="*" element={<NotFoundLayout />} />
                      </Route>
                      <Route path="post/:id" element={<PostLayout />} />
                      <Route path="comment/:id" element={<CommentLayout />} />

                      <Route
                        path="profile/:username"
                        element={<ProfileLayout />}
                      >
                        <Route
                          index
                          element={<ProfileAcceptedPostsNestedLayout />}
                        />
                        <Route
                          path="accepted-posts"
                          element={<ProfileAcceptedPostsNestedLayout />}
                        />
                        <Route
                          path="pending-posts"
                          element={<ProfilePendingPostsNestedLayout />}
                        />
                        <Route
                          path="rejected-posts"
                          element={<ProfileRejectedPostsNestedLayout />}
                        />
                        <Route
                          path="archived-posts"
                          element={<ProfileArchivedPostsNestedLayout />}
                        />
                        <Route
                          path="viewed-posts"
                          element={<ProfileViewedPostsNestedLayout />}
                        />
                        <Route
                          path="followers"
                          element={<ProfileFollowersNestedLayout />}
                        />
                        <Route
                          path="following"
                          element={<ProfileFollowingNestedLayout />}
                        />
                        <Route path="*" element={<NotFoundLayout />} />
                      </Route>
                      <Route
                        path="notifications"
                        element={
                          user ? (
                            <NotificationsLayout
                              notificationsCount={notificationsCount}
                              setNotificationsCount={setNotificationsCount}
                              newNotificationsCount={newNotificationsCount}
                              setNewNotificationsCount={
                                setNewNotificationsCount
                              }
                              isLoadingNotificationsCount={
                                isLoadingNotificationsCount
                              }
                            />
                          ) : (
                            <NoContentLayout />
                          )
                        }
                      />
                      <Route
                        path="settings"
                        element={
                          session && user ? (
                            <SettingsLayout />
                          ) : (
                            <NoContentLayout />
                          )
                        }
                      />
                      <Route path="*" element={<NotFoundLayout />} />
                    </Routes>
                  </main>
                )}
              </ScrollContext.Provider>
            </DataContext.Provider>
          </ModalContext.Provider>
        </UserContext.Provider>
      </SessionContext.Provider>
    </BrowserRouter>
  );
}

export default App;

/* 
    BACKLOG:
    - make inputs green when they are correctly inputted to indicate progress to the user
    - make inputs red when they are incorrectly inputted to indicate error to the user

    - rethink post status
    - search bar for a profile's content
    - FIX: add scroll to position and infinite scroll for all pages based on NotificationsLayout

    - update home, admin, and notifications count badge whenever interacting
    - update file state to reflect new order, and save files in the order as shown

    - FIX: all global state changes across the app due to new state structure
    - FIX: profile followers, following, comments, and views nested layouts
    - FIX: make sure all state and url state is up to date whenever changes are made - we do not want stale data

    - unarchive post
    - comment views
    - comment likes
    - delete comment
    - archive, unarchive comment

    - @ mentions

    - notifications
      - is_read
      - auto-expire notifications within x time
      - auto-delete rejected posts within 24 hours

    - counts for followers, following, posts, comments, likes, views

    - FIX: reset password page + email change page + login page + sign up page


    FUTURE:
    - show preview of post before submission
    - show which admin (user) accepted/rejected content in accepted and rejected page views
    - admin approve updates to posts/comments
    - allow user to select a video frame to set as their thumbnail
    - allow users to manage all their avatars
    - make sure custom inputs can listen to important keys (enter, spacebar, etc.)
    - autoplay/autopause videos on intersection/not intersection
    ---
    - allow post/question creators to moderate their question_comments/comments
    - video play and pause with space bar
    - pin content
    - scheduled content
    - expired content
    - edit content
    - notifications for activity by people you follow
    - analytics page
    - stories (24 hours) + archived stories
    - video timestamps similar to youtube
    - groups (similar to albums and playlists)
    - rewards and promotion/spotlight system
    - message and sharing
    - livestreaming
    - email change page flow
    ---
    - private profiles?
    - delete account - remove all of a user's data
    - deactivate account - mark user as 'inactive' and keep all content, simply hide the user info from posts
    - verified users, banned users
    - captcha protection when signing up/logging in
    - RLS configuration for all tables
    - stripe subscriptions configuration - https://stripe.com/en-ca/payments
    - SMTP server configuration - https://supabase.com/docs/guides/auth/auth-smtp
    - auth email templates configuration - https://supabase.com/docs/guides/auth/auth-email-templates
    - rate limit supabase requests for data and storage to avoid potential spam - ex: when a user constantly refreshes the page

    RULES
    - No irrelevant content
    - No graphic content
    - No inappropriate content

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
