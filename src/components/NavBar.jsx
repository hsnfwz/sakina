import { useContext } from 'react';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider';
import Button from './Button';
import SVGSolidHome from './svgs/solid/SVGSolidHome';
import SVGOutlineHome from './svgs/outline/SVGOutlineHome';
import SVGSolidCompass from './svgs/solid/SVGSolidCompass';
import SVGOutlineCompass from './svgs/outline/SVGOutlineCompass';
import SVGSolidBell from './svgs/solid/SVGSolidBell';
import SVGOutlineBell from './svgs/outline/SVGOutlineBell';
import SVGSolidUser from './svgs/solid/SVGSolidUser';
import SVGOutlineUser from './svgs/outline/SVGOutlineUser';
import SVGSolidSettings from './svgs/solid/SVGSolidSettings';
import SVGOutlineSettings from './svgs/outline/SVGOutlineSettings';
import SVGSolidShield from './svgs/solid/SVGSolidShield';
import SVGOutlineShield from './svgs/outline/SVGOutlineShield';
import SVGOutlinePlus from './svgs/outline/SVGOutlinePlus';
import SVGSolidUserArrow from './svgs/solid/SVGSolidUserArrow';
import SVGSolidUserPlus from './svgs/solid/SVGSolidUserPlus';
import SVGOutlineUserArrow from './svgs/outline/SVGOutlineUserArrow';
import SVGOutlineUserPlus from './svgs/outline/SVGOutlineUserPlus';
import { BUTTON_COLOR } from '../common/enums';
import { formatCount } from '../common/helpers.js';

function NavBar() {
  const { authUser } = useContext(AuthContext);
  const { setShowModal } = useContext(ModalContext);

  return (
    <nav className="flex w-full bg-black text-white">
      {authUser && (
        <Link className="px-4 py-2 text-xs" to="/home">
          Home
        </Link>
      )}

      <Link className="px-4 py-2 text-xs" to="/search">
        Search
      </Link>

      {authUser && (
        <>
          <Link className="px-4 py-2 text-xs" to="/inbox">
            Inbox
          </Link>
          <Link className="px-4 py-2 text-xs" to="/profile">
            Profile
          </Link>
          <Link className="px-4 py-2 text-xs" to="/settings">
            Settings
          </Link>
        </>
      )}

      {authUser && (
        <button
          type="button"
          className="px-4 py-2 text-xs"
          onClick={() => setShowModal({ type: 'CREATE_MODAL' })}
        >
          Create
        </button>
      )}
    </nav>
  );
}

// function NavBar({
//   notificationsCount,
//   isLoadingNotificationsCount,
//   postsCount,
//   isLoadingPostsCount,
//   pendingPostsCount,
//   isLoadingPendingPostsCount,
// }) {
//   const { user } = useContext(AuthContext);
//   const { setShowModal } = useContext(ModalContext);
//   const location = useLocation();

//   return (
//     <div className="fixed left-0 top-0 z-40 hidden h-full w-full max-w-[200px] border-r-2 border-neutral-700 bg-black p-4 sm:block">
//       <nav className="flex h-full w-full flex-col gap-4 sm:overflow-auto">
//         {user && user.user_role === 'SUPER_ADMIN' && (
//           <Link
//             to="/admin"
//             className={`${location.pathname.includes('/admin') ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
//           >
//             <div className="relative left-0 top-0">
//               {location.pathname.includes('/admin') && (
//                 <div className="relative left-0 top-0">
//                   <SVGSolidShield />
//                 </div>
//               )}
//               {!location.pathname.includes('/admin') && (
//                 <div className="relative left-0 top-0">
//                   <SVGOutlineShield />
//                 </div>
//               )}
//               {!isLoadingPendingPostsCount && pendingPostsCount > 0 && (
//                 <span className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-xs text-black">
//                   {formatCount(pendingPostsCount)}
//                 </span>
//               )}
//             </div>

//             <span
//               className={`${location.pathname.includes('/admin') ? 'text-sky-500' : 'text-black'}`}
//             >
//               Admin
//             </span>
//           </Link>
//         )}
//         <Link
//           to="/"
//           className={`${location.pathname === '/' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
//         >
//           <div className="relative left-0 top-0">
//             {location.pathname === '/' && (
//               <div className="relative left-0 top-0">
//                 <SVGSolidHome />
//               </div>
//             )}
//             {location.pathname !== '/' && (
//               <div className="relative left-0 top-0">
//                 <SVGOutlineHome />
//               </div>
//             )}
//             {!isLoadingPostsCount && postsCount > 0 && (
//               <span className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-xs text-black">
//                 {formatCount(postsCount)}
//               </span>
//             )}
//           </div>

