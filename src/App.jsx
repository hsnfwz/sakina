import { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import {
  ModalContext,
  ScreenResizeContext,
  SessionContext,
  UserContext,
  FullscreenContext,
  ExploreContext,
  NotificationsContext,
  ScrollContext,
  AdminContext,
} from './common/contexts';
import { useElementIntersection } from './common/hooks.js';
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

import NotificationsAcceptedPostNotificationsNestedLayout from './nested-layouts/NotificationsAcceptedPostNotificationsNestedLayout.jsx';
import NotificationsPendingPostNotificationsNestedLayout from './nested-layouts/NotificationsPendingPostNotificationsNestedLayout.jsx';
import NotificationsRejectedPostNotificationsNestedLayout from './nested-layouts/NotificationsRejectedPostNotificationsNestedLayout.jsx';
import NotificationsLikesNestedLayout from './nested-layouts/NotificationsLikesNestedLayout.jsx';
import NotificationsViewsNestedLayout from './nested-layouts/NotificationsViewsNestedLayout.jsx';
import NotificationsCommentsNestedLayout from './nested-layouts/NotificationsCommentsNestedLayout.jsx';
import NotificationsFollowersNestedLayout from './nested-layouts/NotificationsFollowersNestedLayout.jsx';

import CommentLayout from './layouts/CommentLayout.jsx';

import AdminPendingPostsNestedLayout from './nested-layouts/AdminPendingPostsNestedLayout.jsx';
import AdminAcceptedPostsNestedLayout from './nested-layouts/AdminAcceptedPostsNestedLayout.jsx';
import AdminRejectedPostsNestedLayout from './nested-layouts/AdminRejectedPostsNestedLayout.jsx';

import ExploreImagePostsNestedLayout from './nested-layouts/ExploreImagePostsNestedLayout.jsx';
import ExploreVideoPostsNestedLayout from './nested-layouts/ExploreVideoPostsNestedLayout.jsx';
import ExploreDiscussionPostsNestedLayout from './nested-layouts/ExploreDiscussionPostsNestedLayout.jsx';
import ExploreProfilesNestedLayout from './nested-layouts/ExploreProfilesNestedLayout.jsx';

import ConfirmModal from './modals/ConfirmModal.jsx';

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
    profile: {
      pendingPosts: {
        scrollX: 0,
        scrollY: 0,
      },
      acceptedPosts: {
        scrollX: 0,
        scrollY: 0,
      },
      rejectedPosts: {
        scrollX: 0,
        scrollY: 0,
      },
      archivedPosts: {
        scrollX: 0,
        scrollY: 0,
      },
      viewedPosts: {
        scrollX: 0,
        scrollY: 0,
      },
      pendingComments: {
        scrollX: 0,
        scrollY: 0,
      },
      acceptedComments: {
        scrollX: 0,
        scrollY: 0,
      },
      rejectedComments: {
        scrollX: 0,
        scrollY: 0,
      },
      archivedComments: {
        scrollX: 0,
        scrollY: 0,
      },
      viewedComments: {
        scrollX: 0,
        scrollY: 0,
      },
      followers: {
        scrollX: 0,
        scrollY: 0,
      },
      following: {
        scrollX: 0,
        scrollY: 0,
      },
    }
  });

  const [screenResize, setScreenResize] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState({
    type: null,
    data: null,
  });

  const [newNotification, setNewNotification] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [isLoadingNotificationsCount, setIsLoadingNotificationsCount] =
    useState(false);

  const [newPendingPost, setNewPendingPost] = useState(null);
  const [pendingPostsCount, setPendingPostsCount] = useState(0);
  const [isLoadingPendingPostsCount, setIsLoadingPendingPostsCount] =
    useState(false);

  const [exploreAcceptedImagePosts, setExploreAcceptedImagePosts] = useState(
    []
  );
  const [
    exploreHasMoreAcceptedImagePosts,
    setExploreHasMoreAcceptedImagePosts,
  ] = useState(true);
  const [
    exploreHasInitializedAcceptedImagePosts,
    setExploreHasInitializedAcceptedImagePosts,
  ] = useState(false);

  const [exploreAcceptedVideoPosts, setExploreAcceptedVideoPosts] = useState(
    []
  );
  const [
    exploreHasMoreAcceptedVideoPosts,
    setExploreHasMoreAcceptedVideoPosts,
  ] = useState(true);
  const [
    exploreHasInitializedAcceptedVideoPosts,
    setExploreHasInitializedAcceptedVideoPosts,
  ] = useState(false);

  const [exploreAcceptedDiscussions, setExploreAcceptedDiscussions] = useState(
    []
  );
  const [
    exploreHasMoreAcceptedDiscussions,
    setExploreHasMoreAcceptedDiscussions,
  ] = useState(true);
  const [
    exploreHasInitializedAcceptedDiscussions,
    setExploreHasInitializedAcceptedDiscussions,
  ] = useState(false);

  const [exploreProfiles, setExploreProfiles] = useState([]);
  const [exploreHasMoreProfiles, setExploreHasMoreProfiles] = useState(true);
  const [exploreHasInitializedProfiles, setExploreHasInitializedProfiles] =
    useState(false);







  const [profileAcceptedPosts, setProfileAcceptedPosts] = useState([]);
  const [profileIsLoadingAcceptedPosts, setProfileIsLoadingAcceptedPosts] =
    useState(false);
  const [profileHasMoreAcceptedPosts, setProfileHasMoreAcceptedPosts] =
    useState(true);
  const [
    profileHasInitializedAcceptedPosts,
    setProfileHasInitializedAcceptedPosts,
  ] = useState(false);
  const [profileScrollYAcceptedPosts, setProfileScrollYAcceptedPosts] =
    useState(0);
  const [
    profileElementRefAcceptedPosts,
    profileIntersectingElementAcceptedPosts,
  ] = useElementIntersection();

  const [profilePendingPosts, setProfilePendingPosts] = useState([]);
  const [profileIsLoadingPendingPosts, setProfileIsLoadingPendingPosts] =
    useState(false);
  const [profileHasMorePendingPosts, setProfileHasMorePendingPosts] =
    useState(true);
  const [
    profileHasInitializedPendingPosts,
    setProfileHasInitializedPendingPosts,
  ] = useState(false);
  const [profileScrollYPendingPosts, setProfileScrollYPendingPosts] =
    useState(0);
  const [
    profileElementRefPendingPosts,
    profileIntersectingElementPendingPosts,
  ] = useElementIntersection();

  const [profileRejectedPosts, setProfileRejectedPosts] = useState([]);
  const [profileIsLoadingRejectedPosts, setProfileIsLoadingRejectedPosts] =
    useState(false);
  const [profileHasMoreRejectedPosts, setProfileHasMoreRejectedPosts] =
    useState(true);
  const [
    profileHasInitializedRejectedPosts,
    setProfileHasInitializedRejectedPosts,
  ] = useState(false);
  const [profileScrollYRejectedPosts, setProfileScrollYRejectedPosts] =
    useState(0);
  const [
    profileElementRefRejectedPosts,
    profileIntersectingElementRejectedPosts,
  ] = useElementIntersection();

  const [profileArchivedPosts, setProfileArchivedPosts] = useState([]);
  const [profileIsLoadingArchivedPosts, setProfileIsLoadingArchivedPosts] =
    useState(false);
  const [profileHasMoreArchivedPosts, setProfileHasMoreArchivedPosts] =
    useState(true);
  const [
    profileHasInitializedArchivedPosts,
    setProfileHasInitializedArchivedPosts,
  ] = useState(false);
  const [profileScrollYArchivedPosts, setProfileScrollYArchivedPosts] =
    useState(0);
  const [
    profileElementRefArchivedPosts,
    profileIntersectingElementArchivedPosts,
  ] = useElementIntersection();

  const [profileViewedPosts, setProfileViewedPosts] = useState([]);
  const [profileIsLoadingViewedPosts, setProfileIsLoadingViewedPosts] =
    useState(false);
  const [profileHasMoreViewedPosts, setProfileHasMoreViewedPosts] =
    useState(true);
  const [
    profileHasInitializedViewedPosts,
    setProfileHasInitializedViewedPosts,
  ] = useState(false);
  const [profileScrollYViewedPosts, setProfileScrollYViewedPosts] = useState(0);
  const [profileElementRefViewedPosts, profileIntersectingElementViewedPosts] =
    useElementIntersection();



    const [profileAcceptedComments, setProfileAcceptedComments] = useState([]);
  const [profileIsLoadingAcceptedComments, setProfileIsLoadingAcceptedComments] =
    useState(false);
  const [profileHasMoreAcceptedComments, setProfileHasMoreAcceptedComments] =
    useState(true);
  const [
    profileHasInitializedAcceptedComments,
    setProfileHasInitializedAcceptedComments,
  ] = useState(false);
  const [profileScrollYAcceptedComments, setProfileScrollYAcceptedComments] =
    useState(0);
  const [
    profileElementRefAcceptedComments,
    profileIntersectingElementAcceptedComments,
  ] = useElementIntersection();

  const [profilePendingComments, setProfilePendingComments] = useState([]);
  const [profileIsLoadingPendingComments, setProfileIsLoadingPendingComments] =
    useState(false);
  const [profileHasMorePendingComments, setProfileHasMorePendingComments] =
    useState(true);
  const [
    profileHasInitializedPendingComments,
    setProfileHasInitializedPendingComments,
  ] = useState(false);
  const [profileScrollYPendingComments, setProfileScrollYPendingComments] =
    useState(0);
  const [
    profileElementRefPendingComments,
    profileIntersectingElementPendingComments,
  ] = useElementIntersection();

  const [profileRejectedComments, setProfileRejectedComments] = useState([]);
  const [profileIsLoadingRejectedComments, setProfileIsLoadingRejectedComments] =
    useState(false);
  const [profileHasMoreRejectedComments, setProfileHasMoreRejectedComments] =
    useState(true);
  const [
    profileHasInitializedRejectedComments,
    setProfileHasInitializedRejectedComments,
  ] = useState(false);
  const [profileScrollYRejectedComments, setProfileScrollYRejectedComments] =
    useState(0);
  const [
    profileElementRefRejectedComments,
    profileIntersectingElementRejectedComments,
  ] = useElementIntersection();

  const [profileArchivedComments, setProfileArchivedComments] = useState([]);
  const [profileIsLoadingArchivedComments, setProfileIsLoadingArchivedComments] =
    useState(false);
  const [profileHasMoreArchivedComments, setProfileHasMoreArchivedComments] =
    useState(true);
  const [
    profileHasInitializedArchivedComments,
    setProfileHasInitializedArchivedComments,
  ] = useState(false);
  const [profileScrollYArchivedComments, setProfileScrollYArchivedComments] =
    useState(0);
  const [
    profileElementRefArchivedComments,
    profileIntersectingElementArchivedComments,
  ] = useElementIntersection();

  const [profileViewedComments, setProfileViewedComments] = useState([]);
  const [profileIsLoadingViewedComments, setProfileIsLoadingViewedComments] =
    useState(false);
  const [profileHasMoreViewedComments, setProfileHasMoreViewedComments] =
    useState(true);
  const [
    profileHasInitializedViewedComments,
    setProfileHasInitializedViewedComments,
  ] = useState(false);
  const [profileScrollYViewedComments, setProfileScrollYViewedComments] = useState(0);
  const [profileElementRefViewedComments, profileIntersectingElementViewedComments] =
    useElementIntersection();

  const [profileFollowers, setProfileFollowers] = useState([]);
  const [profileIsLoadingFollowers, setProfileIsLoadingFollowers] =
    useState(false);
  const [profileHasMoreFollowers, setProfileHasMoreFollowers] = useState(true);
  const [profileHasInitializedFollowers, setProfileHasInitializedFollowers] =
    useState(false);
  const [profileScrollYFollowers, setProfileScrollYFollowers] = useState(0);
  const [profileElementRefFollowers, profileIntersectingElementFollowers] =
    useElementIntersection();

  const [profileFollowing, setProfileFollowing] = useState([]);
  const [profileIsLoadingFollowing, setProfileIsLoadingFollowing] =
    useState(false);
  const [profileHasMoreFollowing, setProfileHasMoreFollowing] = useState(true);
  const [profileHasInitializedFollowing, setProfileHasInitializedFollowing] =
    useState(false);
  const [profileScrollYFollowing, setProfileScrollYFollowing] = useState(0);
  const [profileElementRefFollowing, profileIntersectingElementFollowing] =
    useElementIntersection();







  async function getUser(session, abortController) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
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

  useEffect(() => {
    setNotificationsCount(notificationsCount + 1);
  }, [newNotification]);

  useEffect(() => {
    setPendingPostsCount(pendingPostsCount + 1);
  }, [newPendingPost]);

  useEffect(() => {
    async function initialize() {
      setIsLoadingPendingPostsCount(true);
      const { count } = await getPendingPostsCount();
      setPendingPostsCount(count);
      setIsLoadingPendingPostsCount(false);

      const postsInsertChannel = supabase
        .channel('posts-insert')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'posts' },
          (payload) => {
            setNewPendingPost(payload.new);
          }
        )
        .subscribe();

      return () => {
        postsInsertChannel.unsubscribe();
      };
    }
    if (user && user.user_role === 'SUPER_ADMIN') {
      initialize();
    }
  }, [user]);

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
          (payload) => {
            setNewNotification(payload.new);
          }
        )
        .subscribe();

      return () => notificationsInsertChannel.unsubscribe();
    }

    if (user) {
      initialize();
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setScreenResize(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <SessionContext.Provider value={{ session, setSession }}>
        <UserContext.Provider value={{ loadingUser, user, setUser }}>
          <AdminContext.Provider
            value={{
              newPendingPost,
              setNewPendingPost,
              pendingPostsCount,
              setPendingPostsCount,
              isLoadingPendingPostsCount,
              setIsLoadingPendingPostsCount,
            }}
          >
            <NotificationsContext.Provider
              value={{
                newNotification,
                setNewNotification,
                notificationsCount,
                setNotificationsCount,
                isLoadingNotificationsCount,
                setIsLoadingNotificationsCount,
              }}
            >
              <ModalContext.Provider value={{ showModal, setShowModal }}>
                <ScreenResizeContext.Provider value={{ screenResize }}>
                  <FullscreenContext.Provider
                    value={{ isFullscreen, setIsFullscreen }}
                  >
                    <ExploreContext.Provider
                      value={{
                        exploreAcceptedImagePosts,
                        setExploreAcceptedImagePosts,
                        exploreHasMoreAcceptedImagePosts,
                        setExploreHasMoreAcceptedImagePosts,
                        exploreHasInitializedAcceptedImagePosts,
                        setExploreHasInitializedAcceptedImagePosts,

                        exploreAcceptedVideoPosts,
                        setExploreAcceptedVideoPosts,
                        exploreHasMoreAcceptedVideoPosts,
                        setExploreHasMoreAcceptedVideoPosts,
                        exploreHasInitializedAcceptedVideoPosts,
                        setExploreHasInitializedAcceptedVideoPosts,

                        exploreAcceptedDiscussions,
                        setExploreAcceptedDiscussions,
                        exploreHasMoreAcceptedDiscussions,
                        setExploreHasMoreAcceptedDiscussions,
                        exploreHasInitializedAcceptedDiscussions,
                        setExploreHasInitializedAcceptedDiscussions,

                        exploreProfiles,
                        setExploreProfiles,
                        exploreHasMoreProfiles,
                        setExploreHasMoreProfiles,
                        exploreHasInitializedProfiles,
                        setExploreHasInitializedProfiles,

                        profileAcceptedPosts,
                        setProfileAcceptedPosts,
                        profileIsLoadingAcceptedPosts,
                        setProfileIsLoadingAcceptedPosts,
                        profileHasMoreAcceptedPosts,
                        setProfileHasMoreAcceptedPosts,
                        profileHasInitializedAcceptedPosts,
                        setProfileHasInitializedAcceptedPosts,
                        profileScrollYAcceptedPosts,
                        setProfileScrollYAcceptedPosts,
                        profileElementRefAcceptedPosts,
                        profileIntersectingElementAcceptedPosts,
                        profilePendingPosts,
                        setProfilePendingPosts,
                        profileIsLoadingPendingPosts,
                        setProfileIsLoadingPendingPosts,
                        profileHasMorePendingPosts,
                        setProfileHasMorePendingPosts,
                        profileHasInitializedPendingPosts,
                        setProfileHasInitializedPendingPosts,
                        profileScrollYPendingPosts,
                        setProfileScrollYPendingPosts,
                        profileElementRefPendingPosts,
                        profileIntersectingElementPendingPosts,
                        profileRejectedPosts,
                        setProfileRejectedPosts,
                        profileIsLoadingRejectedPosts,
                        setProfileIsLoadingRejectedPosts,
                        profileHasMoreRejectedPosts,
                        setProfileHasMoreRejectedPosts,
                        profileHasInitializedRejectedPosts,
                        setProfileHasInitializedRejectedPosts,
                        profileScrollYRejectedPosts,
                        setProfileScrollYRejectedPosts,
                        profileElementRefRejectedPosts,
                        profileIntersectingElementRejectedPosts,
                        profileArchivedPosts,
                        setProfileArchivedPosts,
                        profileIsLoadingArchivedPosts,
                        setProfileIsLoadingArchivedPosts,
                        profileHasMoreArchivedPosts,
                        setProfileHasMoreArchivedPosts,
                        profileHasInitializedArchivedPosts,
                        setProfileHasInitializedArchivedPosts,
                        profileScrollYArchivedPosts,
                        setProfileScrollYArchivedPosts,
                        profileElementRefArchivedPosts,
                        profileIntersectingElementArchivedPosts,
                        profileViewedPosts,
                        setProfileViewedPosts,
                        profileIsLoadingViewedPosts,
                        setProfileIsLoadingViewedPosts,
                        profileHasMoreViewedPosts,
                        setProfileHasMoreViewedPosts,
                        profileHasInitializedViewedPosts,
                        setProfileHasInitializedViewedPosts,
                        profileScrollYViewedPosts,
                        setProfileScrollYViewedPosts,
                        profileElementRefViewedPosts,
                        profileIntersectingElementViewedPosts,

                        profileAcceptedComments,
                        setProfileAcceptedComments,
                        profileIsLoadingAcceptedComments,
                        setProfileIsLoadingAcceptedComments,
                        profileHasMoreAcceptedComments,
                        setProfileHasMoreAcceptedComments,
                        profileHasInitializedAcceptedComments,
                        setProfileHasInitializedAcceptedComments,
                        profileScrollYAcceptedComments,
                        setProfileScrollYAcceptedComments,
                        profileElementRefAcceptedComments,
                        profileIntersectingElementAcceptedComments,
                        profilePendingComments,
                        setProfilePendingComments,
                        profileIsLoadingPendingComments,
                        setProfileIsLoadingPendingComments,
                        profileHasMorePendingComments,
                        setProfileHasMorePendingComments,
                        profileHasInitializedPendingComments,
                        setProfileHasInitializedPendingComments,
                        profileScrollYPendingComments,
                        setProfileScrollYPendingComments,
                        profileElementRefPendingComments,
                        profileIntersectingElementPendingComments,
                        profileRejectedComments,
                        setProfileRejectedComments,
                        profileIsLoadingRejectedComments,
                        setProfileIsLoadingRejectedComments,
                        profileHasMoreRejectedComments,
                        setProfileHasMoreRejectedComments,
                        profileHasInitializedRejectedComments,
                        setProfileHasInitializedRejectedComments,
                        profileScrollYRejectedComments,
                        setProfileScrollYRejectedComments,
                        profileElementRefRejectedComments,
                        profileIntersectingElementRejectedComments,
                        profileArchivedComments,
                        setProfileArchivedComments,
                        profileIsLoadingArchivedComments,
                        setProfileIsLoadingArchivedComments,
                        profileHasMoreArchivedComments,
                        setProfileHasMoreArchivedComments,
                        profileHasInitializedArchivedComments,
                        setProfileHasInitializedArchivedComments,
                        profileScrollYArchivedComments,
                        setProfileScrollYArchivedComments,
                        profileElementRefArchivedComments,
                        profileIntersectingElementArchivedComments,
                        profileViewedComments,
                        setProfileViewedComments,
                        profileIsLoadingViewedComments,
                        setProfileIsLoadingViewedComments,
                        profileHasMoreViewedComments,
                        setProfileHasMoreViewedComments,
                        profileHasInitializedViewedComments,
                        setProfileHasInitializedViewedComments,
                        profileScrollYViewedComments,
                        setProfileScrollYViewedComments,
                        profileElementRefViewedComments,
                        profileIntersectingElementViewedComments,

                        profileFollowers,
                        setProfileFollowers,
                        profileIsLoadingFollowers,
                        setProfileIsLoadingFollowers,
                        profileHasMoreFollowers,
                        setProfileHasMoreFollowers,
                        profileHasInitializedFollowers,
                        setProfileHasInitializedFollowers,
                        profileScrollYFollowers,
                        setProfileScrollYFollowers,
                        profileElementRefFollowers,
                        profileIntersectingElementFollowers,
                        profileFollowing,
                        setProfileFollowing,
                        profileIsLoadingFollowing,
                        setProfileIsLoadingFollowing,
                        profileHasMoreFollowing,
                        setProfileHasMoreFollowing,
                        profileHasInitializedFollowing,
                        setProfileHasInitializedFollowing,
                        profileScrollYFollowing,
                        setProfileScrollYFollowing,
                        profileElementRefFollowing,
                        profileIntersectingElementFollowing,
                      }}
                    >
                      <ScrollContext.Provider value={{ scrollRef }}>
                        {loadingUser && <Loading />}

                        {!loadingUser && (
                          <>
                            <NavBar />
                            <NavBarMobileBottom />
                            <NavBarMobileTop />

                            {showModal.type === 'POST_MODAL' && <PostModal />}

                            {showModal.type === 'COMMENT_MODAL' && (
                              <CommentModal />
                            )}

                            {showModal.type === 'CONFIRM_MODAL' && (
                              <ConfirmModal />
                            )}
                          </>
                        )}
                        {!loadingUser && (
                          <main
                            className={`relative left-0 top-0 mb-[76px] flex min-h-screen w-full flex-col gap-4 p-4 sm:mb-0 sm:pl-[300px]`}
                          >
                            <Routes>
                              <Route
                                path="admin"
                                element={
                                  user && user.user_role === 'SUPER_ADMIN' ? (
                                    <AdminLayout />
                                  ) : (
                                    <ForbiddenLayout />
                                  )
                                }
                              >
                                <Route
                                  index
                                  element={<AdminPendingPostsNestedLayout />}
                                />
                                <Route
                                  path="pending-posts"
                                  element={<AdminPendingPostsNestedLayout />}
                                />
                                <Route
                                  path="accepted-posts"
                                  element={<AdminAcceptedPostsNestedLayout />}
                                />
                                <Route
                                  path="rejected-posts"
                                  element={<AdminRejectedPostsNestedLayout />}
                                />
                              </Route>
                              <Route path="/" element={<HomeLayout />} />
                              <Route
                                path="log-in"
                                element={
                                  user ? <NoContentLayout /> : <LogInLayout />
                                }
                              />
                              <Route
                                path="sign-up"
                                element={
                                  user ? <NoContentLayout /> : <SignUpLayout />
                                }
                              />
                              <Route
                                path="forgot-password"
                                element={<ForgotPasswordLayout />}
                              />
                              <Route
                                path="reset-password"
                                element={
                                  user ? (
                                    <ResetPasswordLayout />
                                  ) : (
                                    <NoContentLayout />
                                  )
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
                                  element={
                                    <ExploreDiscussionPostsNestedLayout />
                                  }
                                />
                                <Route
                                  path="profiles"
                                  element={<ExploreProfilesNestedLayout />}
                                />
                                <Route path="*" element={<NotFoundLayout />} />
                              </Route>
                              <Route path="post/:id" element={<PostLayout />} />
                              <Route
                                path="comment/:id"
                                element={<CommentLayout />}
                              />

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
                                    <NotificationsLayout />
                                  ) : (
                                    <NoContentLayout />
                                  )
                                }
                              >
                                <Route
                                  index
                                  element={
                                    <NotificationsPendingPostNotificationsNestedLayout />
                                  }
                                />
                                <Route
                                  path="accepted-posts"
                                  element={
                                    <NotificationsAcceptedPostNotificationsNestedLayout />
                                  }
                                />
                                <Route
                                  path="pending-posts"
                                  element={
                                    <NotificationsPendingPostNotificationsNestedLayout />
                                  }
                                />
                                <Route
                                  path="rejected-posts"
                                  element={
                                    <NotificationsRejectedPostNotificationsNestedLayout />
                                  }
                                />
                                <Route
                                  path="likes"
                                  element={<NotificationsLikesNestedLayout />}
                                />
                                <Route
                                  path="views"
                                  element={<NotificationsViewsNestedLayout />}
                                />
                                <Route
                                  path="followers"
                                  element={
                                    <NotificationsFollowersNestedLayout />
                                  }
                                />
                                <Route
                                  path="comments"
                                  element={
                                    <NotificationsCommentsNestedLayout />
                                  }
                                />
                                <Route path="*" element={<NotFoundLayout />} />
                              </Route>
                              <Route
                                path="settings"
                                element={<SettingsLayout />}
                              />
                              <Route path="*" element={<NotFoundLayout />} />
                            </Routes>
                          </main>
                        )}
                      </ScrollContext.Provider>
                    </ExploreContext.Provider>
                  </FullscreenContext.Provider>
                </ScreenResizeContext.Provider>
              </ModalContext.Provider>
            </NotificationsContext.Provider>
          </AdminContext.Provider>
        </UserContext.Provider>
      </SessionContext.Provider>
    </BrowserRouter>
  );
}

