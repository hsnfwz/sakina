import { useEffect, useState } from "react";
import {
  ModalContext,
  ScreenSizeContext,
  SessionContext,
  UserContext,
} from "./common/contexts";
import { supabase } from "./common/supabase";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import NavBarMobile from "./components/NavBarMobile.jsx";

import AdminLayout from "./layouts/AdminLayout.jsx";
import ExploreLayout from "./layouts/ExploreLayout.jsx";
import HomeLayout from "./layouts/HomeLayout.jsx";
import LearnLayout from "./layouts/LearnLayout.jsx";
import LogInLayout from "./layouts/LogInLayout.jsx";
import NotFoundLayout from "./layouts/NotFoundLayout.jsx";
import NotificationsLayout from "./layouts/NotificationsLayout.jsx";
import ProfileLayout from "./layouts/ProfileLayout.jsx";
import ResetPasswordLayout from "./layouts/ResetPasswordLayout.jsx";
import SettingsLayout from "./layouts/SettingsLayout.jsx";
import SignUpLayout from "./layouts/SignUpLayout.jsx";

import Loading from "./components/Loading.jsx";

import { BrowserRouter, Route, Routes } from "react-router";
import NavBarModal from "./components/NavBarModal.jsx";
import PostModal from "./components/PostModal.jsx";
import QuestionModal from "./components/QuestionModal.jsx";
import ForbiddenLayout from "./layouts/ForbiddenLayout.jsx";
import ForgotPasswordLayout from "./layouts/ForgotPasswordLayout.jsx";
import NoContentLayout from "./layouts/NoContentLayout.jsx";
import PostLayout from "./layouts/PostLayout.jsx";
import QuestionLayout from "./layouts/QuestionLayout.jsx";

import CommentModal from "./components/CommentModal.jsx";

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(null);

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
        if (showModal) setShowModal(null);
      }
    });
  }, [showModal]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenSize(window.innerWidth);
    });
  }, []);

  return (
    <BrowserRouter>
      <SessionContext.Provider value={{ session, setSession }}>
        <UserContext.Provider value={{ loadingUser, user, setUser }}>
          <ModalContext.Provider value={{ showModal, setShowModal }}>
            <ScreenSizeContext.Provider value={{ screenSize }}>
              {loadingUser && <Loading />}
              {!loadingUser && (
                <>
                  <NavBar />
                  <NavBarMobile />

                  {showModal && showModal.type === "NAVBAR_MODAL" && <NavBarModal />}

                  {showModal && showModal.type === "POST_MODAL" && <PostModal />}

                  {showModal && showModal.type === "QUESTION_MODAL" && <QuestionModal />}

                  {showModal && showModal.type === "COMMENT_MODAL" && <CommentModal />}
                </>
              )}

              {!loadingUser && (
                <main
                  id="app"
                  className={`relative left-0 top-0 mb-[88px] flex min-h-screen w-full flex-col gap-4 p-4 lg:mb-0 lg:py-4 lg:pl-[88px] lg:pr-4`}
                >
                  <Routes>
                    <Route path="/" element={<HomeLayout />} />
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
                    <Route
                      path="notifications"
                      element={
                        user ? <NotificationsLayout /> : <NoContentLayout />
                      }
                    />
                    <Route path="explore" element={<ExploreLayout />} />
                    <Route path="posts/:id" element={<PostLayout />} />
                    <Route path="questions" element={<LearnLayout />} />
                    <Route path="questions/:id" element={<QuestionLayout />} />
                    <Route path="users/:username" element={<ProfileLayout />} />
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
                  <Footer />
                </main>
              )}
            </ScreenSizeContext.Provider>
          </ModalContext.Provider>
        </UserContext.Provider>
      </SessionContext.Provider>
    </BrowserRouter>
  );
}

export default App;

/* 
    TODO:
    - auto refresh lists when a question or comment is added
    - listen to 'enter' key when interacting with buttons and inputs
    - boost questions to get them more attention
    - nested comments - tree view with best practices https://app.uxcel.com/courses/common-patterns/comments-best-practices-499 - also only infinite load top-level comments, all nested comments must be expanded by the user manually
    - post comments
    - edit/delete post
    - edit/delete question
    - infinite scroll save page state when navigating between explore page and post page (same with questions)
    - deactivate account - mark user as 'inactive' and keep all content, simply hide the user info from posts
    - edit posts + files + history of edits
    - pin posts (ordered by post date)
    - show trending users (based on followers) and posts (based on likes and views)
    - counts for likes, number of posts, followers, views (unique), views (repeated)
    - hashtags # and mentions @ and annotations for videos (ex: 0:30 plays video from that point)
    - stories (24 hours) + archived stories
    - allow user to select a video frame to set as their thumbnail
    - allow users to retry failed uploads
    - allow image reordering
    - allow user to select image ratio for a carousel post (1:1, 3:2, 5:4, 16:9 and more)
    - show preview of post before submission
    - filters and sorts for content
    - scheduled posts
    - expired posts
    - analytics page
    - reward system to encourage good, quality content and interactions
    - custom video control UI - play/pause, progress time + bar, mute/unmute, volume, fullscreen, thumbnail (play video after showing thumbnail for 3 seconds)
    - allow users to bypass post reviews when they earn enought trust based on their activity history
    - banned users (when signing up or logging in, check the error code to avoid banned users from entering the platform) user_banned
    - captcha protection when signing up/logging in
    - RLS configuration for all tables
    - stripe subscriptions configuration - https://stripe.com/en-ca/payments
    - SMTP server configuration - https://supabase.com/docs/guides/auth/auth-smtp
    - auth email templates configuration - https://supabase.com/docs/guides/auth/auth-email-templates
    - rate limit supabase requests for data and storage to avoid potential spam

    Costs
    - $25/month - Supabase
    - $20/month - Vercel
    - $20/year - Namecheap
    - 2.9% + 0.30C - Stripe
    - $5-25/month - SMTP Server Provider
    --- ~ $100/month ($1,200/year)
    --- goal: get 12 paying members to cover year 1 costs

    Free Version
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

    Pro Version
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

    FUTURE:
    - post boosting
    - ecommerce
    - album allows the user to group related photos and playlist allows the user to group related videos
    - livestreaming - mobile only unless i can access all cameras using an api
    - mobile app
    - email change page flow
    - redesign your portfolio to be a minimalist design with amazing break down of 4 websites to showcase (including purpose, technologies, screenshots of designs and database tables, video demo, testing account for the user to play with the app, descriptions of various minor and major features and how they were implemented, apis used, etc) - make the websites into case studies almost - tailwind docs inspiration?? i want it to look like a blue print and have a clean look
  */
