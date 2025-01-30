import { useContext } from "react";
import { Link, useLocation } from "react-router";
import { ModalContext, UserContext } from "../common/contexts";
import IconButton from "./IconButton";
import SVGOutlineMenu from "./svgs/outline/SVGOutlineMenu";
import SVGOutlineHome from "./svgs/outline/SVGOutlineHome";
import SVGSolidHome from "./svgs/solid/SVGSolidHome";
import SVGSolidCompass from "./svgs/solid/SVGSolidCompass";
import SVGOutlineCompass from "./svgs/outline/SVGOutlineCompass";
import SVGSolidUser from "./svgs/solid/SVGSolidUser";
import SVGOutlineUser from "./svgs/outline/SVGOutlineUser";
import SVGOutlinePlus from "./svgs/outline/SVGOutlinePlus";

function NavBarMobile() {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 z-40 flex w-full justify-around bg-black p-4 sm:hidden">
      <Link
        to="/"
        className={`${location.pathname === "/" ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
      >
        {location.pathname === "/" && <SVGSolidHome />}
        {location.pathname !== "/" && <SVGOutlineHome />}
      </Link>
      <Link
        to="/explore"
        className={`${location.pathname === "/explore" ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
      >
        {location.pathname === "/explore" && <SVGSolidCompass />}
        {location.pathname !== "/explore" && <SVGOutlineCompass />}
      </Link>
      {user && (
        <IconButton
          handleClick={() => setShowModal({ type: "CREATE_MODAL" })}
          tailwindColor="emerald"
        >
          <SVGOutlinePlus />
        </IconButton>
      )}
      {user && (
        <Link
          to={`/profile/${user.username}#posts`}
          state={{ profile: user }}
          className={`${location.pathname === `/profile/${user.username}` ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-full border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname === `/profile/${user.username}` && (
            <SVGSolidUser />
          )}
          {location.pathname !== `/profile/${user.username}` && (
            <SVGOutlineUser />
          )}
        </Link>
      )}
      <IconButton handleClick={() => setShowModal({ type: "NAVBAR_MODAL" })}>
        <SVGOutlineMenu />
      </IconButton>
    </nav>
  );
}

export default NavBarMobile;
