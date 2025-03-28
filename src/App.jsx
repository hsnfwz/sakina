// import { supabase } from './common/supabase';
// import { getNotificationsCountByProfileId } from './common/database/notifications.js';
// import { getPendingPostsCount } from './common/database/posts.js';
// import CommentModal from './modals/CommentModal.jsx';
// import Loading from './components/Loading.jsx';
// import NavBar from './components/NavBar';
// import NavBarMobileTop from './components/NavBarMobileTop.jsx';
// import NavBarMobileBottom from './components/NavBarMobileBottom.jsx';
// import CreateModal from './modals/CreateModal.jsx';

// import ConfirmModal from './modals/ConfirmModal.jsx';
// import AvatarModal from './modals/AvatarModal.jsx';

// import { getFollowersBySenderProfileId } from './common/database/followers.js';
// import { getPostsCountByProfileId } from './common/database/posts.js';

// function App() {
//   const [session, setSession] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loadingUser, setLoadingUser] = useState(true);

//   const scrollRef = useRef({
//     exploreAcceptedImagePosts: {
//       scrollX: 0,
//       scrollY: 0,
//     },
//     exploreAcceptedVideoPosts: {
//       scrollX: 0,
//       scrollY: 0,
//     },
//     exploreAcceptedDiscussionPosts: {
//       scrollX: 0,
//       scrollY: 0,
//     },
//     exploreProfiles: {
//       scrollX: 0,
//       scrollY: 0,
//     },
//     notifications: {
//       scrollX: 0,
//       scrollY: 0,
//     },
//   });

//   const [showModal, setShowModal] = useState({
//     type: null,
//     data: null,
//   });

//   const [adminPendingPosts, setAdminPendingPosts] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [homeAcceptedPosts, setHomeAcceptedPosts] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [notifications, setNotifications] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [exploreAcceptedImagePosts, setExploreAcceptedImagePosts] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [exploreHorizontalVideos, setExploreHorizontalVideos] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [exploreVerticalVideos, setExploreVerticalVideos] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [exploreAcceptedVideoPosts, setExploreAcceptedVideoPosts] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [exploreAcceptedDiscussionPosts, setExploreAcceptedDiscussionPosts] =
//     useState({
//       data: [],
//       hasMore: true,
//       hasInitialized: false,
//     });

//   const [exploreProfiles, setExploreProfiles] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profileAcceptedPosts, setProfileAcceptedPosts] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profilePendingPosts, setProfilePendingPosts] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profileRejectedPosts, setProfileRejectedPosts] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profileArchivedPosts, setProfileArchivedPosts] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profileViewedPosts, setProfileViewedPosts] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profileAcceptedComments, setProfileAcceptedComments] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profilePendingComments, setProfilePendingComments] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profileRejectedComments, setProfileRejectedComments] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profileArchivedComments, setProfileArchivedComments] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profileViewedComments, setProfileViewedComments] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profileFollowers, setProfileFollowers] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [profileFollowing, setProfileFollowing] = useState({
//     data: [],
//     hasMore: true,
//     hasInitialized: false,
//   });

//   const [activeProfile, setActiveProfile] = useState(null);

//   async function getUser(session, abortController) {
//     const { data, error } = await supabase
//       .from('users')
//       .select('*, avatar:avatar_id(*)')
//       .eq('id', session.user.id)
//       .abortSignal(abortController.signal);

//     if (error) {
//       console.log(error);
//     } else {
//       setUser(data[0]);
//     }
//   }

//   useEffect(() => {
//     async function getAuth() {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       setSession(session);

//       if (!session) setLoadingUser(false);
//     }

//     getAuth();
//   }, []);

//   useEffect(() => {
//     async function initialize() {
//       const abortController = new AbortController();

//       setLoadingUser(true);
//       await getUser(session, abortController);
//       setLoadingUser(false);

//       return () => {
//         abortController.abort();
//       };
//     }

//     if (session) {
//       initialize();
//     } else {
//       setUser(null);
//     }
//   }, [session]);

//   const [newPendingPostsCount, setNewPendingPostsCount] = useState(0);
//   const [pendingPostsCount, setPendingPostsCount] = useState(0);
//   const [isLoadingPendingPostsCount, setIsLoadingPendingPostsCount] =
//     useState(false);
//   const [pendingPostPayload, setPendingPostPayload] = useState(null);

//   useEffect(() => {
//     if (pendingPostPayload) {
//       setNewPendingPostsCount(newPendingPostsCount + 1);
//       setPendingPostsCount(pendingPostsCount + 1);
//     }
//   }, [pendingPostPayload]);

