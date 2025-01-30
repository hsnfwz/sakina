import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import {
  ModalContext,
  ScreenResizeContext,
  ScrollDataContext,
  SessionContext,
  UserContext,
  FullscreenContext,
} from "./common/contexts";
import { supabase } from "./common/supabase";
import CommentModal from "./components/CommentModal.jsx";
import Loading from "./components/Loading.jsx";
import NavBar from "./components/NavBar";
import NavBarMobile from "./components/NavBarMobile.jsx";
import NavBarModal from "./components/NavBarModal.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ExploreLayout from "./layouts/ExploreLayout.jsx";
import ForbiddenLayout from "./layouts/ForbiddenLayout.jsx";
import ForgotPasswordLayout from "./layouts/ForgotPasswordLayout.jsx";
import HomeLayout from "./layouts/HomeLayout.jsx";
import LearnLayout from "./layouts/LearnLayout.jsx";
import LogInLayout from "./layouts/LogInLayout.jsx";
import NoContentLayout from "./layouts/NoContentLayout.jsx";
import NotFoundLayout from "./layouts/NotFoundLayout.jsx";
import NotificationsLayout from "./layouts/NotificationsLayout.jsx";
import PostLayout from "./layouts/PostLayout.jsx";
import ProfileLayout from "./layouts/ProfileLayout.jsx";
import QuestionLayout from "./layouts/QuestionLayout.jsx";
import ResetPasswordLayout from "./layouts/ResetPasswordLayout.jsx";
import SettingsLayout from "./layouts/SettingsLayout.jsx";
import SignUpLayout from "./layouts/SignUpLayout.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CreateModal from "./components/CreateModal.jsx";

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [screenResize, setScreenResize] = useState(0);
  const [showModal, setShowModal] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollData, setScrollData] = useState({
    type: "",
    data: [],
    hasMoreData: true,
    scrollY: 0,
  });

  async function getUser(session, abortController) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
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
    if (showModal) {
      const body = document.querySelector("body");
      body.classList.add("overflow-hidden");
      body.classList.remove("overflow-auto");
    } else {
      const body = document.querySelector("body");
      body.classList.add("overflow-auto");
      body.classList.remove("overflow-hidden");
    }
  }, [showModal]);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setShowModal(null);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenResize(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
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
              <ScrollDataContext.Provider value={{ scrollData, setScrollData }}>
                <FullscreenContext.Provider
                  value={{ isFullscreen, setIsFullscreen }}
                >
                  {loadingUser && <Loading />}
                  {!loadingUser && (
                    <>
                      <NavBar />
                      <NavBarMobile />

                      {showModal && showModal.type === "NAVBAR_MODAL" && (
                        <NavBarModal />
                      )}

                      {showModal && showModal.type === "CREATE_MODAL" && (
                        <CreateModal />
                      )}

                      {showModal && showModal.type === "COMMENT_MODAL" && (
                        <CommentModal />
                      )}
                    </>
                  )}

                  {!loadingUser && (
                    <main
                      id="app"
                      className={`relative left-0 top-0 mb-[76px] flex min-h-screen w-full flex-col gap-4 px-4 pb-4 pt-0 sm:mb-0 sm:pl-[216px]`}
                    >
                      <SearchBar />
                      <Routes>
                        <Route path="/" element={<HomeLayout />} />
                        <Route
                          path="log-in"
                          element={user ? <NoContentLayout /> : <LogInLayout />}
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
                            user ? <ResetPasswordLayout /> : <NoContentLayout />
                          }
                        />
                        <Route
                          path="notifications"
                          element={
                            user ? <NotificationsLayout /> : <NoContentLayout />
                          }
                        />
                        <Route path="explore" element={<ExploreLayout />} />
                        <Route path="posts/:id" element={<PostLayout />} />
                        <Route path="questions" element={<LearnLayout />} />
                        <Route
                          path="questions/:id"
                          element={<QuestionLayout />}
                        />
                        <Route
                          path="profile/:username"
                          element={<ProfileLayout />}
                        />
                        <Route path="settings" element={<SettingsLayout />} />
                        <Route
                          path="admin"
                          element={
                            user && user.user_role === "SUPER_ADMIN" ? (
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
                </FullscreenContext.Provider>
              </ScrollDataContext.Provider>
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
    - infinite scroll admin page
    - fix realtime bug where setting new state loses the previous array state
    - revamp profile layout - lots of bugs
    - search bar questions bug
    - show preview of post before submission
    - auto delete rejected posts within 24 hours using CRON job with a "delete_at" unless user resubmits it and becomes "PENDING" again
    - show trending users (based on followers) and posts (based on likes and views)
    - search bar history search terms for quick access
    - view history (not the same as views as views only count users that viewed posts other than their own)
    - create custom toggle - similar to how we did the slider
    - make sure custom inputs can listen to important keys (enter, spacebar, etc.)
    - consider making the following global state to always keep track and never reset unless the user refreshes the page so we can save on making requests
    --- all questions a user has loaded
    --- all posts a user has loaded
    --- all profile-based data (the user's profile not random profiles)
    - boost questions to get them more attention - check to make sure you havent boosted a quesiton before doing so to avoid artificial inflation
    - auto refresh lists when a question or comment is added
    - move questions to explore page
    - pages for search results (posts, questions, users) when a user clicks on 'see more results' in the search bar
    - post comments
    - edit/delete post
    - edit/delete question
    - deactivate account - mark user as 'inactive' and keep all content, simply hide the user info from posts
    - edit posts + files + history of edits
    - counts for likes, number of posts, followers, views (unique), views (repeated)
    - hashtags # and mentions @ and annotations for videos (ex: 0:30 plays video from that point) and formatted links w/ preview option - dont forget to check for title before submission!!!
    - allow user to select a video frame to set as their thumbnail
    - allow image reordering
    - filters and sorts for content
    - scheduled posts
    - expired posts
    - analytics page
    - allow users to bypass post reviews when they earn enought trust based on their activity history
    - banned users (when signing up or logging in, check the error code to avoid banned users from entering the platform) user_banned
    - captcha protection when signing up/logging in
    - RLS configuration for all tables
    - stripe subscriptions configuration - https://stripe.com/en-ca/payments
    - SMTP server configuration - https://supabase.com/docs/guides/auth/auth-smtp
    - auth email templates configuration - https://supabase.com/docs/guides/auth/auth-email-templates
    - rate limit supabase requests for data and storage to avoid potential spam

    FUTURE:
    - pin posts
    - stories (24 hours) + archived stories
    - video timestamps similar to youtube
    - groups - title/description/posts + masonry view
    - reward system to encourage good, quality content and interactions
    - message and sharing
    - post boosting
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
