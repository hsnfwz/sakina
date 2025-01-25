import { useContext } from "react";
import { ModalContext, UserContext } from "../common/contexts";
import IconButton from "./IconButton";
import NavBarLink from "./NavBarLink";
import SVGAdmin from "./svg/SVGAdmin";
import SVGBubble from "./svg/SVGBubble";
import SVGHome from "./svg/SVGHome";
import SVGNotification from "./svg/SVGNotification";
import SVGPlus from "./svg/SVGPlus";
import SVGProfile from "./svg/SVGProfile";
import SVGSearch from "./svg/SVGSearch";
import SVGSettings from "./svg/SVGSettings";

function NavBar({}) {
  const { user } = useContext(UserContext);

  const { setShowModal } = useContext(ModalContext);

  return (
    <nav className="dark:black fixed left-0 top-0 z-40 hidden h-full flex-col gap-4 border-r p-4 lg:flex dark:border-r-neutral-700">
      {user && (
        <IconButton handleClick={() => setShowModal({ type: "POST_MODAL" })}>
          <SVGPlus />
        </IconButton>
      )}
      <NavBarLink link="/">
        <SVGHome />
      </NavBarLink>
      <NavBarLink link="/explore">
        <SVGSearch />
      </NavBarLink>
      <NavBarLink link="questions">
        <SVGBubble />
      </NavBarLink>
      {user && (
        <NavBarLink link="/notifications">
          <SVGNotification />
        </NavBarLink>
      )}
      {user && (
        <NavBarLink
          link={`/users/${user.username}#posts`}
          data={{ profile: user }}
        >
          <SVGProfile />
        </NavBarLink>
      )}
      <NavBarLink link="/settings">
        <SVGSettings />
      </NavBarLink>
      {user && user && user.user_role === "SUPER_ADMIN" && (
        <NavBarLink link="/admin">
          <SVGAdmin />
        </NavBarLink>
      )}
    </nav>
  );
}

export default NavBar;