export default App;

/* 
    BACKLOG:

    - profile page
    - avatars table and uploads

    - comment views
    - comment likes



    - delete comment
    - archive, unarchive comment

    - admin - show which admin (user) accepted/rejected content in accepted and rejected page views

    - FIX: convert any contexts that are used in very few places to state and pass as props instead
    - FIX: add gap between navbar and main page
    - FIX: make sure all state and url state is up to date whenever changes are made - we do not want stale data
    - FIX: explore posts page overflows x
    - FIX: image and video views are glitchy when being rendered
    - FIX: scrollY across pages eventually resets to 0 after a few navigations, need to add infinite scrolling on each discussion page
    - FIX: make sure only the user can access their archived comments and posts through url and selection
    - FIX: make sure users cannot access archived content - check between page navigations, page refreshes, etc.
    - FIX: make sure custom inputs can listen to important keys (enter, spacebar, etc.)

    - unarchive post
    - database functions for fetching archived content - since by default all functions only get unarchived content
    - views - a user can see their own only once, but can see others multiple times

    - notifications
      - is_read
      - auto-expire notifications within x time
      - auto-delete rejected posts within 24 hours

    - counts
      - # of followers,
      - # of following,
      - # of posts,
      - # of post comments,
      - # of post likes
      - # of post comment likes,
      - # of unique post views
      - # of repeated post views
      - # of unique post comment views
      - # of repeated post comment views

    - home - count for newly released content to show in the navbar
    - search page when a user clicks on a suggested search/load more searches? + filters and sorts
    
    - allow user to select a video frame to set as their thumbnail
    - allow image reordering
    - show preview of post before submission
    - @ mentions



    FUTURE:
    - delete account - remove all of a user's data
    - deactivate account - mark user as 'inactive' and keep all content, simply hide the user info from posts
    - verified users, banned users
    - captcha protection when signing up/logging in
    - RLS configuration for all tables
    - stripe subscriptions configuration - https://stripe.com/en-ca/payments
    - SMTP server configuration - https://supabase.com/docs/guides/auth/auth-smtp
    - auth email templates configuration - https://supabase.com/docs/guides/auth/auth-email-templates
    - rate limit supabase requests for data and storage to avoid potential spam - ex: when a user constantly refreshes the page
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
