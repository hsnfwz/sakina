import { useContext } from 'react';
import { ModalContext } from '../common/contexts';
import { AuthContext } from '../common/context/AuthContextProvider';
import IconButton from './IconButton';
import SVGOutlinePlus from './svgs/outline/SVGOutlinePlus';
import { BUTTON_COLOR } from '../common/enums';
import SVGSolidShield from './svgs/solid/SVGSolidShield';
import SVGOutlineShield from './svgs/outline/SVGOutlineShield';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { formatCount } from '../common/helpers';

function NavBarMobileTop({ pendingPostsCount, isLoadingPendingPostsCount }) {
  const { authUser } = useContext(AuthContext);
  const { setShowModal } = useContext(ModalContext);
  const location = useLocation();

  return (
    <div className="sticky top-0 z-40 block w-full bg-black p-4 sm:hidden">
      <nav className="flex w-full justify-around gap-2">
        {authUser && authUser.user_role === 'SUPER_ADMIN' && (
          <Link
            to="/admin"
            className={`${location.pathname === '/admin' ? 'fill-sky-500' : 'fill-white'} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
          >
            <div className="relative left-0 top-0">
              {location.pathname.includes('/admin') && (
                <div className="relative left-0 top-0">
                  <SVGSolidShield />
                </div>
              )}
              {!location.pathname.includes('/admin') && (
                <div className="relative left-0 top-0">
                  <SVGOutlineShield />
                </div>
              )}
              {!isLoadingPendingPostsCount && pendingPostsCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-xs text-black">
                  {formatCount(pendingPostsCount)}
                </span>
              )}
            </div>
          </Link>
        )}
        {authUser && (
          <IconButton
            handleClick={() => setShowModal({ type: 'CREATE_MODAL' })}
            buttonColor={BUTTON_COLOR.GREEN}
          >
            <SVGOutlinePlus />
          </IconButton>
        )}
      </nav>
    </div>
  );
}

export default NavBarMobileTop;
