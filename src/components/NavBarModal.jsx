import { useContext } from "react";
import { ModalContext, UserContext } from "../common/contexts";
import Modal from "./Modal";
import NavBarModalLink from "./NavBarModalLink";

function NavBarMobileModal() {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  return (
    <Modal>
      <nav className="flex flex-col gap-4">
        <NavBarModalLink handleClick={() => setShowModal(null)} link="/">
          Home
        </NavBarModalLink>
        <NavBarModalLink handleClick={() => setShowModal(null)} link="/explore">
          Explore
        </NavBarModalLink>
        <NavBarModalLink
          handleClick={() => setShowModal(null)}
          link="/questions"
        >
          Questions/Answers
        </NavBarModalLink>
        {user && (
          <NavBarModalLink
            handleClick={() => setShowModal(null)}
            link="/notifications"
          >
            Notifications
          </NavBarModalLink>
        )}
        {user && (
          <NavBarModalLink
            handleClick={() => setShowModal(null)}
            link={`/users/${user.username}#posts`}
            data={{ profile: user }}
          >
            Profile
          </NavBarModalLink>
        )}
        <NavBarModalLink
          handleClick={() => setShowModal(null)}
          link="/settings"
        >
          Settings
        </NavBarModalLink>
        {user && user && user.user_role === "SUPER_ADMIN" && (
          <NavBarModalLink handleClick={() => setShowModal(null)} link="/admin">
            Admin
          </NavBarModalLink>
        )}
        {!user && (
          <>
            <NavBarModalLink
              handleClick={() => setShowModal(null)}
              link="/log-in"
            >
              Log In
            </NavBarModalLink>
            <NavBarModalLink
              handleClick={() => setShowModal(null)}
              link="/sign-up"
            >
              Sign Up
            </NavBarModalLink>
          </>
        )}
      </nav>
    </Modal>
  );
}

export default NavBarMobileModal;
