import { useContext } from "react";
import { ModalContext, UserContext } from "../common/contexts";
import IconButton from "./IconButton";
import NavBarLink from "./NavBarLink";
import SVGHome from "./svg/SVGHome";
import SVGMenu from "./svg/SVGMenu";
import SVGPlus from "./svg/SVGPlus";

function NavBarMobile() {
  const { user } = useContext(UserContext);

  const { setShowModal } = useContext(ModalContext);

  return (
    <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around gap-4 border-t border-t-neutral-700 bg-black p-4 lg:hidden">
      <NavBarLink link="/">
        <SVGHome />
      </NavBarLink>

      {user && (
        <IconButton handleClick={() => setShowModal({ type: "POST_MODAL" })}>
          <SVGPlus />
        </IconButton>
      )}

      <IconButton handleClick={() => setShowModal({ type: "NAVBAR_MODAL" })}>
        <SVGMenu />
      </IconButton>
    </nav>
  );
}

export default NavBarMobile;
