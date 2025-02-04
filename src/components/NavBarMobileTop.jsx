import { useContext } from 'react';
import { ModalContext, UserContext } from '../common/contexts';
import IconButton from './IconButton';
import SVGOutlinePlus from './svgs/outline/SVGOutlinePlus';
import { BUTTON_COLOR } from '../common/enums';
import SearchBar from './SearchBar';
import SVGSolidShield from './svgs/solid/SVGSolidShield';
import SVGOutlineShield from './svgs/outline/SVGOutlineShield';
import { Link } from 'react-router';
import { useLocation } from 'react-router';

function NavBarMobileTop() {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);
  const location = useLocation();

  return (
    <div className="sticky top-0 z-40 block w-full bg-black p-4 sm:hidden">
      <nav className="flex w-full justify-around gap-2">
        {user && user.user_role === 'SUPER_ADMIN' && (
          <Link
            to="/admin"
            className={`${location.pathname === '/admin' ? 'fill-sky-500' : 'fill-white'} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
          >
            {location.pathname === '/admin' && <SVGSolidShield />}
            {location.pathname !== '/admin' && <SVGOutlineShield />}
          </Link>
        )}
        <SearchBar />
        {user && (
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