//   useEffect(() => {
//     async function initialize() {
//       setIsLoadingPendingPostsCount(true);
//       const { count } = await getPendingPostsCount();
//       setPendingPostsCount(count);
//       setIsLoadingPendingPostsCount(false);

//       const postChangesChannel = supabase
//         .channel('pending-post-changes')
//         .on(
//           'postgres_changes',
//           {
//             event: 'INSERT',
//             schema: 'public',
//             table: 'posts',
//             filter: 'status=eq.PENDING',
//           },
//           (payload) => {
//             setPendingPostPayload(payload);
//           }
//         )
//         .on(
//           'postgres_changes',
//           {
//             event: 'UPDATE',
//             schema: 'public',
//             table: 'posts',
//             filter: 'status=eq.PENDING',
//           },
//           (payload) => {
//             setPendingPostPayload(payload);
//           }
//         )
//         .subscribe();

//       return () => {
//         postChangesChannel.unsubscribe();
//       };
//     }

//     if (user && user.user_role === 'SUPER_ADMIN') {
//       initialize();
//     }
//   }, [user]);

//   const [newNotificationsCount, setNewNotificationsCount] = useState(0);
//   const [notificationsCount, setNotificationsCount] = useState(0);
//   const [isLoadingNotificationsCount, setIsLoadingNotificationsCount] =
//     useState(false);
//   const [notificationPayload, setNotificationPayload] = useState(null);

//   useEffect(() => {
//     if (notificationPayload) {
//       setNewNotificationsCount(newNotificationsCount + 1);
//       setNotificationsCount(notificationsCount + 1);
//     }
//   }, [notificationPayload]);

//   useEffect(() => {
//     async function initialize() {
//       setIsLoadingNotificationsCount(true);
//       const { count } = await getNotificationsCountByProfileId(user.id);
//       setNotificationsCount(count);
//       setIsLoadingNotificationsCount(false);

//       const notificationsInsertChannel = supabase
//         .channel('notifications-insert')
//         .on(
//           'postgres_changes',
//           {
//             event: 'INSERT',
//             schema: 'public',
//             table: 'notifications',
//             filter: `receiver_user_id=eq.${user.id}`,
//           },
//           (payload) => setNotificationPayload(payload)
//         )
//         .subscribe();

//       return () => notificationsInsertChannel.unsubscribe();
//     }

//     if (user) {
//       initialize();
//     }
//   }, [user]);

//   const receiverProfileIds = useRef([]);
//   const [newPostsCount, setNewPostsCount] = useState(0);
//   const [postsCount, setPostsCount] = useState(0);
//   const [isLoadingPostsCount, setIsLoadingPostsCount] = useState(false);
//   const [postPayload, setPostPayload] = useState(null);

//   useEffect(() => {
//     if (
//       postPayload &&
//       !postPayload.new.is_anonymous &&
//       !postPayload.new.is_archived
//     ) {
//       const hasReceiverProfileId = receiverProfileIds.current.filter(
//         (receiverProfileId) => receiverProfileId === postPayload.new.user_id
//       );

//       if (hasReceiverProfileId.length > 0) {
//         setNewPostsCount(newPostsCount + 1);
//         setPostsCount(postsCount + 1);
//       }
//     }
//   }, [postPayload]);

//   useEffect(() => {
//     async function initialize() {
//       // setIsLoadingPostsCount(true);
//       // const { count } = await getPostsCountByProfileId(user.id);
//       // setPostsCount(count);
//       // setIsLoadingPostsCount(false);

//       const { data } = await getFollowersBySenderProfileId(user.id);
//       receiverProfileIds.current = data.map((follower) => follower.receiver.id);

//       const postChangesChannel = supabase
//         .channel('accepted-post-changes')
//         .on(
//           'postgres_changes',
//           {
//             event: 'INSERT',
//             schema: 'public',
//             table: 'posts',
//             filter: 'status=eq.ACCEPTED',
//           },
//           (payload) => setPostPayload(payload)
//         )
//         .on(
//           'postgres_changes',
//           {
//             event: 'UPDATE',
//             schema: 'public',
//             table: 'posts',
//             filter: 'status=eq.ACCEPTED',
//           },
//           (payload) => setPostPayload(payload)
//         )
//         .subscribe();

//       return () => {
//         postChangesChannel.unsubscribe();
//       };
//     }