//           <span
//             className={`${location.pathname === '/' ? 'text-sky-500' : 'text-black'}`}
//           >
//             Home
//           </span>
//         </Link>

//         <Link
//           to="/explore"
//           className={`${location.pathname.includes('/explore') ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
//         >
//           {location.pathname.includes('/explore') && <SVGSolidCompass />}
//           {!location.pathname.includes('/explore') && <SVGOutlineCompass />}
//           <span
//             className={`${location.pathname.includes('/explore') ? 'text-sky-500' : 'text-black'}`}
//           >
//             Explore
//           </span>
//         </Link>
//         {user && (
//           <Link
//             to="/notifications"
//             className={`${location.pathname.includes('/notifications') ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
//           >
//             <div className="relative left-0 top-0">
//               {location.pathname.includes('/notifications') && (
//                 <div className="relative left-0 top-0">
//                   <SVGSolidBell />
//                 </div>
//               )}
//               {!location.pathname.includes('/notifications') && (
//                 <div className="relative left-0 top-0">
//                   <SVGOutlineBell />
//                 </div>
//               )}
//               {!isLoadingNotificationsCount && notificationsCount > 0 && (
//                 <span className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-xs text-black">
//                   {formatCount(notificationsCount)}
//                 </span>
//               )}
//             </div>

//             <span
//               className={`${location.pathname.includes('/notifications') ? 'text-sky-500' : 'text-black'}`}
//             >
//               Notifications
//             </span>
//           </Link>
//         )}
//         {user && (
//           <Link
//             to={`/profile/${user.username}`}
//             state={{ profile: user }}
//             className={`${location.pathname.includes(`/profile/${user.username}`) ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
//           >
//             {location.pathname.includes(`/profile/${user.username}`) && (
//               <SVGSolidUser />
//             )}
//             {!location.pathname.includes(`/profile/${user.username}`) && (
//               <SVGOutlineUser />
//             )}
//             <span
//               className={`${location.pathname.includes(`/profile/${user.username}`) ? 'text-sky-500' : 'text-black'}`}
//             >
//               Profile
//             </span>
//           </Link>
//         )}
//         {user && (
//           <Link
//             to="/settings"
//             className={`${location.pathname === '/settings' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
//           >
//             {location.pathname === '/settings' && <SVGSolidSettings />}
//             {location.pathname !== '/settings' && <SVGOutlineSettings />}
//             <span
//               className={`${location.pathname === '/settings' ? 'text-sky-500' : 'text-black'}`}
//             >
//               Settings
//             </span>
//           </Link>
//         )}
//         {user && (
//           <Button
//             handleClick={() => setShowModal({ type: 'CREATE_MODAL' })}
//             buttonColor={BUTTON_COLOR.GREEN}
//           >
//             <SVGOutlinePlus />
//             <span>Create</span>
//           </Button>
//         )}
//         {!user && (
//           <>
//             <Link
//               onClick={() =>
//                 setShowModal({
//                   type: null,
//                   data: null,
//                 })
//               }
//               to="/log-in"
//               className={`${location.pathname === '/log-in' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
//             >
//               {location.pathname === '/log-in' && <SVGSolidUserArrow />}
//               {location.pathname !== '/log-in' && <SVGOutlineUserArrow />}
//               <span
//                 className={`${location.pathname === '/log-in' ? 'text-sky-500' : 'text-black'}`}
//               >
//                 Log In
//               </span>
//             </Link>
//             <Link
//               onClick={() =>
//                 setShowModal({
//                   type: null,
//                   data: null,
//                 })
//               }
//               to="/sign-up"
//               className={`${location.pathname === '/sign-up' ? 'fill-sky-500' : 'fill-white'} flex gap-4 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
//             >
//               {location.pathname === '/sign-up' && <SVGSolidUserPlus />}
//               {location.pathname !== '/sign-up' && <SVGOutlineUserPlus />}
//               <span
//                 className={`${location.pathname === '/sign-up' ? 'text-sky-500' : 'text-black'}`}
//               >
//                 Sign Up
//               </span>
//             </Link>
//           </>
//         )}
//       </nav>
//     </div>
//   );
// }

export default NavBar;
