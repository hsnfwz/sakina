import { useContext, useEffect, useState, useRef } from 'react';
import { Outlet, useNavigate, Link } from 'react-router';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import Header from '../components/Header.jsx';
import Anchor from '../components/Anchor.jsx';

// import Loading from '../components/Loading.jsx';
// import { getFollowersBySenderProfileId } from '../common/database/followers.js';
// import { getAcceptedPostsByReceiverProfileIds } from '../common/database/posts.js';
// import Loaded from '../components/Loaded.jsx';
// import PostImagePreview from '../components/PostImagePreview.jsx';
// import PostVideoPreview from '../components/PostVideoPreview.jsx';
// import PostDiscussionPreview from '../components/PostDiscussionPreview.jsx';
// import Button from '../components/Button.jsx';
// import { BUTTON_COLOR } from '../common/enums.js';

// function Home({ setPostsCount, newPostsCount, setNewPostsCount }) {
//   const { authUser } = useContext(AuthContext);
//   const { homeAcceptedPosts, setHomeAcceptedPosts } = useContext(DataContext);

//   const receiverProfileIds = useRef([]);

//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setPostsCount(0);

//     if (!homeAcceptedPosts.hasInitialized) {
//       getData();
//     }
//   }, []);

//   async function getData() {
//     setIsLoading(true);

//     const { data: followers } = await getFollowersBySenderProfileId(authUser.id);

//     const receiverIds = followers.map((follower) => follower.receiver.id);

//     receiverProfileIds.current = receiverIds;

//     const { data, hasMore } =
//       await getAcceptedPostsByReceiverProfileIds(receiverIds);

//     const _homeAcceptedPosts = { ...homeAcceptedPosts };

//     if (data.length > 0) {
//       _homeAcceptedPosts.data = [..._homeAcceptedPosts.data, ...data];
//     }

//     _homeAcceptedPosts.hasMore = hasMore;
//     _homeAcceptedPosts.hasInitialized = true;

//     setNewPostsCount(0);

//     setHomeAcceptedPosts(_homeAcceptedPosts);

//     setIsLoading(false);
//   }

//   async function refreshPosts() {
//     setIsLoading(true);

//     const _homeAcceptedPosts = { ...homeAcceptedPosts };

//     const { data } = await getAcceptedPostsByReceiverProfileIds(
//       receiverProfileIds.current,
//       0,
//       newPostsCount
//     );

//     _homeAcceptedPosts.data = [...data, ..._homeAcceptedPosts.data];

//     setNewPostsCount(0);

//     setHomeAcceptedPosts(_homeAcceptedPosts);

//     setIsLoading(false);
//   }

//   return (
//     <div className="flex w-full flex-col gap-4">
//       <h1>Salam {authUser.username}!</h1>
//       {homeAcceptedPosts.hasInitialized && newPostsCount > 0 && (
//         <Button
//           color={BUTTON_COLOR.BLUE}
//           handleClick={refreshPosts}
//           isDisabled={isLoading}
//         >
//           Refresh ({newPostsCount})
//         </Button>
//       )}
//       {homeAcceptedPosts.data.map((post) => (
//         <div key={post.id}>
//           {post.type === 'IMAGE' && <PostImagePreview postImage={post} />}
//           {post.type === 'VIDEO' && <PostVideoPreview postVideo={post} />}
//           {post.type === 'DISCUSSION' && (
//             <PostDiscussionPreview postDiscussion={post} />
//           )}
//         </div>
//       ))}
//       {isLoading && <Loading />}
//       {!homeAcceptedPosts.hasMore && <Loaded />}
//     </div>
//   );
// }

function Home() {
  const { authUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (authUser) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [authUser]);

  if (show) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Header>Home</Header>
        <nav className="flex w-full">
          <Anchor
            active={
              location.pathname === '/home' ||
              location.pathname.includes('videos')
            }
            to="videos"
          >
            Videos
          </Anchor>
          <Anchor active={location.pathname.includes('clips')} to="clips">
            Clips
          </Anchor>
          <Anchor
            active={location.pathname.includes('discussions')}
            to="discussions"
          >
            Discussions
          </Anchor>
        </nav>
        <Outlet />
      </div>
    );
  }
}

export default Home;