//     if (user) {
//       initialize();
//     }
//   }, [user]);

//   return (
//     <BrowserRouter>
//           <ModalContext.Provider value={{ showModal, setShowModal }}>
//             <DataContext.Provider
//               value={{
//                 homeAcceptedPosts,
//                 setHomeAcceptedPosts,
//                 adminPendingPosts,
//                 setAdminPendingPosts,
//                 notifications,
//                 setNotifications,

//                 exploreHorizontalVideos,
//                 setExploreHorizontalVideos,
//                 exploreVerticalVideos,
//                 setExploreVerticalVideos,

//                 exploreAcceptedImagePosts,
//                 setExploreAcceptedImagePosts,
//                 exploreAcceptedVideoPosts,
//                 setExploreAcceptedVideoPosts,
//                 exploreAcceptedDiscussionPosts,
//                 setExploreAcceptedDiscussionPosts,
//                 exploreProfiles,
//                 setExploreProfiles,
//                 profileAcceptedPosts,
//                 setProfileAcceptedPosts,
//                 profilePendingPosts,
//                 setProfilePendingPosts,
//                 profileRejectedPosts,
//                 setProfileRejectedPosts,
//                 profileArchivedPosts,
//                 setProfileArchivedPosts,
//                 profileViewedPosts,
//                 setProfileViewedPosts,
//                 profileAcceptedComments,
//                 setProfileAcceptedComments,
//                 profilePendingComments,
//                 setProfilePendingComments,
//                 profileRejectedComments,
//                 setProfileRejectedComments,
//                 profileArchivedComments,
//                 setProfileArchivedComments,
//                 profileViewedComments,
//                 setProfileViewedComments,
//                 profileFollowers,
//                 setProfileFollowers,
//                 profileFollowing,
//                 setProfileFollowing,
//                 activeProfile,
//                 setActiveProfile,
//               }}
//             >
//               <ScrollContext.Provider value={{ scrollRef }}>
//                 {loadingUser && <Loading />}

//                 {!loadingUser && location.pathname !== '/' && (
//                   <>
//                     {/* <NavBar
//                       notificationsCount={notificationsCount}
//                       isLoadingNotificationsCount={isLoadingNotificationsCount}
//                       postsCount={postsCount}
//                       isLoadingPostsCount={isLoadingPostsCount}
//                       pendingPostsCount={pendingPostsCount}
//                       isLoadingPendingPostsCount={isLoadingPendingPostsCount}
//                     /> */}
//                     <NavBarMobileBottom
//                       notificationsCount={notificationsCount}
//                       isLoadingNotificationsCount={isLoadingNotificationsCount}
//                       postsCount={postsCount}
//                       isLoadingPostsCount={isLoadingPostsCount}
//                     />
//                     {/* <NavBarMobileTop
//                       pendingPostsCount={pendingPostsCount}
//                       isLoadingPendingPostsCount={isLoadingPendingPostsCount}
//                     /> */}

//                     {showModal.type === 'AVATAR_MODAL' && <AvatarModal />}

//                     {showModal.type === 'CREATE_MODAL' && <CreateModal />}

//                     {showModal.type === 'COMMENT_MODAL' && <CommentModal />}

//                     {showModal.type === 'CONFIRM_MODAL' && <ConfirmModal />}
//                   </>
//                 )}

//                 {!loadingUser && (
//                   <main
//                     className={`relative left-0 top-0 flex w-full flex-col gap-4`}
//                   >
//                     <Routes>
//                       <Route
//                         path="/"
//                         element={<WelcomeLayout />}
//                       />
//                       <Route
//                         path="/home"
//                         element={
//                           user ? (
//                             <HomeLayout
//                               postsCount={postsCount}
//                               setPostsCount={setPostsCount}
//                               newPostsCount={newPostsCount}
//                               setNewPostsCount={setNewPostsCount}
//                               isLoadingPostsCount={isLoadingPostsCount}
//                             />
//                           ) : (
//                             <WelcomeLayout />
//                           )
//                         }
//                       />

