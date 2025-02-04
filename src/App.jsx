import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import {
  ModalContext,
  ScreenResizeContext,
  SessionContext,
  UserContext,
  FullscreenContext,
  ExploreContext,
  NotificationsContext,
} from './common/contexts';
import { useElementIntersection } from './common/hooks.js';
import { supabase, getNotificationsCountByProfileId } from './common/supabase';
import CommentModal from './components/CommentModal.jsx';
import Loading from './components/Loading.jsx';
import NavBar from './components/NavBar';
import NavBarMobileTop from './components/NavBarMobileTop.jsx';
import NavBarMobileBottom from './components/NavBarMobileBottom.jsx';
import CreateModal from './components/CreateModal.jsx';
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

import PostsNestedLayout from './nested-layouts/PostsNestedLayout.jsx';
import QuestionsNestedLayout from './nested-layouts/QuestionsNestedLayout.jsx';
import ProfilesNestedLayout from './nested-layouts/ProfilesNestedLayout.jsx';

import PostNestedLayout from './nested-layouts/PostNestedLayout.jsx';
import QuestionNestedLayout from './nested-layouts/QuestionNestedLayout.jsx';
import ProfileNestedLayout from './nested-layouts/ProfileNestedLayout.jsx';

import ProfileAcceptedPostsNestedLayout from './nested-layouts/ProfileAcceptedPostsNestedLayout.jsx';
import ProfilePendingPostsNestedLayout from './nested-layouts/ProfilePendingPostsNestedLayout.jsx';
import ProfileRejectedPostsNestedLayout from './nested-layouts/ProfileRejectedPostsNestedLayout.jsx';
import ProfileArchivedPostsNestedLayout from './nested-layouts/ProfileArchivedPostsNestedLayout.jsx';
import ProfileViewedPostsNestedLayout from './nested-layouts/ProfileViewedPostsNestedLayout.jsx';
import ProfileFollowersNestedLayout from './nested-layouts/ProfileFollowersNestedLayout.jsx';
import ProfileFollowingNestedLayout from './nested-layouts/ProfileFollowingNestedLayout.jsx';

