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

import { Outlet, useLocation } from 'react-router';
import { DataContextProvider } from './common/context/DataContextProvider.jsx';
import { AuthContextProvider } from './common/context/AuthContextProvider.jsx';
import { ModalContextProvider } from './common/context/ModalContextProvider.jsx';
import NavBar from './components/NavBar.jsx';
import CreateModal from './modals/CreateModal.jsx';
import SearchModal from './modals/SearchModal.jsx';
import EditModal from './modals/EditModal.jsx';
import AvatarModal from './modals/AvatarModal.jsx';
import HideModal from './modals/HideModal.jsx';
import CommentModal from './modals/CommentModal.jsx';

function App() {
  const location = useLocation();

  return (
    <AuthContextProvider>
      <DataContextProvider>
        <ModalContextProvider>
          <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
            {location.pathname !== '/' && (
              <>
                <NavBar />
                <AvatarModal />
                <CreateModal />
                <SearchModal />
                <EditModal />
                <HideModal />
                <CommentModal />
              </>
            )}
            <Outlet />
          </main>
        </ModalContextProvider>
      </DataContextProvider>
    </AuthContextProvider>
  );
}

export default App;