//                       <Route
//                         path="admin"
//                         element={
//                           user && user.user_role === 'SUPER_ADMIN' ? (
//                             <AdminLayout
//                               setPendingPostsCount={setPendingPostsCount}
//                               newPendingPostsCount={newPendingPostsCount}
//                               setNewPendingPostsCount={setNewPendingPostsCount}
//                             />
//                           ) : (
//                             <ForbiddenLayout />
//                           )
//                         }
//                       />
//                       <Route
//                         path="sign-in"
//                         element={user ? <NoContentLayout /> : <LogInLayout />}
//                       />
//                       <Route
//                         path="sign-up"
//                         element={user ? <NoContentLayout /> : <SignUpLayout />}
//                       />
//                       <Route
//                         path="forgot-password"
//                         element={<ForgotPasswordLayout />}
//                       />
//                       <Route
//                         path="reset-password"
//                         element={
//                           user ? <ResetPasswordLayout /> : <NoContentLayout />
//                         }
//                       />
//                       <Route path="explore" element={<ExploreLayout />}>
//                         <Route
//                           index
//                           element={<ExploreHorizontalVideosNestedLayout />}
//                         />
//                         <Route
//                           path="vertical-videos"
//                           element={<ExploreVerticalVideosNestedLayout />}
//                         />
//                         <Route
//                           path="horizontal-videos"
//                           element={<ExploreHorizontalVideosNestedLayout />}
//                         />
//                         <Route
//                           path="discussions"
//                           element={<ExploreDiscussionPostsNestedLayout />}
//                         />
//                         <Route
//                           path="profiles"
//                           element={<ExploreProfilesNestedLayout />}
//                         />
//                         <Route path="*" element={<NotFoundLayout />} />
//                       </Route>
//                       <Route path="post/:id" element={<PostLayout />} />
//                       <Route path="comment/:id" element={<CommentLayout />} />

//                       <Route
//                         path="profile/:username"
//                         element={<ProfileLayout />}
//                       >
//                         <Route
//                           index
//                           element={<ProfileAcceptedPostsNestedLayout />}
//                         />
//                         <Route
//                           path="accepted-posts"
//                           element={<ProfileAcceptedPostsNestedLayout />}
//                         />
//                         <Route
//                           path="pending-posts"
//                           element={<ProfilePendingPostsNestedLayout />}
//                         />
//                         <Route
//                           path="rejected-posts"
//                           element={<ProfileRejectedPostsNestedLayout />}
//                         />
//                         <Route
//                           path="archived-posts"
//                           element={<ProfileArchivedPostsNestedLayout />}
//                         />
//                         <Route
//                           path="viewed-posts"
//                           element={<ProfileViewedPostsNestedLayout />}
//                         />
//                         <Route
//                           path="followers"
//                           element={<ProfileFollowersNestedLayout />}
//                         />
//                         <Route
//                           path="following"
//                           element={<ProfileFollowingNestedLayout />}
//                         />
//                         <Route path="*" element={<NotFoundLayout />} />
//                       </Route>
//                       <Route
//                         path="notifications"
//                         element={
//                           user ? (
//                             <NotificationsLayout
//                               notificationsCount={notificationsCount}
//                               setNotificationsCount={setNotificationsCount}
//                               newNotificationsCount={newNotificationsCount}
//                               setNewNotificationsCount={
//                                 setNewNotificationsCount
//                               }
//                               isLoadingNotificationsCount={
//                                 isLoadingNotificationsCount
//                               }
//                             />
//                           ) : (
//                             <NoContentLayout />
//                           )
//                         }
//                       />
//                       <Route
//                         path="settings"
//                         element={
//                           session && user ? (
//                             <SettingsLayout />
//                           ) : (
//                             <NoContentLayout />
//                           )
//                         }
//                       />
//                       <Route path="*" element={<NotFoundLayout />} />
//                     </Routes>
//                   </main>
//                 )}
//               </ScrollContext.Provider>
//             </DataContext.Provider>
//           </ModalContext.Provider>
//     </BrowserRouter>
//   );
// }

import { Outlet, useLocation } from 'react-router';
import { DataContextProvider } from './common/context/DataContextProvider.jsx';
import { AuthContextProvider } from './common/context/AuthContextProvider.jsx';
import { ModalContextProvider } from './common/context/ModalContextProvider.jsx';
import NavBar from './components/NavBar.jsx';
import CreateModal from './modals/CreateModal.jsx';
import SearchModal from './modals/SearchModal.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const location = useLocation();

  return (
    <AuthContextProvider>
      <DataContextProvider>
        <ModalContextProvider>
          <main className="mx-auto flex w-full max-w-screen-lg flex-col">
            {location.pathname !== '/' && (
              <>
                <NavBar />
                <CreateModal />
                <SearchModal />
              </>
            )}
            <Outlet />
            {/* <Footer /> */}
          </main>
        </ModalContextProvider>
      </DataContextProvider>
    </AuthContextProvider>
  );
}

export default App;