import NotificationsAcceptedPostsNestedLayout from './nested-layouts/NotificationsAcceptedPostsNestedLayout.jsx';
import NotificationsPendingPostsNestedLayout from './nested-layouts/NotificationsPendingPostsNestedLayout.jsx';
import NotificationsRejectedPostsNestedLayout from './nested-layouts/NotificationsRejectedPostsNestedLayout.jsx';
import NotificationsLikesNestedLayout from './nested-layouts/NotificationsLikesNestedLayout.jsx';
import NotificationsViewsNestedLayout from './nested-layouts/NotificationsViewsNestedLayout.jsx';
import NotificationsCommentsNestedLayout from './nested-layouts/NotificationsCommentsNestedLayout.jsx';
import NotificationsFollowersNestedLayout from './nested-layouts/NotificationsFollowersNestedLayout.jsx';

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [screenResize, setScreenResize] = useState(0);
  const [showModal, setShowModal] = useState({
    type: null,
    data: null,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [isLoadingNotificationsCount, setIsLoadingNotificationsCount] =
    useState(false);

  const [acceptedPosts, setAcceptedPosts] = useState([]);
  const [isLoadingAcceptedPosts, setIsLoadingAcceptedPosts] = useState(false);
  const [hasMoreAcceptedPosts, setHasMoreAcceptedPosts] = useState(true);
  const [hasInitializedAcceptedPosts, setHasInitializedAcceptedPosts] =
    useState(false);
  const [scrollYAcceptedPosts, setScrollYAcceptedPosts] = useState(0);
  const [elementRefAcceptedPosts, intersectingElementAcceptedPosts] =
    useElementIntersection();

  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true);
  const [hasInitializedQuestions, setHasInitializedQuestions] = useState(false);
  const [scrollYQuestions, setScrollYQuestions] = useState(0);
  const [elementRefQuestions, intersectingElementQuestions] =
    useElementIntersection();

  const [profiles, setProfiles] = useState([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [hasMoreProfiles, setHasMoreProfiles] = useState(true);
  const [hasInitializedProfiles, setHasInitializedProfiles] = useState(false);
  const [scrollYProfiles, setScrollYProfiles] = useState(0);
  const [elementRefProfiles, intersectingElementProfiles] =
    useElementIntersection();

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
    async function initializeNotifications() {
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
      initializeNotifications();
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
          <ModalContext.Provider value={{ showModal, setShowModal }}>
            <ScreenResizeContext.Provider value={{ screenResize }}>
              <FullscreenContext.Provider
                value={{ isFullscreen, setIsFullscreen }}
              >
                <ExploreContext.Provider
                  value={{
                    acceptedPosts,
                    setAcceptedPosts,
                    elementRefAcceptedPosts,
                    intersectingElementAcceptedPosts,
                    scrollYAcceptedPosts,
                    setScrollYAcceptedPosts,
                    hasMoreAcceptedPosts,
                    setHasMoreAcceptedPosts,
                    isLoadingAcceptedPosts,
                    setIsLoadingAcceptedPosts,
                    hasInitializedAcceptedPosts,
                    setHasInitializedAcceptedPosts,
                    questions,
                    setQuestions,
                    elementRefQuestions,
                    intersectingElementQuestions,
                    scrollYQuestions,
                    setScrollYQuestions,
                    hasMoreQuestions,
                    setHasMoreQuestions,
                    isLoadingQuestions,
                    setIsLoadingQuestions,
                    hasInitializedQuestions,
                    setHasInitializedQuestions,
                    profiles,
                    setProfiles,
                    elementRefProfiles,
                    intersectingElementProfiles,
                    scrollYProfiles,
                    setScrollYProfiles,
                    hasMoreProfiles,
                    setHasMoreProfiles,
                    isLoadingProfiles,
                    setIsLoadingProfiles,
                    hasInitializedProfiles,
                    setHasInitializedProfiles,
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
                    {loadingUser && (
                      <div className="flex">
                        <Loading />
                      </div>
                    )}

                    {!loadingUser && (
                      <>
                        <NavBar />
                        <NavBarMobileBottom />
                        <NavBarMobileTop />

                        {showModal && showModal.type === 'CREATE_MODAL' && (
                          <CreateModal />
                        )}

                        {showModal && showModal.type === 'COMMENT_MODAL' && (
                          <CommentModal />
                        )}
                      </>
                    )}
                    {!loadingUser && (
                      <main
                        className={`relative left-0 top-0 mb-[76px] flex min-h-screen w-full flex-col gap-4 p-4 sm:mb-0 sm:pl-[300px]`}
                      >
                        <Routes>
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
                            <Route index element={<PostsNestedLayout />} />
                            <Route
                              path="posts"
                              element={<PostsNestedLayout />}
                            />
                            <Route
                              path="questions"
                              element={<QuestionsNestedLayout />}
                            />
                            <Route
                              path="profiles"
                              element={<ProfilesNestedLayout />}
                            />
                            <Route path="*" element={<NotFoundLayout />} />
                          </Route>

                          <Route
                            path="post/:id"
                            element={<PostNestedLayout />}
                          />
                          <Route
                            path="question/:id"
                            element={<QuestionNestedLayout />}
                          />

                          <Route
                            path=":username"
                            element={<ProfileNestedLayout />}
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
                                <NotificationsAcceptedPostsNestedLayout />
                              }
                            />
                            <Route
                              path="accepted-posts"
                              element={
                                <NotificationsAcceptedPostsNestedLayout />
                              }
                            />
                            <Route
                              path="pending-posts"
                              element={
                                <NotificationsPendingPostsNestedLayout />
                              }
                            />
                            <Route
                              path="rejected-posts"
                              element={
                                <NotificationsRejectedPostsNestedLayout />
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
                              element={<NotificationsFollowersNestedLayout />}
                            />
                            <Route
                              path="comments"
                              element={<NotificationsCommentsNestedLayout />}
                            />
                            <Route path="*" element={<NotFoundLayout />} />
                          </Route>

                          <Route path="settings" element={<SettingsLayout />} />
                          <Route
                            path="admin"
                            element={
                              user && user.user_role === 'SUPER_ADMIN' ? (
                                <AdminLayout />
                              ) : (
                                <ForbiddenLayout />
                              )
                            }
                          />
                          <Route path="*" element={<NotFoundLayout />} />
                        </Routes>
                      </main>
                    )}
                  </NotificationsContext.Provider>
                </ExploreContext.Provider>
              </FullscreenContext.Provider>
            </ScreenResizeContext.Provider>
          </ModalContext.Provider>
        </UserContext.Provider>
      </SessionContext.Provider>
    </BrowserRouter>
  );
}

export default App;

/* 
    BACKLOG:
    - FIX: scrollY across pages eventually resets to 0 after a few navigations

    - accept, pending, reject questions
    - make comments discoverable /comment/commentid
    - post comments

    - is_read
    - auto-expire notifications within x time
    - auto-delete rejected posts within 24 hours

    - views - a user can see their own only once, but can see others multiple times
    - counts for likes, number of posts, followers, views (unique), views (repeated)
    - delete question, post, comment
    - archive question, post, comment
 
    - pin posts
    - scheduled posts
    - expired posts
    - boost questions to get them more attention - check to make sure you havent boosted a quesiton before doing so to avoid artificial inflation
    - search page when a user clicks on a suggested search/load more searches? + filters and sorts
    
    - allow user to select a video frame to set as their thumbnail
    - allow image reordering
    - show preview of post before submission
    - hashtags # and mentions @ and annotations for videos (ex: 0:30 plays video from that point) and formatted links w/ preview option - dont forget to check for title before submission!!!
    - make sure custom inputs can listen to important keys (enter, spacebar, etc.)
    - video play and pause with space bar

    - deactivate account - mark user as 'inactive' and keep all content, simply hide the user info from posts
    - verified users, banned users
    - captcha protection when signing up/logging in
    - RLS configuration for all tables
    - stripe subscriptions configuration - https://stripe.com/en-ca/payments
    - SMTP server configuration - https://supabase.com/docs/guides/auth/auth-smtp
    - auth email templates configuration - https://supabase.com/docs/guides/auth/auth-email-templates
    - rate limit supabase requests for data and storage to avoid potential spam

    FUTURE:
    - edit quesiton, post/files, comment + edit history
    - notifications for activity by people you follow
    - explore: have a carousel at the top showcasing the best of the best posts as a way to reward users for high quality content
    - analytics page
    - stories (24 hours) + archived stories
    - video timestamps similar to youtube
    - groups - title/description/posts + masonry view
    - reward system to encourage good, quality content and interactions
    - message and sharing
    - post boosting - appears on everyone's feed
    - ecommerce
    - livestreaming
    - email change page flow

    COSTS
    - $25/month - Supabase
    - $20/month - Vercel
    - $20/year - Namecheap
    - 2.9% + 0.30C - Stripe
    - $5-25/month - SMTP Server Provider
    --- ~ $100/month ($1,200/year)
    --- goal: get 12 paying members to cover year 1 costs

    FREE
    - $0 with ads
    - upload up to 5 files per post
    - max 2 GB per file
    - review post within 24 hours
    - no priority search (for post and user searches)
    - no post and user boosting
    - no analytics page
    - no scheduled posts
    - no expired posts
    - no priority support
    - no supporter badge

    PRO
    - https://stripe.com/en-ca/payments/link
    - $100 per year or pay $250 for 3 years (save $50) or $400 for 5 years (save $100) with no ads
    - upload up to 20 files per post (4x more!)
    - max 10GB per file (5x more!)
    - review post within 12 hours (50% shorter!)
    - priority search (for post and user searches)
    - post and user boosting
    - analytics page
    - scheduled posts
    - expired posts
    - priority support
    - supporter badge
  */
